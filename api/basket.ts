import { APIRequestContext, APIResponse, expect} from '@playwright/test'

export class BasketAPI {

  readonly request: APIRequestContext

  constructor(request: APIRequestContext){
    this.request = request
  }

  async clearBasket(accessToken: string){
    const cleanBasketResponse = await this.request.post('https://enotes.pointschool.ru/basket/clear', {
      headers: {
        'X-Csrf-Token': accessToken,
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      }
    })
    expect(await cleanBasketResponse.json()).toEqual({"response":true})
    const basket = this.checkBasket()
    expect(await basket).toEqual({"response":true,"basket":[],"basketCount":0,"basketPrice":0})
  }

  async addToBasket(id: number, count: number){
    const form = new FormData()
    form.set('product', `${id}`)
    form.append('count', `${count}`)
    const addToBasketResponse = await this.request.post('https://enotes.pointschool.ru/basket/create', {
      multipart: form
    })
    expect(addToBasketResponse.json()).toBe({"response":true})
  }

  async checkBasket(){
    const getBasket = await this.request.post('https://enotes.pointschool.ru/basket/get', {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      }
    })

    return getBasket.json()
  }
}