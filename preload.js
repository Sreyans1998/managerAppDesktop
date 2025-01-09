const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
  // Provide functions or properties here
  greet(name) {
    console.log(`Hello from Electron, ${name}!`);
  },
});

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    const validChannels = ["LOG-EVENT"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // Expose functions to receive messages from the main process
  on: (channel, callback) => {
    const validChannels = []; // Add channels you expect to receive data from
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  // Utility to invoke Electron APIs
  invoke: (channel, data) => {
    const validChannels = []; // Add channels for APIs that return promises
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
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
