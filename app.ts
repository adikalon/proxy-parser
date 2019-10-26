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
    window.webContents.send('config-data', await Settings.getAllSettings())
    window.webContents.send('proxies-data', await Proxies.getAllProxy())
    window.webContents.send('parsers-data', Interaction.list())
    window.webContents.send('proxy-types', await Proxies.getTypes())
  })

  ipcMain.on('config-save', async (event: any, fields: object) => {
    await Settings.updateAllSettings(fields)
    event.reply('config-save-done', true)
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
    await Proxies.truncateProxiesTable()
    event.reply('proxies-truncate-done', true)
  })

  ipcMain.on('parser-stop', async (event: any) => {
    if (typeof Parser !== undefined) {
      Parser.denyOperate()
    }
  })

  ipcMain.on('parser-clear', async (event: any, name: string) => {
    await Marks.clearPage(name)
    event.reply('parser-clear-done', true)
  })

  ipcMain.on('parser-start', async (event: any, file: string) => {
    const CParser: any       = require(`./parser/parsers/${file}`)
    const maxPage: number    = +await Settings.getSpecificOption(Settings.maxPage)
    const parserName: string = file.replace(/\.js$/, '')

    let resetPage: boolean = true

    try {
      Parser = new CParser()
    } catch (e) {
      window.webContents.send('parser-log', Logger.log(e))
      Parser.allowOperate()
      event.reply('parser-finish', LogCompiler.parserFinish())
    }

    const page: number = await Marks.getPage(parserName)

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

        const push: boolean = await Proxies.push(proxy)

        window.webContents.send('proxies-data', await Proxies.getAllProxy())
        window.webContents.send('proxy-types', await Proxies.getTypes())

        let message: LogMessage

        if (push === true) {
          message = LogCompiler.insertProxy(proxy, p)
        } else if (push === null) {
          message = LogCompiler.updateProxy(proxy, p)
        } else {
          message = LogCompiler.updateProxy(proxy, p)
          // message = LogCompiler.errorProxy(proxy, p)
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
