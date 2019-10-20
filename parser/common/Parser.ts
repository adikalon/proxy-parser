import Settings from './../../common/Settings'
import { ProxyData } from './../../common/Types'
import path = require('path')
import fs = require('fs')

export default abstract class Parser {
  private operate: boolean = true
  private pause: {from: number, to: number} = Settings.getDelay()

  public allowOperate (): void {
    this.operate = true
  }

  public denyOperate (): void {
    this.operate = false
  }

  public isOperate (): boolean {
    return this.operate
  }

  public delay (): Promise<NodeJS.Timeout> {
    let rand: number = this.pause.from + Math.random() * (this.pause.to + 1 - this.pause.from)
    rand = Math.floor(rand)

    return new Promise(r => setTimeout(() => r(), rand))
  }

  abstract getName (): string
  abstract getDescription (): string

  abstract getProxies (page: number): Promise<ProxyData[]>
}
