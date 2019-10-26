
import { Database, Statement } from 'sqlite3'
import path = require('path')

export default class Settings {
  public static proxyLimit: string = 'proxy_limit'
  public static maxPage: string    = 'max_page'

  private static db: Database | null = null

  private static connect (): Database {
    if (this.db === null) {
      const link: string = path.resolve(__dirname, '../databases/settings.db')
      this.db = new Database(link)
    }

    return this.db
  }

  public static getAllSettings (): Promise<object[][]> {
    let settings: object[][] = []

    const sql: string = 'SELECT * FROM `settings`'

    return new Promise((resolve, reject) => {
      this.connect().each(sql, (err: Error, row: any) => {
        if (err) {
          reject(err)
        }

        if (settings.length <= 0) {
          settings.push([row])
        } else {
          if (settings[settings.length - 1].length <= 1) {
            settings[settings.length - 1].push(row)
          } else {
            settings.push([row])
          }
        }
      }, (err: Error) => {
        if (err) {
          reject(err)
        }

        resolve(settings)
      })
    })
  }

  public static updateAllSettings (fields: object): Promise<void> {
    const sql: string = 'UPDATE `settings` SET `value` = ? WHERE `name` = ?'

    return new Promise((resolve, reject) => {
      const stmt: Statement = this.connect().prepare(sql, [], (err: Error) => {
        if (err) {
          reject(err)
        }
      })

      for (const [name, value] of Object.entries(fields)) {
        stmt.run([value, name], (err: Error) => {
          if (err) {
            reject(err)
          }
        })
      }

      stmt.finalize()
      resolve()
    })
  }

  public static getAll (): Promise<object> {
    let settings: object = {}
    const sql: string = 'SELECT * FROM `settings`'

    return new Promise((resolve, reject) => {
      this.connect().all(sql, (err: Error, rows: any[]) => {
        if (err) {
          reject(err)
        }

        rows.forEach(row => {
          if (!isNaN(row.value)) {
            row.value = +row.value
          }

          settings[row.name] = row.value
        })

        resolve(settings)
      })
    })
  }

  public static getSpecificOption (field: string): Promise<string> {
    const sql: string = 'SELECT `value` FROM `settings` WHERE `name` = ? LIMIT 1'
    const stmt: Statement = this.connect().prepare(sql)

    return new Promise((resolve, reject) => {
      stmt.get(field, (err: Error, row: any) => {
        if (err) {
          reject(err)
        }

        if (row === undefined) {
          resolve('')
        } else {
          resolve(row.value)
        }
      })
    })
  }

  public static getDelay(): Promise<{from: number, to: number}> {
    const delay = {
      from: 0,
      to: 0
    }

    const sql: string = "SELECT `name`, `value` FROM `settings` " +
      "WHERE `name` = 'delay_from' OR `name` = 'delay_to' LIMIT 2"

    return new Promise((resolve, reject) => {
      this.connect().each(sql, (err: Error, row: any) => {
        if (err) {
          reject(err)
        }

        if (row.name === 'delay_from') {
          delay.from = +row.value
        } else if (row.name === 'delay_to') {
          delay.to = +row.value
        }
      }, (err: Error) => {
        if (err) {
          reject(err)
        }

        resolve(delay)
      })
    })
  }
}
