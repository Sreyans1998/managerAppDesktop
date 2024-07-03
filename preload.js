const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
  // Provide functions or properties here
  greet(name) {
    console.log(`Hello from Electron, ${name}!`);
  },
});

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) =>
      ipcRenderer.on(channel, (event, ...args) => func(...args)),
  },
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`.${type}-version`, process.versions[type]);
  }
});
