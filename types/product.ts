export type Product = {
  name: String
  price: String
}

export enum Discount {
  DISCOUNT = 'discount',
  USUAL = 'usual',
  ANY = 'any'
}

export type ProductsResponse = {
  response: boolean
  error: string
  products: [
      {
          id?: number
          name?: string
          type?: string
          price?: number
          discount?: number
          count?: number
          poster?: string
      }
  ]
  page: number
  pages: number
}
