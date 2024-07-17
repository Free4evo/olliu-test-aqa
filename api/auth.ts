import { APIRequestContext, APIResponse } from '@playwright/test'

export class AuthAPI {

  readonly request: APIRequestContext

  constructor(request: APIRequestContext){
    this.request = request
  }

  async tokenExtractor({ response }: { response: APIResponse }){
    const regex = /<meta name="csrf-token" content="([^"]+)">/
    const match = (await response.text()).match(regex)
    const token = match ? match[1] : ''
  
    console.log("Token "+token.toString())
    return token.toString()
  }

  async authentication(){
    const responseGet = await this.request.get('https://enotes.pointschool.ru/login')
    const baseToken = this.tokenExtractor({ response: responseGet })
    const form = new FormData()
    form.set('_csrf', await baseToken)
    form.append('LoginForm[username]', 'test')
    form.append('LoginForm[password]', 'test')
    form.append('LoginForm[rememberMe]', '0')
    form.append('login-button', '')
    const responsePost = await this.request.post('https://enotes.pointschool.ru/login', {
      multipart: form
    })
    const accessToken = this.tokenExtractor({ response: responsePost })
    process.env['API_TOKEN'] = await accessToken

    return (await accessToken).toString()
  }
}
