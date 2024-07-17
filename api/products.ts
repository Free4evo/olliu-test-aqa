import { APIRequestContext, APIResponse, expect} from '@playwright/test'
import { Discount, Product, ProductsResponse } from '../types/product'

export class ProductsAPI {

  readonly request: APIRequestContext

  constructor(request: APIRequestContext){
    this.request = request
  }

  async getProducts(discount: Discount){
    const form = new FormData()
    form.set('filters', 'search=&price-from=&price-to=')
    form.append('action', '')
    form.append('page', '1')
    const products: APIResponse = await this.request.post('https://enotes.pointschool.ru/product/get', {
      multipart: form
    })
    const parsedProducts: ProductsResponse = await products.json()
    let parsedProductResponse: Product [] = []

    switch(discount){
      case Discount.ANY:
        parsedProductResponse = parsedProducts.products
      break
      case Discount.DISCOUNT:
        parsedProductResponse = parsedProducts.products.filter((product: Product) => product.discount != 0)
      break
      case Discount.USUAL:
        parsedProductResponse = parsedProducts.products.filter((product: Product) => product.discount == 0)
      break
    }

    return parsedProductResponse
  }
}
