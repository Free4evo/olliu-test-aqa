import { Page } from "@playwright/test"

export class NavigationPage {
  readonly page: Page

  constructor(page: Page){
    this.page = page
  }

  async mainPage(){
    await this.page.goto('/')
  }

  async loginPage(){
    await this.page.getByText('Вход').click()
  }

  async basketPopup(){
    await this.page.locator('#dropdownBasket').click()
  }

  async basketPage(){
    await this.page.getByText('Перейти в корзину').click()
  }
}