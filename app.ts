import { app, BrowserWindow } from 'electron'
import Settings from './common/Settings'

const config: any[] = Settings.getAllSettings()

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
    window.webContents.send('config', config)
  })
})
