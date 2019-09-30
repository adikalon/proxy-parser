import Parser from './../common/Parser'

module.exports = class Foxtools extends Parser {
  public getName (): string {
    return 'Foxtools'
  }

  public getDescription (): string {
    return 'Foxtools - бесплатные прокси'
  }
}
