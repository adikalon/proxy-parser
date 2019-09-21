
import sqlite = require('better-sqlite3');
import path = require('path')

export default class Settings {
  private static db: sqlite.Database = null

  private static connect (): sqlite.Database {
    if (this.db === null) {
      const link: string = path.resolve(__dirname, '../databases/settings.db')
      this.db = new sqlite(link)
    }

    return this.db
  }

  public static getAllSettings (): any[] {
    const sql: string = 'SELECT * FROM `settings`'

    return this.connect().prepare(sql).all()
  }
}





/*
import path = require('path')
const sqlite: any = require('sqlite3').verbose()
const database: string = path.resolve(__dirname, '../../../databases/settings.db')

export default class Settings {
  private static instance: any = null

  private static connect (): any {
    if (this.instance === null) {
      this.instance = new sqlite.Database(database)
    }

    return this.instance
  }

  public static getAllSettings (callback: Function): void {
    const sql: string = 'SELECT * FROM `settings`'

    this.connect().all(sql, function (err: any, rows: Array<Object>) {
      if (err) {
        throw err
      }

      callback(rows)
    });
  }
}
*/
