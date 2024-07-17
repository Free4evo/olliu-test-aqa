import { expect, test } from '@playwright/test'
import { AuthAPI } from '../../api/auth'
import { BasketAPI } from '../../api/basket'
import { ProductsAPI } from '../../api/products'
import { Discount } from '../../types/product'

test.beforeEach( async ({ request }) => {
  const auth = new AuthAPI(request)
  const csrftoken = await auth.authentication()
  const basket = new BasketAPI(request)
  basket.clearBasket(csrftoken)
})

test('API Case 1', async ({request}) => {
  const product = new ProductsAPI(request)
  const basket = new BasketAPI(request)
  const productsWithDiscount = await product.getProducts(Discount.DISCOUNT)
  basket.addToBasket(productsWithDiscount[0].id, 9)
  const basketProducts = JSON.parse(await basket.checkBasket())
  expect(basketProducts.basketCount).toEqual(9)
})

test('API Case 2', async ({request}) => {
  const product = new ProductsAPI(request)
  const basket = new BasketAPI(request)
  const productsWithDiscount = product.getProducts(Discount.DISCOUNT)
  basket.addToBasket(productsWithDiscount[0].id, 1)
  const productsAny = product.getProducts(Discount.ANY)
  for (let i = 1; i < 9; i++){
    basket.addToBasket(productsAny[i].id, 1)
  }
  (await productsAny).push(await productsWithDiscount[0])
  const basketProducts = JSON.parse(await basket.checkBasket())
  expect(basketProducts.basketCount).toEqual(9)
})

test('API Case 3', async ({request}) => {
  const product = new ProductsAPI(request)
  const basket = new BasketAPI(request)
  const productsWithDiscount = product.getProducts(Discount.DISCOUNT)
  basket.addToBasket(productsWithDiscount[0].id, 1)
  const basketProducts = JSON.parse(await basket.checkBasket())
  expect(basketProducts.basketCount).toEqual(1)
})

test('API Case 4', async ({request}) => {
  const product = new ProductsAPI(request)
  const basket = new BasketAPI(request)
  const productsWithDiscount = product.getProducts(Discount.USUAL)
  basket.addToBasket(productsWithDiscount[0].id, 1)
  const basketProducts = JSON.parse(await basket.checkBasket())
  expect(basketProducts.basketCount).toEqual(1)
})
