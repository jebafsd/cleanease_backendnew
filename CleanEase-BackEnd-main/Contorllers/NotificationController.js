const Notification = require("../Models/Notification");
const UserBookings = require("../Models/UserBookings");
const sendEmail = require("../Utils/EmailServises");

exports.createNotification = async (req, res) => {
  const { user, heading, msg, email } = req.body;
    const newNotification = new Notification({
      user,
      heading,
      msg,
    });

    await newNotification.save();

    const message = `<div style="diaplay:flex;flex-direction:column;justify-content:center;text-align: center;background-color: lightgreen;border: 5px outset black;color:black">
    <div style="padding:10px;margin:5px">
    <h3 style="margin:0px">${heading}</h3>
    <p>${msg}</p>
    </div>
    </div>`;
  
    sendEmail({
      email: email,
      subject: "Updated Booking Status",
      message,
      res,
    });  
};

exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.find({ user: req.user });
    res.status(200).json({ notification });
  } catch (err) {
    res.status(400).send("Error while getting notification");
  }
};

exports.deleteNotification = async (req, res) => {
  const { _id } = req.params;
  try {
    await Notification.deleteOne({ _id });
    res.status(200).send("Notification deleted Successfull");
  } catch (err) {
    res.status(400).send("Error while deleting notification");
  }
};


//not in use right now
exports.autoEditUserBookings = async (req,res) => {
  const { serviceID } = req.params;
  const { status } = req.body;

  try{
    const data = await UserBookings.findOne({_id:serviceID})
    data.status = status;
    
    await data.save();
    res.status(200).send("Auto Editing Successfull");

  } catch(err){
    res.status(400).send("Error while autoEditing UserBookings");
  }
}