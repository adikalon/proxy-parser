
import { Database, Statement } from 'sqlite3'
import { ProxyData } from './Types'
import Settings from './Settings'
import path = require('path')

export default class Proxies {
  private static db: Database | null = null

  private static connect (): Database {
    if (this.db === null) {
      const link: string = path.resolve(__dirname, '../databases/proxies.db')
      this.db = new Database(link)
    }

    return this.db
  }

  public static getAllProxy (): Promise<any[]> {
    const sql: string = 'SELECT * FROM `proxies` ORDER BY `updated` DESC'

    return new Promise((resolve, reject) => {
      this.connect().all(sql, (err: Error, rows: any[]) => {
        if (err) {
          reject(err)
        }

        resolve(rows)
      })
    })
  }

  public static truncateProxiesTable (): Promise<void> {
    let sql: string = 'DELETE FROM `proxies`'

    return new Promise((resolve, reject) => {
      this.connect().run(sql, [], (err: Error) => {
        if (err) {
          reject(err)
        }
      })

      sql  = 'UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = "proxies"'

      this.connect().run(sql, [], (err: Error) => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }

  public static getTypes (): Promise<string[]> {
    let types: string[] = []

    const sql: string = 'SELECT DISTINCT `type` FROM `proxies`'

    return new Promise((resolve, reject) => {
      this.connect().each(sql, (err: Error, row: any) => {
        if (err) {
          reject(err)
        }

        types.push(row.type)
      }, (err: Error) => {
        if (err) {
          reject(err)
        }

        resolve(types)
      })
    })
  }

  private static async removeExtraRows (): Promise<void> {
    const allowed: number = +await Settings.getSpecificOption(Settings.proxyLimit)
    const sql: string = "SELECT COUNT(*) AS 'count' FROM `proxies`"

    return new Promise((resolve, reject) => {
      this.connect().get(sql, (err: Error, row: any) => {
        if (err) {
          reject(err)
        }

        if (+row.count > allowed) {
          const limit: number = +row.count - allowed
          const sql: string = 'DELETE FROM `proxies` ORDER BY `id` ASC LIMIT ?'

          const stmt: Statement = this.connect().prepare(sql, [], (err: Error) => {
            if (err) {
              reject(err)
            }
          })

          stmt.run(limit)
          stmt.finalize((err: Error) => {
            if (err) {
              reject(err)
            }

            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  }

  public static push (data: ProxyData): Promise<boolean> {
    const sql: string = "SELECT `id` FROM `proxies` WHERE `ip` = ? LIMIT 1"

    return new Promise((resolve, reject) => {
      const stmt: Statement = this.connect().prepare(sql, [], (err: Error) => {
        if (err) {
          reject(err)
        }
      })

      stmt.get(data.ip, async (err: Error, row: any) => {
        if (err) {
          reject(err)
        }

        const date: number = new Date().getTime()

        if (row !== undefined) {
          const sql: string = 'UPDATE `proxies` ' +
            'SET `country` = ?, `type` = ?, `port` = ?, `source` = ?, `updated` = ? ' +
            'WHERE `id` = ?'

          const stmt: Statement = this.connect().prepare(sql, [], (err: Error) => {
            if (err) {
              reject(err)
            }
          })

          stmt.run([data.country, data.type, data.port, data.source, date, row.id], (err: Error) => {
            if (err) {
              reject(err)
            }
          })

          stmt.finalize()

          resolve(false)
        } else {
          const sql: string = "INSERT INTO `proxies` " +
            "(`country`, `type`, `ip`, `port`, `source`, `inserted`, `updated`) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)"

          const stmt: Statement = this.connect().prepare(sql, [], (err: Error) => {
            if (err) {
              reject(err)
            }
          })

          stmt.run([data.country, data.type, data.ip, data.port, data.source, date, date], (err: Error) => {
            if (err) {
              reject(err)
            }
          })

          stmt.finalize()
          await this.removeExtraRows()

          resolve(true)
        }
      })
    })
  }
}
