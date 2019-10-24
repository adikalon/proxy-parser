
import { ProxyData } from './Types'
import Settings from './Settings'
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

    sql  = 'UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = "proxies"'
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

  private static removeExtraRows (): boolean {
    let result: boolean = false

    const allowed: number = +Settings.getSpecificOption(Settings.proxyLimit)
    const sql: string = "SELECT COUNT(*) AS 'count' FROM `proxies`"
    const count: number = +this.connect().prepare(sql).get().count

    if (count > allowed) {
      const limit: number = count - allowed
      const sql: string = 'DELETE FROM `proxies` ORDER BY `id` ASC LIMIT ?'
      const stmt: sqlite.Statement<any[]> = this.connect().prepare(sql)
      const exec: sqlite.RunResult = stmt.run(limit)

      if (exec.changes >= 1) {
        result = true
      }
    } else {
      result = true
    }

    return result
  }

  public static push (data: ProxyData): boolean | null {
    let result: boolean | null = false

    const sql: string = "SELECT `id` FROM `proxies` WHERE `ip` = ? LIMIT 1"
    const row: any = this.connect().prepare(sql).get(data.ip)

    const date: number = new Date().getTime()

    if (row !== undefined) {
      const sql: string = 'UPDATE `proxies` ' +
        'SET `country` = ?, `type` = ?, `port` = ?, `source` = ?, `updated` = ? ' +
        'WHERE `id` = ?'

      const stmt: sqlite.Statement<any[]> = this.connect().prepare(sql)
      const exec: sqlite.RunResult = stmt.run(data.country, data.type, data.port, data.source, date, row.id)

      if (exec.changes >= 1) {
        result = null
      }
    } else {
      const sql: string = "INSERT INTO `proxies` " +
        "(`country`, `type`, `ip`, `port`, `source`, `inserted`, `updated`) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?)"

      const stmt: sqlite.Statement<any[]> = this.connect().prepare(sql)
      const exec: sqlite.RunResult = stmt.run(data.country, data.type, data.ip, data.port, data.source, date, date)

      if (exec.changes >= 1) {
        result = true
      }
    }

    this.removeExtraRows()

    return result
  }
}
