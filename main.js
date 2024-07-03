const { app, BrowserWindow, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
const squirrelStartup = require("electron-squirrel-startup");
const fs = require("fs");

if (squirrelStartup) {
  app.quit();
}

let launchTimestamp = new Date().toISOString().replace(/:/g, "-");
const logFileName = `${launchTimestamp}.txt`;

const createWindow = () => {
  let mainWin = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecute: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    resizable: true,
    show: true,
    maximizable: true,
    maximize: true,
  });

  mainWin.maximize();
  mainWin.removeMenu();
  // mainWin.webContents.openDevTools();

  const buildFilePath = url.format({
    pathname: path.join(__dirname, "./build/index.html"),
    protocol: "file",
  });
  console.log({ buildFilePath });
  mainWin.loadURL(buildFilePath);
  // mainWin.loadURL("http://localhost:3000/");
};

app.on("ready", createWindow);

const logErrorToFile = (eventContent) => {
  const { message, payload, messageType } = eventContent;
  // console.log("desktop path", app.getPath('desktop'));
  const logDir = path.join(app.getPath('desktop'), "Manager_App_Admin");
  const logPath = path.join(logDir, `${logFileName}`);

  // Create directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
 
  const timestamp = new Date().toISOString();
  const logMessage = `${messageType}: [${timestamp}] : ${message} => ${payload}\n`;
  fs.appendFile(logPath, logMessage, (err) => {
    if (err) throw err;
  });
};

// Handle error messages from renderer
ipcMain.on("LOG-EVENT", (event, eventContent) => {
  logErrorToFile(eventContent);
});
