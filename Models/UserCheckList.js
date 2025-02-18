const mongoose = require("mongoose");

const userCheckListSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})

const UserCheckList = mongoose.model("UserCheckList",userCheckListSchema)
module.exports = UserCheckList;