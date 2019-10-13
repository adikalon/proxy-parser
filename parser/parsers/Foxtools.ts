import Parser from './../common/Parser'
import { ProxyData } from './../../common/Types'

module.exports = class Foxtools extends Parser {
  public getName (): string {
    return 'Foxtools'
  }

  public getDescription (): string {
    return 'Foxtools - бесплатные прокси'
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
