const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addCostume: (data) => ipcRenderer.invoke('add-costume', data),
  getCostumes: (filters) => ipcRenderer.invoke('get-costumes', filters),
  editCostume: (data) => ipcRenderer.invoke('edit-costume', data),
  deleteCostume: (id) => ipcRenderer.invoke('delete-costume', id),
  setCostumeReturned: (data) => ipcRenderer.invoke('set-costume-returned', data),

  addClient: (data) => ipcRenderer.invoke('add-client', data),
  getClients: (filters) => ipcRenderer.invoke('getClientsSummary', filters),
  editClient: (data) => ipcRenderer.invoke('edit-client', data),
  deleteClient: (id) => ipcRenderer.invoke('delete-client', id),

  getRentsHistory: (filters) => ipcRenderer.invoke('get-rents-history', filters),

  addEvent: (data) => ipcRenderer.invoke('add-event', data),
  getEvents: () => ipcRenderer.invoke('get-events'),
  getEventsActive: () => ipcRenderer.invoke('get-events-active'),
  getEventsPast: () => ipcRenderer.invoke('get-events-past'),
  editEvent: (data) => ipcRenderer.invoke('edit-event', data),
  deleteEvent: (id) => ipcRenderer.invoke('delete-event', id),

  addPayment: (data) => ipcRenderer.invoke('add-payment', data),
  getPayments: () => ipcRenderer.invoke('get-payments'),
  deletePayment: (id) => ipcRenderer.invoke('delete-payment', id),
  editPayment: (data) => ipcRenderer.invoke('edit-payment', data),

  addCharge: (data) => ipcRenderer.invoke('add-charge', data),

  getAvailableCostumes: () => ipcRenderer.invoke('get-available-costumes'),
  processRental: (data) => ipcRenderer.invoke('process-rental', data),
  getTransactionsDue: () => ipcRenderer.invoke('get-recent-transactions'),
  getTransactionsByClient: (clientId) => ipcRenderer.invoke('get-transactions-by-client', clientId),
  getGeneralStats: () => ipcRenderer.invoke('get-general-stats'),
  getDashboardLists: () => ipcRenderer.invoke('get-dashboard-lists'),
  getRecentClients: () => ipcRenderer.invoke('get-recent-clients'),
});