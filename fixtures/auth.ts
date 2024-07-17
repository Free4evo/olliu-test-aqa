import { Page, expect } from "@playwright/test"
import { NavigationPage } from "./navigationPage"

export class AuthPage extends NavigationPage {

  constructor(page: Page){
    super(page)
  }

  async login(){
    await this.page.getByText('Вход').click()
    await this.fillLoginFormAndSubmit('test', 'test', false)
    await expect(this.page.locator('#basketContainer')).toContainText('Корзина')
  }

  async fillLoginFormAndSubmit(username: string, password: string, remember: boolean){
    const usernameInput = this.page.locator('#loginform-username')
    const passwordInput = this.page.locator('#loginform-password')
    const rememberMeCheckbox = this.page.locator('#loginform-rememberme')
    const submitButton = this.page.getByRole("button").and(this.page.getByText('Вход'))

    await usernameInput.isVisible()
    await this.page.waitForLoadState('domcontentloaded')
    await usernameInput.pressSequentially(username, {delay: 100})
    await passwordInput.pressSequentially(password, {delay: 100})
    await passwordInput.click()
    await this.page.keyboard.press("Tab")

    if (remember){
      await rememberMeCheckbox.check({force: true})
    } else {
      await rememberMeCheckbox.uncheck({force: true})
    }
    await submitButton.click()
  }
}