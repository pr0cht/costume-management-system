const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addCostume: (data) => ipcRenderer.invoke('add-costume', data),
  getCostumes: () => ipcRenderer.invoke('get-costumes'),
  editCostume: (data) => ipcRenderer.invoke('edit-costume', data),

  addClient: (data) => ipcRenderer.invoke('add-client', data),
  getClients: () => ipcRenderer.invoke('get-clients'),
  editClient: (data) => ipcRenderer.invoke('edit-client', data),

  
});