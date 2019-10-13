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

    abstract getName (): string
    abstract getDescription (): string

  public delay(): number {
    const delay: {from: number, to: number} = Settings.getDelay()
    const rand: number = delay.from + Math.random() * (delay.to + 1 - delay.from)

    return Math.floor(rand)
  }

  abstract getProxies (page: number): Promise<ProxyData[]>
}
