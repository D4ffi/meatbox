// electron/preload.ts - Versión corregida sin errores
import { ipcRenderer, contextBridge } from 'electron'

// Tipos específicos para los parámetros
type IpcRendererEvent = Electron.IpcRendererEvent

// API segura para el renderer
const electronAPI = {
  // IPC básico con tipos explícitos
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): void => {
    ipcRenderer.on(channel, listener)
  },
  off: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): void => {
    ipcRenderer.off(channel, listener)
  },
  send: (channel: string, ...args: unknown[]): void => {
    ipcRenderer.send(channel, ...args)
  },
  invoke: (channel: string, ...args: unknown[]): Promise<unknown> => {
    return ipcRenderer.invoke(channel, ...args)
  },

  // APIs específicas de la aplicación
  app: {
    logout: (): Promise<unknown> => ipcRenderer.invoke('app-logout'),
    minimize: (): Promise<unknown> => ipcRenderer.invoke('app-minimize'),
    close: (): Promise<unknown> => ipcRenderer.invoke('app-close'),
  },

  // Info del sistema
  platform: process.platform,
  versions: process.versions,
}

// Exponer API de forma segura
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Mantener compatibilidad con el código existente - con tipos explícitos
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): Electron.IpcRenderer {
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): Electron.IpcRenderer {
    return ipcRenderer.off(channel, listener)
  },
  send(channel: string, ...omit: unknown[]): void {
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(channel: string, ...omit: unknown[]): Promise<unknown> {
    return ipcRenderer.invoke(channel, ...omit)
  },
})

// Tipos para TypeScript
declare global {
  interface Window {
    electronAPI: typeof electronAPI
    ipcRenderer: {
      on(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): void
      off(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): void
      send(channel: string, ...args: unknown[]): void
      invoke(channel: string, ...args: unknown[]): Promise<unknown>
    }
  }
}