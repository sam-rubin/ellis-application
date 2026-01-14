const {DataTypes} = require('sequelize')
const {sequelize} = require('../db')
const Member = sequelize.define( 'Member',{
    familyId: {
        type: DataTypes.STRING,
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
    relationship:{
        type: DataTypes.STRING,
        allowNull:true
    },
    area:{
        type: DataTypes.STRING,
        allowNull:true
    },
    birthDay:{
        type: DataTypes.DATEONLY,
        allowNull:true
    },
    weddingDay:{
        type: DataTypes.DATEONLY,
        allowNull:true
    },
    baptism:{
        type: DataTypes.STRING,
        allowNull:true
    },
    confirmation:{
        type: DataTypes.STRING,
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
    },
    subscription_amount:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    three_percent_subscription:{
        type:DataTypes.STRING,
        allowNull:this.true
    }
    
},
{
    tableName:'members'
});

module.exports = Member;