const { app, BrowserWindow, ipcMain,dialog } = require("electron");
const path = require("node:path");
const {dbConnection} = require("./db");
const { error } = require("node:console");
const Member = require('./models/Members');
const subscription = require('./models/Subscription');
const {sequelize} = require('./db')
const {Op} = require('sequelize');
const fs = require('fs');
const xlsx = require('xlsx');
let mainWindow;
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
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname,"assets/ellis.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      
    },
  });

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
  channel.reply('registration-response',response === 'failure' ? "error" : "success");
 }catch(error){
  console.log("Inside the error blog ",error);
 }

});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function saveMembers(member){
  try{
 const  {familyId,serialId,name,gender,relation,mailAddress,birthDay,weddingDay,subscriptionAmount,
  dateOfConfirmation,dateOfBaptism,occupation,grossSalary,bloodGroup,phoneNumber,address,pincode,memberShip,area,subscriptionPercentage} = member;

  const persistedMember = await Member.upsert({
    familyId,
    serialId,
    name,
    gender,
    relation,
    mailAddress,
    birthDay,
    weddingDay : weddingDay || null,
    confirmation : dateOfConfirmation || null,
    baptism : dateOfBaptism || null,
    occupation : occupation || null,
    grossSalary : grossSalary || null,
    bloodGroup: bloodGroup || null,
    phoneNumber:phoneNumber || null,
    address,
    pincode: pincode || null,
    memberShip,
    area,
    subscription_amount:subscriptionAmount,
    three_percent_subscription:subscriptionPercentage
})
console.log('Created User ',JSON.stringify(persistedMember))
return "success";
}catch(error ){
  console.log("error occured ",error);
  return " failure";
  }

}
ipcMain.on("search-users", async (event, { name, familyId, birthDayEndDate,birthDayStartDate,weddingEndDate,weddingStartDate,searchBy,ageGreater,subscriptionPercentage }) => {
  console.log("inside search users", name, familyId,birthDayEndDate,birthDayStartDate,weddingEndDate,weddingStartDate,searchBy,ageGreater,subscriptionPercentage);
  try {
    let rows;
    if(searchBy == "name"){
        rows = await Member.findAll({where: { name: { [Op.like]: `%${name}%` } }})
    } else if (searchBy =="familyId"){
      rows = await Member.findAll({where: { familyId: { [Op.eq]:  familyId } }})
    } else if (searchBy=="dateOfBirth"){
       let startDate = birthDayStartDate.slice(5);
       let endDate = birthDayEndDate.slice(5);
       rows = await Member.findAll({
          where: sequelize.where(
            sequelize.fn('DATE_FORMAT', sequelize.col('birthDay'), '%m-%d'),
            {
              [Op.between]: [startDate, endDate]
          }
      )});
    } else if (searchBy=="weddingDay"){
       let startDate = weddingStartDate.slice(5);
       let endDate = weddingEndDate.slice(5);
       rows = await Member.findAll({
          where: sequelize.where(
            sequelize.fn('DATE_FORMAT', sequelize.col('weddingDay'), '%m-%d'),
            {
              [Op.between]: [startDate, endDate]
          }
      )});
    
    } else if (searchBy == "subscriptionPercentage"){
       rows = await Member.findAll({
          where: 
            {
              three_percent_subscription: {[Op.gte] : subscriptionPercentage}
            }
      });
    } else if(searchBy =="ageGreater"){
      const seventyYearsAgo = new Date();
     seventyYearsAgo.setFullYear(seventyYearsAgo.getFullYear() - ageGreater);
      rows = await Member.findAll({
          where: 
            {
              birthDay: {[Op.lte] : seventyYearsAgo}
            }
      });
    }
  console.log("The response rows are ", rows);
   event.reply("search-results", rows);
  }catch (err) {
    console.error("Database error:", err);
  }
 }); 



ipcMain.on('navigate-subscription',async (event,state) => {
   mainWindow.loadFile(path.join(__dirname, "bill.html"));
   mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('state-data',state);
   });
});


