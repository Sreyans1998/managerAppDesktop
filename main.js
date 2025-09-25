const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const squirrelStartup = require("electron-squirrel-startup");
const fs = require("fs");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

if (squirrelStartup) {
  app.quit();
}

let mainWin;
const credentialsFile = path.join(app.getPath("userData"), "credentials.json");
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
  mainWin.webContents.openDevTools();

  // const buildFilePath = url.format({
  //   pathname: path.join(__dirname, "./build/index.html"),
  //   protocol: "file",
  // });
  // console.log({ buildFilePath });
  // mainWin.loadURL(buildFilePath);
  const location = await fetch("https://ipinfo.io/json?token=ce4631c82562d7")
    .then((response) => response.json())

    .then((data) => {
      return data;
    })
    .catch((error) => console.error("Error fetching geolocation data:", error));

  console.log(process.env.MY_API_KEY);
  mainWin.loadURL(
    `http://${
      ["US"].includes(location?.country)
        ? process.env.US_URL
        : process.env.MAIN_URL
    }:${process.env.PORT}/`
  );
};

app.on("ready", createWindow);

const sendCredentials = (title) => {
  try {
    console.log(title);
    if (fs.existsSync(credentialsFile)) {
      const credentials = JSON.parse(fs.readFileSync(credentialsFile, "utf8"));
      mainWin.webContents.send("send-credentials", credentials);
    } else {
      console.log("Credentials file not found, sending empty data.");
      mainWin.webContents.send("send-credentials", { email: "", password: "" });
    }
    // mainWin.webContents.send("send-credentials", {
    //   email: "sreyans@gmail.com",
    //   password: "Sreyans",
    // });
  } catch (error) {
    console.log(error);
  }
};

const setCredentials = (data) => {
  try {
    console.log(credentialsFile);
    fs.writeFileSync(credentialsFile, JSON.stringify(data, null, 2), "utf8");
    console.log("Credentials saved successfully!");
  } catch (error) {
    console.log(error);
  }
};

const deleteCredentials = () => {
  try {
    if (fs.existsSync(credentialsFile)) {
      fs.unlinkSync(credentialsFile);
      console.log("Credentials file deleted successfully.");
    } else {
      console.log("No credentials file found to delete.");
    }
  } catch (error) {
    console.log(error);
  }
};

// Handle error messages from renderer
ipcMain.on("get-credentials", (event, title) => {
  sendCredentials(title);
});
ipcMain.on("delete-credentials", (event, value) => {
  deleteCredentials(value);
});
ipcMain.on("set-credentials", (event, title) => {
  setCredentials(title);
});
