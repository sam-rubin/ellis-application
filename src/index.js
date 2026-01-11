const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const {pool} = require("./db");
const { error } = require("node:console");
const Member = require('./models/Members');
const {sequelize} = require('./db')
let mainWindowAlias;
async function main(){

  try {
    await sequelize.sync({force: false});
    console.log('db synced');
  }catch(error){
    console.log('error syncing db ',error );
  }
}
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname,"assets/ellis.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      
    },
  });

  mainWindowAlias = mainWindow;
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
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

ipcMain.on("save-member", async (channel, member) => {
 try{
  let response = await saveMembers(member);
  channel.reply('registration-response',response === 'error occurred' ? "error" : "success");
 }catch(error){
  console.log("Inside the error blog ",error);
 }

});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function saveMembers(member){
 const  {familyId,serialId,name,gender,relation,mailAddress,birthDay,weddingDay,dateOfConfirmation,dateOfBaptism,occupation,grossSalary,bloodGroup,phoneNumber,address,pincode,memberShip} = member;

  const persistedMember = await Member.create({
    familyId,
    serialId,
    name,
    gender,
    relation,
    mailAddress,
    birthDay,
    weddingDay : weddingDay || null,
    dateOfConfirmation : dateOfConfirmation || null,
    dateOfBaptism : dateOfBaptism || null,
    occupation : occupation || null,
    grossSalary : grossSalary || null,
    bloodGroup: bloodGroup || null,
    phoneNumber:phoneNumber || null,
    address,
    pincode: pincode || null,
    memberShip
})
console.log('Created User ',persistedMember.toJSON())
}
ipcMain.on("search-users", async (event, { name, familyId, birthDayEndDate,birthDayStartDate,weddingEndDate,weddingStartDate }) => {
  console.log("inside search users", name, familyId,birthDayEndDate,birthDayStartDate,weddingEndDate,weddingStartDate);
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
    } else if(birthDayStartDate && birthDayEndDate) {
        console.log(birthDayStartDate.slice(5),' end ' ,birthDayEndDate.slice(5) )
        let startDate = birthDayStartDate.slice(5);
        let endDate = birthDayEndDate.slice(5);
        whereClause = `DATE_FORMAT(birthDay,'%m-%d') BETWEEN '${startDate}' AND '${endDate}'`;
    const [rows] = await pool.execute(
        "SELECT * FROM members WHERE " + whereClause
      );
      console.log("The response rows are ", rows);
      event.reply("search-results", rows);
      }else if(weddingStartDate && weddingEndDate) {
        console.log(birthDayStartDate.slice(5),' end ' ,birthDayEndDate.slice(5) )
        let startDate = weddingStartDate.slice(5);
        let endDate = weddingEndDate.slice(5);
        whereClause = `DATE_FORMAT(birthDay,'%m-%d') BETWEEN '${startDate}' AND '${endDate}'`;
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


ipcMain.on('navigate-subscription',async (event,state) => {
   mainWindowAlias.loadFile(path.join(__dirname, "bill.html"));
   mainWindowAlias.webContents.once('did-finish-load', () => {
    mainWindowAlias.webContents.send('state-data',state);
   });
});