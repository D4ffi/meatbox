// electron/main.ts - Versión completamente corregida
import { app, BrowserWindow, Menu, ipcMain, shell } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ?
    path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow(): void {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    show: false,
  })

  // Mostrar ventana cuando esté lista
  win.once('ready-to-show', () => {
    win?.show()
  })

  // Manejar navegación externa - Versión actualizada para Electron moderno
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      void shell.openExternal(url) // Usar void para manejar promesas ignoradas
    }
    return { action: 'deny' }
  })

  // Prevenir navegación a URLs externas
  win.webContents.on('will-navigate', (event, navigationUrl: string) => {
    if (!navigationUrl.startsWith('file://') && !navigationUrl.startsWith(VITE_DEV_SERVER_URL || '')) {
      event.preventDefault()
    }
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date()).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    void win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    void win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// IPC handlers para comunicación con el renderer
ipcMain.handle('app-logout', async () => {
  if (win) {
    // Usar el método correcto para limpiar datos de sesión
    await win.webContents.session.clearStorageData()
  }
})

ipcMain.handle('app-minimize', () => {
  win?.minimize()
})

ipcMain.handle('app-close', () => {
  win?.close()
})

Menu.setApplicationMenu(null)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Seguridad adicional - Versión actualizada
app.on('web-contents-created', (_event, contents) => {
  // El evento 'new-window' está deprecado, usar setWindowOpenHandler en su lugar
  contents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url)
    return { action: 'deny' }
  })

  // Prevenir navegación a URLs no autorizadas
  contents.on('will-navigate', (event, navigationUrl: string) => {
    const parsedUrl = new URL(navigationUrl)

    // Permitir solo navegación local y a Supabase (si es necesario)
    if (parsedUrl.origin !== VITE_DEV_SERVER_URL && !parsedUrl.protocol.startsWith('file:')) {
      event.preventDefault()
    }
  })
})

void app.whenReady().then(createWindow)