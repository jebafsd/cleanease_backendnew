const mongoose = require("mongoose");

const cleanSubCategoriesSchema = new mongoose.Schema({
  cleanServiceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CleanServices",
    required: true,
  },
  img:{
    type:String,
    default:"https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled.png"
  },
  subServiceName: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  serviceAmount: {
    type: Number,
    required: true,
  },
  review: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username:{
        type:String,
        required:true,
      },
      text: {
        type: String,
      },
      rating: {
        type: Number,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const CleanSubCategories = mongoose.model(
  "CleanSubCategories",
  cleanSubCategoriesSchema
);
module.exports = CleanSubCategories;
