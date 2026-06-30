import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// stutable table
const User = sequelize.define('User', {
    name : {
        type: DataTypes.STRING,
        allowNull:false,
    },
    email : {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate: {isEmail:true}
    },
    password: {
     type:DataTypes.STRING,   
     allowNull:false
    }
},{
    tableName:'stutable',
    timestamps:true
});

// stuprofile table
const Data = sequelize.define('Data', {
    course : {
        type: DataTypes.STRING,
        allowNull:false,
    },
    phone : {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    age: {
     type:DataTypes.INTEGER,   
     allowNull:false
    },
    location: {
     type:DataTypes.STRING,   
     allowNull:false
    }
},{
    tableName:'stuprofile',
    timestamps:true
})

// User.hasOne(Data);  // output default "Datum" because is singular term of "Data".
// Data.belongsTo(User);

User.hasOne(Data, { as: "studentData", foreignKey: "UserId" });  // studentData is a alies of data 
Data.belongsTo(User, { foreignKey: "UserId" });

export {User, Data};
