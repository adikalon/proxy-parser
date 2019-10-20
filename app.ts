import { app, BrowserWindow, ipcMain } from 'electron'
import Settings from './common/Settings'
import Proxies from './common/Proxies'
import Marks from './common/Marks'
import Interaction from './parser/common/Interaction'
import LogCompiler from './common/LogCompiler'
import { ProxyData, LogMessage } from './common/Types'
import AParser from './parser/common/Parser'
import Logger from './common/Logger'

const config: object[][] = Settings.getAllSettings()
const proxies: any[] = Proxies.getAllProxy()

let Parser: undefined|AParser = undefined
let url: string

if (process.env.NODE_ENV === 'DEV') {
  url = 'http://localhost:8081/'
} else {
  url = `file://${process.cwd()}/dist/frontend/index.html`
}

app.on('ready', () => {
  let window: BrowserWindow = new BrowserWindow({
    width: 1024,
    height: 768,
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

  window.webContents.on('did-finish-load', () => {
    window.webContents.send('config-data', config)
    window.webContents.send('proxies-data', proxies)
    window.webContents.send('parsers-data', Interaction.list())
    window.webContents.send('proxy-types', Proxies.getTypes())
  })

  ipcMain.on('config-save', (event: any, fields: any) => {
    event.returnValue = Settings.updateAllSettings(fields)
  })

  ipcMain.on('proxies-all', (event: any) => {
    event.returnValue = Proxies.getAllProxy()
  })

  ipcMain.on('proxies-truncate', (event: any) => {
    event.returnValue = Proxies.truncateProxiesTable()
  })

  ipcMain.on('parser-stop', (event: any) => {
    if (typeof Parser !== undefined) {
      Parser.denyOperate()
    }
  })

  ipcMain.on('parser-clear', (event: any, name: string) => {
    event.returnValue = Marks.clearPage(name)
  })

  ipcMain.on('parser-start', (event: any, file: string) => {
    ;(async () => {
      const CParser: any       = require(`./parser/parsers/${file}`)
      const maxPage: number    = +Settings.getSpecificOption(Settings.maxPage)
      const parserName: string = file.replace(/\.js$/, '')

      let resetPage: boolean = true

      try {
        Parser = new CParser()
      } catch (e) {
        window.webContents.send('parser-log', Logger.log(e))
        Parser.allowOperate()
        event.reply('parser-finish', LogCompiler.parserFinish())
      }

      const page: number = Marks.getPage(parserName)

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

        let proxies: ProxyData[]

        try {
          proxies = await Parser.getProxies(p)
        } catch (e) {
          window.webContents.send('parser-log', Logger.log(e))
          resetPage = false
          break
        }

        if (proxies.length <= 0) {
          break
        }

        for (const proxy of proxies) {
          if (!Parser.isOperate()) {
            resetPage = false
            break
          }

          const push: boolean | null = Proxies.push(proxy)
          let message: LogMessage

          if (push === true) {
            message = LogCompiler.insertProxy(proxy, p)
          } else if (push === null) {
            message = LogCompiler.updateProxy(proxy, p)
          } else {
            message = LogCompiler.errorProxy(proxy, p)
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
    })()
  })
})
