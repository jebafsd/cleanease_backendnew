const mongoose = require("mongoose");

const cleanServicesSchema = new mongoose.Schema({
    serviceName:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:"https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled.png"
      },    
    description:{
        type:String,
        required:true
    },
    minAmount:{
        type:Number,
        required:true
    },
    maxAmount:{
        type:Number,
        required:true
    }
})

const CleanServices = mongoose.model("CleanServices",cleanServicesSchema)
module.exports = CleanServices;