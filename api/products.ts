import { APIRequestContext, APIResponse, expect} from '@playwright/test'
import { Discount, ProductsResponse } from '../types/product'

export class ProductsAPI {

  readonly request: APIRequestContext

  constructor(request: APIRequestContext){
    this.request = request
  }

  async getProducts(discount: Discount){
    const form = new FormData()
    switch(discount){
      case Discount.DISCOUNT:
        form.set('filters', 'search=&price-from=&price-to=&is-discount=on')
        form.append('action', 'discount')
      break
      case Discount.ANY:
        form.set('filters', 'search=&price-from=&price-to=')
        form.append('action', '')
      break
    }
    
    form.append('page', '1')
    const products = await this.request.post('https://enotes.pointschool.ru/product/get', {
      multipart: form
    })

    return products.json()
  }
}
