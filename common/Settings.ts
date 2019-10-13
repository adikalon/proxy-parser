
import sqlite = require('better-sqlite3')
import path = require('path')

export default class Settings {
  public static proxyLimit: string = 'proxy_limit'
  public static maxPage: string    = 'max_page'

  private static db: sqlite.Database = null

  private static connect (): sqlite.Database {
    if (this.db === null) {
      const link: string = path.resolve(__dirname, '../databases/settings.db')
      this.db = new sqlite(link)
    }

    return this.db
  }

  public static getAllSettings (): object[][] {
    let newSettings: object[][] = []

    const sql: string = 'SELECT * FROM `settings`'

    const oldSettings: any[] = this.connect().prepare(sql).all()

    for (const setting of oldSettings) {
      if (newSettings.length <= 0) {
        newSettings.push([setting])
      } else {
        if (newSettings[newSettings.length - 1].length <= 1) {
          newSettings[newSettings.length - 1].push(setting)
        } else {
          newSettings.push([setting])
        }
      }
    }

    return newSettings
  }

  public static updateAllSettings (fields: object): boolean {
    let updated: boolean = true

    for (const [name, value] of Object.entries(fields)) {
      const sql: string = 'UPDATE `settings` SET `value` = ? WHERE `name` = ?'
      const stmt: sqlite.Statement<any[]> = this.connect().prepare(sql)
      const update: sqlite.RunResult = stmt.run(value, name)

      if (update.changes !== 1) {
        updated = false
      }
    }

    return updated
  }

  public static getAll (): {} {
    let settings = {}

    const sql: string = 'SELECT * FROM `settings`'
    const rows: any[] = this.connect().prepare(sql).all()

    for (const row of rows) {
      if (!isNaN(row.value)) {
        row.value = +row.value
      }

      settings[row.name] = row.value
    }

    return settings
  }

  public static getSpecificOption (field: string): string {
    const sql: string = "SELECT `value` FROM `settings` WHERE `name` = ? LIMIT 1"
    const row: any = this.connect().prepare(sql).get(field)

    if (row === undefined) {
      return ''
    } else {
      return row.value
    }
  }

  public static getDelay(): {from: number, to: number} {
    let delay = {
      from: 0,
      to: 0
    }

    const sql: string = "SELECT `name`, `value` FROM `settings` " +
      "WHERE `name` = 'delay_from' OR `name` = 'delay_to' LIMIT 2"

    const rows: any[] = this.connect().prepare(sql).get()

    if (rows !== undefined) {
      for (const row of rows) {
        if (row.name === 'delay_from') {
          delay.from = +row.value
        } else if (row.name === 'delay_to') {
          delay.to = +row.value
        }
      }
    }

    return delay
  }
}
