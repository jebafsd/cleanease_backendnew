const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification",notificationSchema);
module.exports = Notification;