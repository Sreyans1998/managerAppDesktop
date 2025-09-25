const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setLoginCredentials: (title) => ipcRenderer.send("set-credentials", title),
  getLoginCredentials: (value) => ipcRenderer.send("get-credentials", value),
  deleteLoginCredentials: (value) => ipcRenderer.send("delete-credentials", value),
  sendLoginCredentials: (callback) =>
    ipcRenderer.on("send-credentials", (_event, value) => callback(value)),
});
