const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addCostume: (data) => ipcRenderer.invoke('add-costume', data),
  getCostumes: (filters) => ipcRenderer.invoke('get-costumes', filters),
  editCostume: (data) => ipcRenderer.invoke('edit-costume', data),
  deleteCostume: (id) => ipcRenderer.invoke('delete-costume', id),

  addClient: (data) => ipcRenderer.invoke('add-client', data),
  getClients: () => ipcRenderer.invoke('get-clients'),
  editClient: (data) => ipcRenderer.invoke('edit-client', data),
  deleteClient: (id) => ipcRenderer.invoke('delete-client', id),

  addEvent: (data) => ipcRenderer.invoke('add-event', data),
  getEvents: () => ipcRenderer.invoke('get-events'),
  getEventsActive: () => ipcRenderer.invoke('get-events-active'),
  getEventsPast: () => ipcRenderer.invoke('get-events-past'),
  editEvent: (data) => ipcRenderer.invoke('edit-event', data),
  deleteEvent: (id) => ipcRenderer.invoke('delete-event', id),

  getAvailableCostumes: () => ipcRenderer.invoke('get-available-costumes'),
  processRental: (data) => ipcRenderer.invoke('process-rental', data)
});