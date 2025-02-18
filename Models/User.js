const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum: ["User", "Admin"],
        default:"User"
    },
    password:{
        type:String,
        required:true
    },
    passResetToken:{
        type:String,
        required:false,
        default:null
    },
    passResetTokenExp:{
        type:Date,
        required:false,
        default:null
    },
    registerToken:{
        type:String,
        default:null
    },
    registerTokenExp:{
        type:Date,
        default:null
    },
    active:{
        type:Boolean,
        default:false
    }
});

const User = mongoose.model("User",userSchema)
module.exports = User;