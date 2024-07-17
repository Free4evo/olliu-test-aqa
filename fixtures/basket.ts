import { Locator, Page, expect } from "@playwright/test"
import { NavigationPage } from "./navigationPage"
import { Discount, Product } from "../types/product"

export class Basket extends NavigationPage {

  constructor(page: Page){
    super(page)
  }

  async clearBasket(){
    await this.page.waitForLoadState('domcontentloaded')
    const clearBasketButton : Locator = this.page.getByRole('button').filter({hasText: 'Очистить корзину'})
    const basketCountItems : Locator = this.page.locator('.basket-count-items')
    await basketCountItems.isVisible()
    if (Number(await basketCountItems.innerText()) != 0){
      await this.basketPopup()
      await basketCountItems.isVisible()
      await clearBasketButton.click()
    }
    expect(Number(await basketCountItems.innerText())).toBe(0)
  }

  async addProductToBasket(itemCount: number, productCount: number, discount: Discount){
    await this.page.waitForLoadState('domcontentloaded')
    let products: Locator[] = []
    let selectedProducts: Product[] = []

    switch(discount){
      case Discount.DISCOUNT:
        await this.page.locator('#gridCheck').isVisible()
        await this.page.locator('#gridCheck').check({force: true})
        await this.page.waitForLoadState('networkidle') 
        products = await this.page.locator('.hasDiscount').all()
      break
      case Discount.USUAL:
        products = await this.page.locator('.note-item').filter({has: this.page.locator('.d-none')}).all()
      break
    }

    const count = products.length

    for (let i = 0; i < products.length; i++){
      const availableProductCount = Number(await products[i].locator('.product_count').innerText())
      console.log('Item count: '+availableProductCount)
      if (availableProductCount >= itemCount){
        await products[i].locator('[name="product-enter-count"]').fill(`${itemCount}`)
        await products[i].locator('.actionBuyProduct').click()
        
        selectedProducts.push({
          name: await products[i].locator('.product_name').innerText(),
          price: await products[i].locator('.product_price').innerText()
        }) 
  
        if (selectedProducts.length = productCount){
          break
        }
      }
    }

    return selectedProducts
  }

  async checkProductInBasketPopup(products: Product[]){
    await this.page.waitForLoadState('domcontentloaded')
    let totalPrice: number = 0
    const basketItems = await this.page.locator('li.basket-item').all()
    expect(products.length).toBeGreaterThan(0)
    expect(basketItems.length).toBeGreaterThan(0)
    expect(products.length).toEqual((basketItems).length)
    expect(Number(this.page.locator('.basket_price').innerText())).toEqual(totalPrice)

    const allProductsInBasketPresentInProducts = basketItems.every((basketItem) =>
      products.some(async (product) => product.name === await basketItem.locator('.basket-item-title').innerText())
    )

    expect(allProductsInBasketPresentInProducts).toBeTruthy()
  }
}
