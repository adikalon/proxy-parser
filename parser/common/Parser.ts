import Settings from './../../common/Settings'
import { ProxyData } from './../../common/Types'
import path = require('path')
import fs = require('fs')

export default abstract class Parser {
  private operate: boolean = true

  public allowOperate (): void {
    this.operate = true
  }

  public denyOperate (): void {
    this.operate = false
  }

  public isOperate (): boolean {
    return this.operate
  }

  private error (message: string): void {
    const date: Date    = new Date()
    const day: string   = ('0' + date.getDate()).slice(-2)
    const month: string = ('0' + (date.getMonth() + 1)).slice(-2)
    const year: number  = date.getFullYear()
    const hour: string  = ('0' + date.getHours()).slice(-2)
    const min: string   = ('0' + date.getMinutes()).slice(-2)
    const sec: string   = ('0' + date.getSeconds()).slice(-2)
    const msec: string  = ('0' + date.getMilliseconds()).slice(-3)
    const fDate: string = `${hour}:${min}:${sec}.${msec}`

    const stack: string = new Error().stack
    const line: string  = stack.split('\n')[2].replace(/^.+\s\(/, '')
      .replace(/\)$/, '')

    const separatorA: string = '================================================================================'
    const separatorB: string = '--------------------------------------------------------------------------------'

    message = `${separatorA}\r\n${fDate}\r\n${line}\r\n${separatorB}\r\n${message}\r\n${separatorA}\r\n\r\n`

    const folder: string = path.resolve(__dirname, '../../logs')
    const file: string   = `${year}_${month}_${day}.log`

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }

    fs.writeFileSync(`${folder}/${file}`, message)

    process.exit()
  }

  private delay(): number {
    const delay: {from: number, to: number} = Settings.getDelay()
    const rand: number = delay.from + Math.random() * (delay.to + 1 - delay.from)

    return Math.floor(rand)
  }

  abstract getName (): string
  abstract getDescription (): string

  abstract getProxies (page: number): Promise<ProxyData[]>
}
