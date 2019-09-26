import { app, BrowserWindow, ipcMain } from 'electron'
import Settings from './common/Settings'
import Proxies from './common/Proxies'

const config: object[][] = Settings.getAllSettings()
const proxies: any[] = Proxies.getAllProxy()

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
  });

  if (process.env.NODE_ENV === 'DEV') {
    window.webContents.openDevTools()
  }

  window.setMenuBarVisibility(false)

  window.loadURL(url)

  window.on('closed', () => window = null)

  window.webContents.on('did-finish-load', () => {
    window.webContents.send('config-data', config)
    window.webContents.send('proxies-data', proxies)
  })

  ipcMain.on('config-save', (event: any, fields: any) => {
    event.returnValue = Settings.updateAllSettings(fields)
  })

  ipcMain.on('proxies-pull', (event: any, pattern: any) => {
    event.returnValue = Proxies.getReadyData(pattern)
  })

  ipcMain.on('proxies-all', (event: any) => {
    event.returnValue = Proxies.getAllProxy()
  })
})
