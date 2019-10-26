import Parser from './../common/Parser'
import { ProxyData } from './../../common/Types'
import https = require('https')
import cheerio = require('cheerio')

module.exports = class ProxySale extends Parser {
  public getName (): string {
    return 'ProxySale'
  }

  public getDescription (): string {
    return 'ProxySale - бесплатные прокси-сервера.<br>' +
           'Источник: https://free.proxy-sale.com<br>' +
           'Прокси, порты которых указаны как картинка, пропускаются'
  }

  private row: Cheerio

  public async getProxies (page: number): Promise<ProxyData[] | null> {
    let proxies: ProxyData[] = []
    let skipPage: boolean = false

    return this.delay().then(() => {
      return new Promise((resolve, reject) => {
        const req = https.request(`https://free.proxy-sale.com/?proxy_page=${page}`, (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`Статус ответа: ${res.statusCode}`))
          }

          let page: string = ''

          res.on('data', (chunk) => {
            page += chunk.toString()
          })

          res.on('end', () => {
            if (!page.trim()) {
              reject(new Error('Страница не загрузилась'))
            }

            if (!page.includes('<a class="active"')) {
              resolve(proxies)
            }

            const $    = cheerio.load(page)
            const rows = $('div.main__table-wrap > table > tbody > tr')

            rows.each((i, row) => {
              this.row = $(row)

              const port: string = this.row.find('td').eq(1).find('div').text().trim()

              if (port.match(/^\d+$/) !== null) {
                try {
                  proxies.push({
                    country: this.country(),
                    type: this.type(),
                    ip: this.ip(),
                    port: this.port(),
                    source: this.source()
                  })
                } catch (e) {
                  reject(e)
                }
              } else {
                skipPage = true
              }
            })

            if (proxies.length <= 0) {
              if (skipPage) {
                resolve(null)
              } else {
                reject(new Error('На странице не найдено проксей'))
              }
            } else {
              resolve(proxies)
            }
          })
        })

        req.on('error', (e) => {
          reject(new Error(`Ошибка запроса: ${e.message}`))
        })

        req.end()
      })
    })
  }

  private country (): string {
    const str: string = this.row.find('td').eq(2).find('a').text().trim()

    if (!str) {
      throw new Error('Не удалось найти страну')
    }

    return str
  }

  private type (): string {
    const str: string = this.row.find('td').eq(3).find('a').text().trim()

    if (!str) {
      throw new Error('Не удалось найти тип')
    }

    return str
  }

  private ip (): string {
    const str: string = this.row.find('td').eq(0).find('a').text().trim()
    const re: RegExp = /(?<val>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/
    const match: RegExpMatchArray = str.match(re)

    if (match === null) {
      throw new Error('Не удалось найти ip')
    }

    return match.groups.val
  }

  private port (): number {
    const str: string = this.row.find('td').eq(1).find('div').text().trim()

    if (str.match(/^\d+$/) === null) {
      throw new Error('Не удалось найти порт')
    }

    return +str
  }

  private source (): string {
    return 'ProxySale'
  }
}
