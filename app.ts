import { app, BrowserWindow, ipcMain } from 'electron'
import Settings from './common/Settings'
import Proxies from './common/Proxies'
import Marks from './common/Marks'
import Interaction from './parser/common/Interaction'
import LogCompiler from './common/LogCompiler'
import { ProxyData, LogMessage } from './common/Types'
import AParser from './parser/common/Parser'
import Logger from './common/Logger'

let Parser: undefined | AParser = undefined
let url: string

if (process.env.NODE_ENV === 'DEV') {
  url = 'http://localhost:8081/'
} else {
  url = `file://${process.cwd()}/dist/index.html`
}

app.on('ready', () => {
  let window: BrowserWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: __dirname + '/icon.png',
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === 'DEV') {
    window.webContents.openDevTools()
  }

  window.setMenuBarVisibility(false)

  window.loadURL(url)

  window.on('closed', () => window = null)

  window.webContents.on('did-finish-load', async () => {
    try {
      window.webContents.send('config-data', await Settings.getAllSettings())
      window.webContents.send('proxies-data', await Proxies.getAllProxy())
      window.webContents.send('parsers-data', Interaction.list())
      window.webContents.send('proxy-types', await Proxies.getTypes())
    } catch (e) {
      Logger.log(e, true)
    }
  })

  ipcMain.on('config-save', async (event: any, fields: object) => {
    try {
      await Settings.updateAllSettings(fields)
      event.reply('config-save-done', true)
    } catch (e) {
      window.webContents.send('parser-log', Logger.log(e))
      event.reply('config-save-done', false)
    }
  })

  ipcMain.on('proxies-and-types-get', async (event: any) => {
    Promise.all([
      Proxies.getAllProxy(),
      Proxies.getTypes()
    ]).then((values: [any[], string[]]) => {
      event.reply('proxies-and-types-data', {
        proxies: values[0],
        types: values[1]
      })
    })
  })

  ipcMain.on('proxies-truncate', async (event: any) => {
    try {
      await Proxies.truncateProxiesTable()
      event.reply('proxies-truncate-done', true)
    } catch (e) {
      window.webContents.send('parser-log', Logger.log(e))
      event.reply('proxies-truncate-done', false)
    }
  })

  ipcMain.on('parser-stop', async (event: any) => {
    if (typeof Parser !== undefined) {
      Parser.denyOperate()
    }
  })

  ipcMain.on('parser-clear', async (event: any, name: string) => {
    try {
      await Marks.clearPage(name)
      event.reply('parser-clear-done', true)
    } catch (e) {
      window.webContents.send('parser-log', Logger.log(e))
      event.reply('parser-clear-done', false)
    }
  })

  ipcMain.on('parser-start', async (event: any, file: string) => {
    const CParser: any = require(`./parser/parsers/${file}`)

    let maxPage: number

    try {
      maxPage = +await Settings.getSpecificOption(Settings.maxPage)
    } catch (e) {
      window.webContents.send('parser-log', Logger.log(e))
      Parser.allowOperate()
      event.reply('parser-finish', LogCompiler.parserFinish())
    }

    const parserName: string = file.replace(/\.js$/, '')

    let resetPage: boolean = true

    let page: number

    try {
      Parser = new CParser()
      page   = await Marks.getPage(parserName)
    } catch (e) {
      window.webContents.send('parser-log', Logger.log(e))
      Parser.allowOperate()
      event.reply('parser-finish', LogCompiler.parserFinish())
    }


    for (let p = page; p <= maxPage; p++) {
      if (!Parser.isOperate()) {
        resetPage = false
        break
      }

      if (!Marks.setPage(parserName, p)) {
        resetPage = false
        window.webContents.send('parser-log', LogCompiler.setPageError(p))
        break
      }

      let proxies: ProxyData[] | null

      try {
        proxies = await Parser.getProxies(p)
      } catch (e) {
        window.webContents.send('parser-log', Logger.log(e))
        resetPage = false
        break
      }

      if (proxies === null) {
        window.webContents.send('parser-log', LogCompiler.notProxiesOnPage(p))
        continue
      }

      if (proxies.length <= 0) {
        break
      }

      for (const proxy of proxies) {
        if (!Parser.isOperate()) {
          resetPage = false
          break
        }

        let push: boolean

        try {
          push = await Proxies.push(proxy)

          window.webContents.send('proxies-data', await Proxies.getAllProxy())
          window.webContents.send('proxy-types', await Proxies.getTypes())
        } catch (e) {
          window.webContents.send('parser-log', Logger.log(e))
          resetPage = false
          break
        }

        let message: LogMessage

        if (push) {
          message = LogCompiler.insertProxy(proxy, p)
        } else {
          message = LogCompiler.updateProxy(proxy, p)
        }

        window.webContents.send('parser-log', message)
      }
    }

    if (resetPage) {
      if (!Marks.clearPage(parserName)) {
        window.webContents.send('parser-log', LogCompiler.clearPageError())
      }
    }

    Parser.allowOperate()
    event.reply('parser-finish', LogCompiler.parserFinish())
  })
})
