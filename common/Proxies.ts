
import sqlite = require('better-sqlite3');
import path = require('path')

export default class Proxies {
  private static db: sqlite.Database = null

  private static connect (): sqlite.Database {
    if (this.db === null) {
      const link: string = path.resolve(__dirname, '../databases/proxies.db')
      this.db = new sqlite(link)
    }

    return this.db
  }

  public static getAllProxy (): any[] {
    const sql: string = 'SELECT * FROM `proxies` ORDER BY `updated` DESC'

    return this.connect().prepare(sql).all()
  }

  public static getReadyData(pattern: string): string {
    pattern = pattern.trim()

    if (pattern === '') {
      pattern = '%i:%p'
    }

    let result: string[] = []
    const rows: any[]    = this.getAllProxy()

    for (const row of rows) {
      let format: string = pattern

      format = format.replace(/%c/, row.country)
      format = format.replace(/%i/, row.ip)
      format = format.replace(/%p/, row.port)
      format = format.replace(/%s/, row.source)

      result.push(format)
    }

    return result.join('\r\n') + '\r\n'
  }
}
