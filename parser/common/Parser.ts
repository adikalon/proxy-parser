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
}
