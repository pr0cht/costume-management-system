const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addCostume: (data) => ipcRenderer.invoke('add-costume', data),
  getCostumes: () => ipcRenderer.invoke('get-costumes'),
  editCostume: (data) => ipcRenderer.invoke('edit-costume', data)
});