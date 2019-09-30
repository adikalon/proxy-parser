import Parser from './../common/Parser'

module.exports = class Hidemy extends Parser {
  public getName (): string {
    return 'Hidemi'
  }

  public getDescription (): string {
    return 'Hidemi - бесплатные прокси'
  }
}
