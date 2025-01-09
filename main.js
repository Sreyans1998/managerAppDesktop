const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const squirrelStartup = require("electron-squirrel-startup");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");

if (squirrelStartup) {
  app.quit();
}

let launchTimestamp = new Date().toISOString().replace(/:/g, "-");
const logFileName = `${launchTimestamp}.txt`;
let mainWin;
const createWindow = () => {
  mainWin = new BrowserWindow({
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
  mainWin.webContents.openDevTools();

  // const buildFilePath = url.format({
  //   pathname: path.join(__dirname, "./build/index.html"),
  //   protocol: "file",
  // });
  // console.log({ buildFilePath });
  // mainWin.loadURL(buildFilePath);
  mainWin.loadURL("http://rdpusa.zolontech.com:3000/");
  autoUpdater.checkForUpdatesAndNotify();
};

app.on("ready", () => {
  createWindow();

  autoUpdater.on("checking-for-update", () => {
    logErrorToFile({
      messageType: "INFO",
      message: "Checking for updates...",
      payload: "",
    });
  });

  autoUpdater.on("update-available", (info) => {
    logErrorToFile({
      messageType: "INFO",
      message: "Update available.",
      payload: info,
    });

    dialog.showMessageBox(mainWin, {
      type: "info",
      title: "Update Available",
      message:
        "A new version is available. It will be downloaded in the background.",
    });
  });

  autoUpdater.on("update-not-available", (info) => {
    logErrorToFile({
      messageType: "INFO",
      message: "No updates available.",
      payload: info,
    });
  });

  autoUpdater.on("error", (err) => {
    logErrorToFile({
      messageType: "ERROR",
      message: "Error while updating.",
      payload: err.stack || err,
    });

    dialog.showErrorBox(
      "Update Error",
      err == null ? "Unknown error" : err.toString()
    );
  });

  autoUpdater.on("download-progress", (progressObj) => {
    logErrorToFile({
      messageType: "INFO",
      message: "Download in progress...",
      payload: progressObj,
    });
  });

  autoUpdater.on("update-downloaded", () => {
    logErrorToFile({
      messageType: "INFO",
      message: "Update downloaded.",
      payload: "",
    });

    dialog
      .showMessageBox(mainWin, {
        type: "info",
        title: "Update Ready",
        message:
          "A new version has been downloaded. Would you like to install it now?",
        buttons: ["Yes", "Later"],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall(); // Quit and install the update
        }
      });
  });
});

const logErrorToFile = (eventContent) => {
  const { message, payload, messageType } = eventContent;
  // console.log("desktop path", app.getPath('desktop'));
  const logDir = path.join(app.getPath("desktop"), "Manager_App_Admin");
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
