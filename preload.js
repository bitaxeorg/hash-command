const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getIpAddress: () => ipcRenderer.invoke('get-ip-address')
});