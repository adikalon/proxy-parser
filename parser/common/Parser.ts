import Settings from './../../common/Settings'
import { ProxyData } from './../../common/Types'

export default abstract class Parser {
  private operate: boolean = true
  private pause: {from: number, to: number} | null = null

  public allowOperate (): void {
    this.operate = true
  }

  public denyOperate (): void {
    this.operate = false
  }

  public isOperate (): boolean {
    return this.operate
  }

  public async delay (): Promise<NodeJS.Timeout> {
    if (this.pause === null) {
      this.pause = await Settings.getDelay()
    }

    let rand: number = this.pause.from + Math.random() * (this.pause.to + 1 - this.pause.from)
    rand = Math.floor(rand)

    return new Promise(r => setTimeout(() => r(), rand))
  }

  abstract getName (): string
  abstract getDescription (): string

  abstract async getProxies (page: number): Promise<ProxyData[] | null>
}
