const {DataTypes} = require('sequelize')
const {sequelize} = require('../db')
const Member = sequelize.define( 'Member',{
    familyId: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey:true
    },
    serialId: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey:true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthDay:{
        type: DataTypes.DATEONLY,
        allowNull:true
    },
    weddingDay:{
        type: DataTypes.DATEONLY,
        allowNull:true
    },
    dateOfBaptism:{
        type: DataTypes.DATEONLY,
        allowNull:true
    },
    dateOfConfirmation:{
        type: DataTypes.DATEONLY,
        allowNull:true
    },
    occupation:{
        type: DataTypes.STRING,
        allowNull: true
    },
    grossSalary:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bloodGroup:{
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address:{
        type: DataTypes.STRING,
        allowNull: false
    },
    pincode:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    memberShip:{
        type: DataTypes.STRING,
        allowNull:false
    },
    mailAddress:{
        type: DataTypes.STRING,
        allowNull:true
    }
    
},
{
    tableName:'members'
});

module.exports = Member;