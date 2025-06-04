"use strict";
const electron = require("electron");
const electronAPI = {
  // IPC básico con tipos explícitos
  on: (channel, listener) => {
    electron.ipcRenderer.on(channel, listener);
  },
  off: (channel, listener) => {
    electron.ipcRenderer.off(channel, listener);
  },
  send: (channel, ...args) => {
    electron.ipcRenderer.send(channel, ...args);
  },
  invoke: (channel, ...args) => {
    return electron.ipcRenderer.invoke(channel, ...args);
  },
  // APIs específicas de la aplicación
  app: {
    logout: () => electron.ipcRenderer.invoke("app-logout"),
    minimize: () => electron.ipcRenderer.invoke("app-minimize"),
    close: () => electron.ipcRenderer.invoke("app-close")
  },
  // Info del sistema
  platform: process.platform,
  versions: process.versions
};
electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(channel, listener) {
    return electron.ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(channel, listener) {
    return electron.ipcRenderer.off(channel, listener);
  },
  send(channel, ...omit) {
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(channel, ...omit) {
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
