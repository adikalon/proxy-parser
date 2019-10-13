import Parser from './../common/Parser'
import { ProxyData } from './../../common/Types'

module.exports = class Hidemy extends Parser {
  public getName (): string {
    return 'Hidemi'
  }

  public getDescription (): string {
    return 'Hidemi - бесплатные прокси'
  }

  public getProxies (page: number): Promise<ProxyData[]> {
    return new Promise((resolve, reject) => {
      resolve([{
        country: 'temp',
        type: 'temp',
        ip: 'temp',
        port: 0,
        source: 'temp',
      }])
    })
  }
}
