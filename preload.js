const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addCostume: (data) => ipcRenderer.invoke('add-costume', data),
});
