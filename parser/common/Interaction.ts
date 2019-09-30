import fs = require('fs')
import Parser from './Parser'

export default class Interaction {
  public static list (): object[] {
    let resources = []

    const elems: string[] = fs.readdirSync(__dirname + '/../parsers')

    for (const elem of elems) {
      if (elem.split('.').pop() === 'js') {
        const cls = require(`./../parsers/${elem}`)

        if (cls.prototype instanceof Parser) {
          resources.push({
            name: cls.prototype.getName(),
            description: cls.prototype.getDescription(),
            file: elem
          })
        }
      }
    }

    return resources
  }
}
