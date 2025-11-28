const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const squirrelStartup = require("electron-squirrel-startup");
// const dotenv = require("dotenv");

if (squirrelStartup) {
  app.quit();
}

let mainWin;

// Path to store credentials
const credentialsFile = path.join(app.getPath("userData"), "credentials.json");

console.log(app.getPath("userData"));

// let envPath;

// // When packaged
// if (app.isPackaged) {
//   envPath = path.join(process.resourcesPath, ".env");
// } else {
//   // When running in development
//   envPath = path.join(__dirname, ".env");
// }

// if (fs.existsSync(envPath)) {
//   dotenv.config({ path: envPath });
//   console.log("Loaded env from:", envPath);
// } else {
//   console.log("⚠️ .env not found at:", envPath);
// }

const MAIN_URL = "64.19.136.162";
const US_URL = "64.19.136.162";
const PORT = "5012";

const createWindow = async () => {

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
  // mainWin.webContents.openDevTools();

  // const buildFilePath = url.format({
  //   pathname: path.join(__dirname, "./build/index.html"),
  //   protocol: "file",
  // });
  // console.log({ buildFilePath });
  // mainWin.loadURL(buildFilePath);
  const location = await fetch("https://ipinfo.io/json?token=ce4631c82562d7")
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error fetching geolocation:", err);
      return {};
    });

  console.log("MAIN_URL: ", MAIN_URL);
  console.log("US_URL: ", US_URL);

  const serverUrl = `http://${
      ["US"].includes(location?.country)
        ? MAIN_URL
        : US_URL
    }:${PORT}/`
  mainWin.loadURL(serverUrl);
};

// Credentials handling
const sendCredentials = () => {
  try {
    if (fs.existsSync(credentialsFile)) {
      const credentials = JSON.parse(fs.readFileSync(credentialsFile, "utf8"));
      mainWin.webContents.send("send-credentials", credentials);
    } else {
      mainWin.webContents.send("send-credentials", { email: "", password: "" });
    }
  } catch (error) {
    console.log("Error sending credentials:", error);
  }
};

const setCredentials = (data) => {
  try {
    fs.writeFileSync(credentialsFile, JSON.stringify(data, null, 2), "utf8");
    console.log("Credentials saved successfully!");
  } catch (error) {
    console.log("Error saving credentials:", error);
  }
};

const deleteCredentials = () => {
  try {
    if (fs.existsSync(credentialsFile)) {
      fs.unlinkSync(credentialsFile);
      console.log("Credentials file deleted successfully.");
    }
  } catch (error) {
    console.log("Error deleting credentials:", error);
  }
};

// IPC handlers
ipcMain.on("get-credentials", sendCredentials);
ipcMain.on("set-credentials", (event, data) => setCredentials(data));
ipcMain.on("delete-credentials", deleteCredentials);

app.on("ready", createWindow);
