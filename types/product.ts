export type Product = {
  id: number
  name: string
  type: string
  price: number
  discount: number
  count: number
  poster: string
}

export type BasketProduct = {
  name: string
  price: number | undefined
}

export enum Discount {
  DISCOUNT = 'discount',
  USUAL = 'usual',
  ANY = 'any'
}

export type ProductsResponse = {
  [x: string]: any
  response: boolean
  error: string
  products: Product[]
  page: number
  pages: number
}
