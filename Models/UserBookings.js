const mongoose = require("mongoose");

const userBookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    subServiceName:{
        type:String,
        required:true
    },
    serviceType:{
        type: String,
        enum: ["one-time", "recurring"],
        default: "one-time",
    },
    serviceID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CleanSubCategories",
        required:true
    },
    startDate:{
        type:Number,
        required:true
    },
    endDate:{
        type:Number,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    status:{
        type:String,
        enum: ["Completed", "Ongoing", "Not Completed"],
        default: "Not Completed",
    },
    isConfirmed:{
        type:Boolean,
        default:false,
    },
    amount:{
        type:Number,
        required:true
    },
    uniqueBookingID:{
        type:String,
        required:true
    },
    isAmountPaid:{
        type:Boolean,
        default:false
    },
    amountPaidDate:{
        type:Date,
        default:null
    }
},{
    timestamps:true
})

const UserBookings = mongoose.model("UserBookings",userBookingSchema)
module.exports = UserBookings;