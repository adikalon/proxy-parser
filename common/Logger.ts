import { LogMessage } from './Types'
import path = require('path')
import fs = require('fs')

export default class Logger {
  public static log (err: Error, die: boolean = false): LogMessage | void {
    const date: Date    = new Date()
    const day: string   = ('0' + date.getDate()).slice(-2)
    const month: string = ('0' + (date.getMonth() + 1)).slice(-2)
    const year: number  = date.getFullYear()

    const folder: string = path.resolve(__dirname, '../logs')
    const file: string   = `${year}_${month}_${day}.log`

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }

    fs.appendFileSync(`${folder}/${file}`, this.getLogMessage(err))

    if (die) {
      process.exit()
    } else {
      return this.getConsoleMessage(err)
    }
  }

  private static getLogMessage (err: Error): string {
    const date: Date    = new Date()
    const hour: string  = ('0' + date.getHours()).slice(-2)
    const min: string   = ('0' + date.getMinutes()).slice(-2)
    const sec: string   = ('0' + date.getSeconds()).slice(-2)
    const msec: string  = ('0' + date.getMilliseconds()).slice(-3)
    const fDate: string = `${hour}:${min}:${sec}.${msec}`

    const sA: string = '================================================================================'
    const sB: string = '--------------------------------------------------------------------------------'

    return `${sA}\r\n${fDate}\r\n${sB}\r\n${err.stack}\r\n${sA}\r\n\r\n`
  }

  private static getConsoleMessage (err: Error): LogMessage {
    return {
      date: new Date().getTime(),
      message: err.message
    }
  }
}
