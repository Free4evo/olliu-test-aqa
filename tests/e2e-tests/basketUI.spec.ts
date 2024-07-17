import { test, expect } from '@playwright/test'
import { AuthPage } from '../../fixtures/auth'
import { Basket } from '../../fixtures/basket'
import { Discount } from '../../types/product'

test.beforeEach( async ({ page }) => {
  const authPage = new AuthPage(page)
  const basket = new Basket(page)

  authPage.mainPage()
  authPage.login()
  basket.clearBasket()
})

test('UI Case 1', async ({ page }) => {
  const basket = new Basket(page)
  const productWithDiscount = await basket.addProductToBasket(9, 1, Discount.DISCOUNT)
  await page.waitForTimeout(1000);
  expect(Number(await page.locator('.basket-count-items').innerText())).toBe(9)

  await basket.basketPopup()
  basket.checkProductInBasketPopup(productWithDiscount)

  await basket.basketPage()
  expect(await page.getByText('Server Error (#500)').innerText()).not.toContain('Server Error')
})

test('UI Case 2', async ({ page }) => {const authPage = new AuthPage(page)
  const basket = new Basket(page)

  const productWithDiscount = await basket.addProductToBasket(1, 1, Discount.DISCOUNT)

  let allproductsAny = await basket.addProductToBasket(1, 8, Discount.ANY)
  expect(Number(await page.locator('.basket-count-items').innerText())).toBe(9)

  allproductsAny.push(productWithDiscount[0])
  await basket.basketPopup()
  basket.checkProductInBasketPopup(allproductsAny)

  await basket.basketPage()
  expect(await page.getByText('Server Error (#500)').innerText()).not.toContain('Server Error')
})

test('UI Case 3', async ({ page }) => {
  const basket = new Basket(page)
  const productWithDiscount = await basket.addProductToBasket(1, 1, Discount.DISCOUNT)
  expect(Number(await page.locator('.basket-count-items').innerText())).toBe(1)

  await basket.basketPopup()
  basket.checkProductInBasketPopup(productWithDiscount)

  await basket.basketPage()
  expect(await page.getByText('Server Error (#500)').innerText()).not.toContain('Server Error')
})

test('UI Case 4', async ({ page }) => {
  const basket = new Basket(page)
  const productWithoutDiscount = await basket.addProductToBasket(1, 1, Discount.USUAL)
  expect(Number(await page.locator('.basket-count-items').innerText())).toBe(1)

  await basket.basketPopup()
  basket.checkProductInBasketPopup(productWithoutDiscount)

  await basket.basketPage()
  expect(await page.getByText('Server Error (#500)').innerText()).not.toContain('Server Error')
})
