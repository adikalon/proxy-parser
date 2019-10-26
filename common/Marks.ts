import { Database, Statement } from 'sqlite3'
import path = require('path')

export default class Marks {
  private static db: Database | null = null

  private static connect (): Database {
    if (this.db === null) {
      const link: string = path.resolve(__dirname, '../databases/marks.db')
      this.db = new Database(link)
    }

    return this.db
  }

  public static clearPage (parser: string): Promise<void> {
    return this.setPage(parser, 1)
  }

  public static getPage (parser: string): Promise<number> {
    const sql = "SELECT `value` FROM `marks` WHERE `key` = 'page' AND `parser` = ? LIMIT 1"
    const stmt: Statement = this.connect().prepare(sql)

    return new Promise((resolve, reject) => {
      stmt.get(parser, (err: Error, row: any) => {
        if (err) {
          reject(err)
        }

        if (row === undefined) {
          resolve(1)
        } else {
          resolve(+row.value)
        }
      })
    })
  }

  public static setPage (parser: string, page: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT `id` FROM `marks` WHERE `key` = 'page' AND `parser` = ? LIMIT 1"
      const stmt: Statement = this.connect().prepare(sql)

      stmt.get(parser, (err: Error, row: any) => {
        if (err) {
          reject(err)
        }

        if (row !== undefined) {
          const id: number  = +row.id
          const sql: string = 'UPDATE `marks` SET `value` = ? WHERE `id` = ?'

          const stmt: Statement = this.connect().prepare(sql, [], (err: Error) => {
            if (err !== null) {
              reject(err)
            }
          })

          stmt.run([page, id], (err: Error) => {
            if (err !== null) {
              reject(err)
            }
          })

          stmt.finalize()
        } else {
          const sql: string = "INSERT INTO `marks` (`key`, `parser`, `value`) VALUES ('page', ?, ?)"

          const stmt: Statement = this.connect().prepare(sql, [], (err: Error) => {
            if (err !== null) {
              reject(err)
            }
          })

          stmt.run([parser, page], (err: Error) => {
            if (err !== null) {
              reject(err)
            }
          })

          stmt.finalize()
        }

        resolve()
      })
    })
  }
}
