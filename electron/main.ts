import {
  app,
  BrowserWindow,
  nativeImage,
  Menu,
  shell,
  MenuItemConstructorOptions
} from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as url from 'url'

import {
  getWindowBounds,
  setWindowBounds
} from '../src/utils/windowBoundsController'

let mainWindow: Electron.BrowserWindow | null

function createWindow() {
  const icon = nativeImage.createFromPath(`${app.getAppPath()}/build/icon.png`)

  if (app.dock) {
    app.dock.setIcon(icon)
  }

  mainWindow = new BrowserWindow({
    ...getWindowBounds(),
    icon,
    minWidth: 1000,
    minHeight: 600,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('close', () => {
    setWindowBounds(mainWindow?.getBounds())
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function createMenu() {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'OhMyIRC',
      submenu: [
        {
          label: "New connection",
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('newConnection')
          }
        },
        {
          type: 'separator'
        },
        {
          label: "Quit",
          role: 'quit',
          accelerator: 'CmdOrCtrl+Q'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => {
            shell.openExternal('https://github.com/victorlpgazolli')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.on('ready', () => {
  createWindow()
  autoUpdater.checkForUpdatesAndNotify()
  createMenu()
})

app.allowRendererProcessReuse = true