ipcMain.on('print',async (event,state) =>{
  console.log(JSON.stringify(state));
 try{
  const subsc = await subscription.create({
    familyId: state.familyId,
    serialId:state.serialId,
    amount: state.amount,
    subMonth:state.month,
    subYear:state.year,
    paidDate:state.paidDate
  })
}catch(error){
  console.log('unable to persist the subscription information ',error);
}
   const printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the content
  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(state.htmlContent)}`);

  // Wait for content to load, then print
  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print({
      silent: false,
      printBackground: true,
      preload:true,
      pagesPerSheet:1
    }, (success, errorType) => {
      if (!success) {
        console.log('Print failed:', errorType);
      }
      // Close the window after printing
      printWindow.close();
    });
  });
});

ipcMain.on("load-report",async(event,state) => {
  console.log("state is ",JSON.stringify(state))
  const {familyId, serialId, startDate, endDate,searchBy} = state;
if(searchBy == "family"){
    rows =await subscription.findAll({
          where: { 
                 familyId :  familyId,
                 serialId:serialId
                } 
        })
}  else if(searchBy =="subscriptionDate"){
        rows =await subscription.findAll({
          where: { paidDate : {[Op.between] : [startDate,endDate]} }
        })

     
  }
event.reply("subscription-report",rows);   

})

// Excel Uploads 
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Excel Files', extensions: ['xlsx', 'xls', 'csv'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Handle Excel file upload
ipcMain.handle('upload-excel', async (event, filePath) => {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const fileName = path.basename(filePath);
    
    const results = [];
    
    // Process each sheet
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      
      
      // Insert into database
      const query = `
        INSERT INTO excel_data (file_name, sheet_name, data)
        VALUES (?, ?, ?)
      `;
      //Family No	Head.No	Family Members	Gender	Relation	D.O.B	Wedding Day	Baptism	Confirmation	Occupation	Sub Amt	Sub %	Blood Group	Phone No	
      // Address	Area	Pincode	Membership	Mail ID/Remarks					

        
        jsonData.forEach(async (value , index) => {
          
          console.log('value is ',value, 'index is ',index)
         const {familyId,serialId,name,gender,relationship,birthDay,weddingDay,baptism,confirmation,occupation,subscription_amount,bloodGroup,phoneNumber,address,area,pincode,memberShip,mailAddress,three_percent_subscription} = value;   

    try{   
    const persisted = await  Member.upsert(
          {
            familyId,
            serialId,
            name,
            gender,
            relationship,
            birthDay: birthDay ? sequelize.literal(`STR_TO_DATE('${birthDay}', '%d.%m.%Y')`):null,
            weddingDay: weddingDay ? sequelize.literal(`STR_TO_DATE('${weddingDay}', '%d.%m.%Y')`):null,
            baptism,
            confirmation,
            occupation,
            subscription_amount,
            bloodGroup,
            phoneNumber,
            address,
            area,
            pincode,
            memberShip,
            mailAddress,
            three_percent_subscription,
          }
        )
      }catch(error){
        console.log("error while persisting ",error);
      }
      
        });

      const [result] = await dbConnection.execute(query, [
        fileName,
        sheetName,
        JSON.stringify("No of Rows Inserted "+":"+jsonData.length)
      ]);
      
      results.push({
        sheetName,
        rowCount: jsonData.length,
        insertId: result.insertId
      });
    }
    
    return {
      success: true,
      fileName,
      sheets: results
    };
  } catch (err) {
    console.error('Upload error:', err);
    return {
      success: false,
      error: err.message
    };
  }
});

// Handle fetching uploaded files
ipcMain.handle('get-uploads', async () => {
  try {
    const [rows] = await dbConnection.execute(`
      SELECT id, file_name, sheet_name, uploaded_at,
             data as row_count
      FROM excel_data
      ORDER BY uploaded_at DESC
    `);
    return rows;
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
});

// Handle fetching specific upload data
ipcMain.handle('get-upload-data', async (event, id) => {
  try {
    const [rows] = await dbConnection.execute(
      'SELECT * FROM excel_data WHERE id = ?',
      [id]
    );
    
    if (rows.length > 0) {
      return {
        ...rows[0],
        data: JSON.parse(rows[0].data)
      };
    }
    return null;
  } catch (err) {
    console.error('Fetch data error:', err);
    return null;
  }
});

ipcMain.on("search-users-report", async (event, { name, familyId,searchBy }) => {
  console.log("inside search users report", name, familyId,searchBy);
  try {
    let rows;
    if(searchBy == "name"){
        rows = await Member.findAll({where: { name: { [Op.like]: `%${name}%` } }})
    } else if (searchBy =="familyId"){
      rows = await Member.findAll({where: { familyId: { [Op.eq]:  familyId } }})
    } 
  console.log("The response rows are ", rows);
   event.reply("search-report-results", rows);
  }catch (err) {
    console.error("Database error:", err);
  }
 }); 