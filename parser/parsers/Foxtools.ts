import Parser from './../common/Parser'
import { ProxyData } from './../../common/Types'
import http = require('http')
import cheerio = require('cheerio')

module.exports = class Foxtools extends Parser {
  public getName (): string {
    return 'FoxTools'
  }

  public getDescription (): string {
    return 'Foxtools - бесплатные прокси'
  }

  private options: any = {
    hostname: 'www.foxtools.ru',
    port: 80,
    method: 'GET',
    headers: {
      'Host': 'foxtools.ru',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      'Accept-Encoding': 'deflate',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  }

  private row: Cheerio

  public getProxies (page: number): Promise<ProxyData[]> {
    let proxies: ProxyData[] = []

    this.options.path = `/Proxy?page=${page}`

    return this.delay().then(() => {
      return new Promise((resolve, reject) => {
        const req = http.request(this.options, (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`Статус ответа: ${res.statusCode}`))
          }

          let page: string = ''

          res.on('data', (chunk) => {
            page += chunk.toString()
          })

          res.on('end', () => {
            if (page.includes('К сожалению, по вашему запросу прокси-сервера не найдены...')) {
              resolve(proxies)
            }

            const $    = cheerio.load(page)
            const rows = $('#theProxyList > tbody > tr')

            rows.each((i, row) => {
              this.row = $(row)

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
            })

            if (proxies.length <= 0) {
              reject(new Error('На странице не найдено проксей'))
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
    const str: string = this.row.find('td').eq(3).text()
    const re: RegExp = /\s(?<val>[а-яё-]+)\s\([^\)]+\)/i
    const match: RegExpMatchArray = str.match(re)

    if (match === null) {
      throw new Error('Не удалось найти страну')
    }

    return match.groups.val
  }

  private type (): string {
    const str: string = this.row.find('td').eq(5).text().trim()

    if (!str) {
      throw new Error('Не удалось найти тип')
    }

    return str
  }

  private ip (): string {
    const str: string = this.row.find('td').eq(1).text()
    const re: RegExp = /(?<val>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/
    const match: RegExpMatchArray = str.match(re)

    if (match === null) {
      throw new Error('Не удалось найти ip')
    }

    return match.groups.val
  }

  private port (): number {
    const str: string = this.row.find('td').eq(2).text().trim()

    if (str.match(/^\d+$/) === null) {
      throw new Error('Не удалось найти порт')
    }

    return +str
  }

  private source (): string {
    return 'FoxTools'
  }
}
