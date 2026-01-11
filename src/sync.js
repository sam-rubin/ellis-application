const sequelize = require('./db');
const Member = require('./models/Members');

async function syncDatabase(){
    try{
        await sequelize.sync();
        console.log('Database Synced Successfully');
    }catch(error){
        console.error('Error Syncing database: ',error);
    }

}

syncDatabase();