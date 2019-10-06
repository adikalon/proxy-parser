
import sqlite = require('better-sqlite3')
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

  public static truncateProxiesTable (): boolean {
    let sql: string = 'DELETE FROM `proxies`'
    let stmt: sqlite.Statement<any[]> = this.connect().prepare(sql)
    let res: sqlite.RunResult = stmt.run()

    if (!Number.isInteger(res.changes) || res.changes < 0) {
      return false
    }

    sql  = 'UPDATE `sqlite_sequence` SET `seq` = 1 WHERE `name` = "proxies"'
    stmt = this.connect().prepare(sql)
    res  = stmt.run()

    if (res.changes !== 1) {
      return false
    }

    return true
  }

  public static getTypes (): string[] {
    let types: string[] = []

    const sql: string = 'SELECT DISTINCT `type` FROM `proxies`'
    const rows: any[] = this.connect().prepare(sql).all()

    for (const row of rows) {
      types.push(row.type)
    }

    return types
  }
}
