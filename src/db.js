const mysql = require("mysql2/promise");
const {Sequelize} = require('sequelize');

const dbConnection = mysql.createPool({
  host: "localhost", // Change this to your MySQL host
  user: "root", // Change this to your MySQL username
  password: "Almighty@123", // Change this to your MySQL password
  database: "church", // Change this to your database name
  waitForConnections: true,
  connectionLimit: 5, // Max connections
  queueLimit: 0,
});


const sequelize = new Sequelize('church','root','Almighty@123',{
host: "localhost", // Change this to your MySQL host
dialect:"mysql",
timezone: '+05:30', // IST (India Standard Time)
logging: console.log,
pool:{
  max:2,
  min:0,
  acquire:30000,
  idle:100
}

});

async function testConnection() {
try {
    await sequelize.authenticate();
    console.log("Connection has been successfully established");
  }catch(error){
    console.log("Unable to connect to the database:",error);
  }
  
}

testConnection();

module.exports = {dbConnection,sequelize};
