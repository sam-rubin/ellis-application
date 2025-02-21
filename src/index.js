const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const pool = require("./db");
const { error } = require("node:console");

const keyDataType = {
  familyId: "number",
  serialId: "number",
  name: "string",
  gender: "string",
  relation: "string",
  mailAddress: "string",
  birthDay: "date",
  weddingDay: "date",
  dateOfConfirmation: "date",
  dateOfBaptism: "date",
  occupation: "string",
  grossSalary: "number",
  bloodGroup: "string",
  phoneNumber: "number",
  address: "string",
  pincode: "number",
  memberShip: "string",
};
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("save-member", (channel, member) => {
  saveMembers(member);
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function saveMembers(member) {
  let keys = Object.keys(member);
  let values = [];
  let colList = "";
  for (let key of keys) {
    colList += key + ",";
    if (member[key]) {
      if ("number" === keyDataType[key]) {
        values.push(parseInt(member[key]));
      } else if ("date" === keyDataType[key]) {
        let dateField = member[key];
        values.push(new Date(dateField).toISOString().slice(0, 10));
      } else if ("string" == keyDataType[key]) {
        values.push(member[key]);
      }
    } else {
      values.push(null);
    }
  }

  console.log("keys are and values ", keys, values);
  let columns = colList.slice(0, colList.length - 1);

  let sql = `INSERT INTO members(${columns}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  pool.execute(sql, values).catch((error) => console.log(error));
}

ipcMain.on("search-users", async (event, { name, familyId }) => {
  console.log("inside searhc users", name, familyId);
  try {
    if (name || familyId) {
      let whereClause;

      if (name) {
        whereClause = ` name LIKE '%${name}%' `;
      }

      if (familyId) {
        if (name && familyId) {
          whereClause += ` AND familyId=${familyId}`;
        } else {
          whereClause = `familyId=${familyId}`;
        }
      }

      const [rows] = await pool.execute(
        "SELECT * FROM members WHERE " + whereClause
      );
      console.log("The response rows are ", rows);
      event.reply("search-results", rows);
    }
  } catch (err) {
    console.error("Database error:", err);
  }
});
