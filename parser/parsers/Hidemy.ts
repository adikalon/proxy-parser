import Parser from './../common/Parser'

module.exports = class Hidemy extends Parser {
  public getName (): string {
    return 'Hidemi'
  }

  public getDescription (): string {
    return 'Hidemi - бесплатные прокси'
  }

  public getProxies (page: number): {country: string, type: string, ip: string, port: number, source: string}[] {
    return [{
      country: 'temp',
      type: 'temp',
      ip: 'temp',
      port: 0,
      source: 'temp',
    }]
  }
}
