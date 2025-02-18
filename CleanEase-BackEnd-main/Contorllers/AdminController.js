const UserBookings = require("../Models/UserBookings");
const User = require('../Models/User');

exports.getUserBookingsAdmin = async (req, res) => {
    try {
      const All_Users_Bookings = await UserBookings.find();
      res.status(200).json({All_Users_Bookings});
    } catch (err) {
      res.status(400).send('Not able to get User Bookings');
    }
  };

exports.updateUserBookingsAdmin = async (req,res) => {
    const { _id } = req.params;
    const { userId, isConfirmed, status } = req.body;
    //
    const io = req.app.get('io');
    //
    try{
        const singleUserBooking = await UserBookings.findOne({_id});
        singleUserBooking.isConfirmed = isConfirmed || singleUserBooking.isConfirmed;
        singleUserBooking.status = status || singleUserBooking.status;

        await singleUserBooking.save();
        //
        io.to(userId).emit('StatusUpdatedNotification', { bookingId: _id, status });
        //
        res.status(200).send("User Booking Successfully Updated for a User");

    } catch (err){
        res.status(400).send("Error while updating User data");
    }
  };

//NEW FOR ADMIN DASHBOARD

exports.getTotalUsersAdmin = async (req,res) => {
  try{
    const All_Users = await User.find();
    const TotalUsersDetail = All_Users.filter((ele)=> ele.role == "User");
    res.status(200).json({TotalUsersDetail});
  } catch(err){
    res.status(400).send("Error while getting Users");
  }
}

exports.getUsersAndThereTotalBookings = async (req,res) => {
  try{
    const UsersWithBookingData = await UserBookings.aggregate([
      {$group:{
        _id:"$username",
        total_bookings:{$sum:1}
      }}
    ])
    res.status(200).json({UsersWithBookingData});
  } catch(err){
    res.status(400).send("Error while getting Users with there total bookings data");
  }
}