import Parser from './../common/Parser'

module.exports = class Foxtools extends Parser {
  public getName (): string {
    return 'Foxtools'
  }

  public getDescription (): string {
    return 'Foxtools - бесплатные прокси'
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
