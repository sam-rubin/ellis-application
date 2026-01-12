const {DataTypes} = require('sequelize')
const {sequelize} = require('../db')
const Subscription = sequelize.define( 'Subscription',{
    
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    familyId: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        allowNull:false
    },
    serialId: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        allowNull:false
    },
    billDate:{
        type: DataTypes.DATEONLY,
        allowNull:false
    },
    amount:{
        type:DataTypes.DOUBLE,
        allowNull:false
    }
    
},
{
    tableName:'subscription'
});

module.exports = Subscription;