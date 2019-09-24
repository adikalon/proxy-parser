
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
}
