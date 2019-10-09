import sqlite = require('better-sqlite3')
import path = require('path')

export default class Marks {
  private static db: sqlite.Database = null

  private static connect (): sqlite.Database {
    if (this.db === null) {
      const link: string = path.resolve(__dirname, '../databases/marks.db')
      this.db = new sqlite(link)
    }

    return this.db
  }

  public static clearPage (parser: string): boolean {
    return this.setPage(parser, 1)
  }

  public static getPage (parser: string): number {
    const sql = "SELECT `value` FROM `marks` WHERE `key` = 'page' AND `parser` = ? LIMIT 1"
    const row: any = this.connect().prepare(sql).get(parser)

    if (row === undefined) {
      return 1
    } else {
      if (!isNaN(row.value)) {
        return +row.value
      } else {
        return 1
      }
    }
  }

  public static setPage (parser: string, page: number): boolean {
    let result: boolean = false

    const sql = "SELECT `id` FROM `marks` WHERE `key` = 'page' AND `parser` = ? LIMIT 1"
    const row: any = this.connect().prepare(sql).get(parser)

    if (row !== undefined) {
      const sql: string = 'UPDATE `marks` SET `value` = ? WHERE `id` = ?'
      const stmt: sqlite.Statement<any[]> = this.connect().prepare(sql)
      const exec: sqlite.RunResult = stmt.run(page, row.id)

      if (exec.changes >= 1) {
        result = true
      }
    } else {
      const sql: string = "INSERT INTO `marks` (`key`, `parser`, `value`) VALUES ('page', ?, ?)"
      const stmt: sqlite.Statement<any[]> = this.connect().prepare(sql)
      const exec: sqlite.RunResult = stmt.run(parser, page)

      if (exec.changes >= 1) {
        result = true
      }
    }

    return result
  }
}
