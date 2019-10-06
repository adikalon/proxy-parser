import { app, BrowserWindow, ipcMain } from 'electron'
import Settings from './common/Settings'
import Proxies from './common/Proxies'
import Marks from './common/Marks'
import Interaction from './parser/common/Interaction'
import AParser from './parser/common/Parser'

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
    width: 800,
    height: 600,
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

  ipcMain.on('parser-start', (event: any, file: string) => {
    const CParser = require(`./parser/parsers/${file}`)

    Parser = new CParser()

    const interval: NodeJS.Timeout = setInterval(() => {
      if (!Parser.isOperate()) {
        clearInterval(interval)
        Parser.allowOperate()
        event.reply('parser-finish')
      }

      window.webContents.send('parser-log', { date: new Date().getTime(), message: Parser.getDescription() })
    }, 2000)
  })

  ipcMain.on('parser-clear', (event: any, name: string) => {
    event.returnValue = Marks.clearPage(name)
  })
})
