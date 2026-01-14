const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, callback) =>
    ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
   selectFile: () => ipcRenderer.invoke('select-file'),
  uploadExcel: (filePath) => ipcRenderer.invoke('upload-excel', filePath),
  getUploads: () => ipcRenderer.invoke('get-uploads'),
  getUploadData: (id) => ipcRenderer.invoke('get-upload-data', id)
});
