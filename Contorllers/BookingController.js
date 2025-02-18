const UserBookings = require("../Models/UserBookings");
const CleanSubCategories = require("../Models/CleanSubCategories");

exports.createBooking = async (req, res) => {
  const { cleanSubCategoriesID } = req.params;
  const { startDate, serviceType, address, uniqueBookingID, username, email } = req.body;
  try {
    const subCategories = await CleanSubCategories.findOne({
      _id: cleanSubCategoriesID,
    });
    if (!subCategories) {
      return res.status(400).send("No sub-categories matches!");
    }
    const endDate = startDate + subCategories.duration * 3600000;
    const subServiceName = subCategories.subServiceName;
    let temp = 0;

    const bookedData = await UserBookings.find({
      subServiceName,
      user: req.user,
    });
    if (bookedData.length == 0) {
      const newUserBookings = new UserBookings({
        user: req.user,
        serviceID: cleanSubCategoriesID,
        username,
        email,
        address,
        startDate,
        endDate,
        serviceType,
        subServiceName,
        uniqueBookingID,
        amount: subCategories.serviceAmount,
      });
      await newUserBookings.save();
      res.status(200).send("Booking Success!");
    } else {
      bookedData.map((ele) => {
        if (startDate > ele.endDate || endDate < ele.startDate) {
          temp++;
        }
      });

      if (temp != bookedData.length) {
        return res
          .status(400)
          .send("Cannot able to book same service at same time");
      }
      const newUserBookings = new UserBookings({
        user: req.user,
        serviceID: cleanSubCategoriesID,
        username,
        email,
        address,
        startDate,
        endDate,
        serviceType,
        subServiceName,
        uniqueBookingID,
        amount: subCategories.serviceAmount,
      });
      await newUserBookings.save();
      res.status(200).send("Booking Success!");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error while create booking");
  }
};

exports.editBookings = async (req, res) => {
  const { userBookingID } = req.params;
  const { date, serviceType, status, address } = req.body;

  try {
    const bookedData = await UserBookings.findOne({
      _id: userBookingID,
      user: req.user,
    });
    if (!bookedData) {
      return res.status(400).send("No booking data found!");
    }
    let checkDate = bookedData.startDate - 3600000;

    if (checkDate < Date.now() && bookedData.status == "Not Completed") {
      return res
        .status(400)
        .send("Cannot able to edit the bookings that will occure in 1hr.");
    }

    if (bookedData.status == "Ongoing") {
      return res.status(400).send("Cannot able to edit Ongoing Process");
    }

    const subCategories = await CleanSubCategories.findOne({
      _id: bookedData.serviceID,
    });

    if (!subCategories) {
      return res.status(400).send("No subcategories found!");
    }

    //NEED TO DO CODE FOR NOT SAME TIME
    const bookedServiceName = subCategories.subServiceName;

    const check_arr = (
      await UserBookings.find({
        user: req.user,
        subServiceName: bookedServiceName,
      })
    ).filter((ele) => ele._id != userBookingID);

    if (check_arr.length == 0) {
      bookedData.startDate = date || bookedData.startDate;
      bookedData.endDate =
        date + subCategories.duration * 3600000 || bookedData.endDate;
      bookedData.serviceType = serviceType || bookedData.serviceType;
      bookedData.status = status || bookedData.status;
      bookedData.address = address || bookedData.address;

      await bookedData.save();
      res.status(200).send("Successfully Edited booking data!");
    } else {
      let temp = 0;
      const startDate = date;
      const endDate = startDate + subCategories.duration * 3600000;

      check_arr.map((ele) => {
        if (startDate > ele.endDate || endDate < ele.startDate) {
          temp++;
        }
      });
      if (temp != check_arr.length) {
        return res
          .status(400)
          .send("Cannot able to book same service at same time");
      }

      bookedData.startDate = date || bookedData.startDate;
      bookedData.endDate =
        bookedData.startDate + subCategories.duration * 3600000 ||
        bookedData.endDate;
      bookedData.serviceType = serviceType || bookedData.serviceType;
      bookedData.status = status || bookedData.status;
      bookedData.address = address || bookedData.address;

      await bookedData.save();
      res.status(200).send("Successfully Edited booking data!");
    }

  } catch (err) {
    res.status(400).send("Error while editing UserBooking");
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const Allbookings = await UserBookings.find({ user: req.user });
    res.status(200).json({ Allbookings });
  } catch (err) {
    res.status(400).send("Error while getting userBookings");
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const _id = req.params.bookingID;
    const data = UserBookings.findOne({ _id });
    const checkStartDate = data.startDate - 3600000;

    if (
      (data.status == "Ongoing") ||
      (checkStartDate <= Date.now() && data.startDate >= Date.now())
    ) {
      return res
        .status(400)
        .send("Cannot delete the schedule that happens whithin 1 hr");
    }
    await UserBookings.deleteOne({ _id });
    res.status(200).send("Successfully Deleted user booking");
  } catch (err) {
    res.status(400).send("Error while deleting Userbooking");
  }
};

exports.bookingPaymentUpdate = async (req, res) => {
  const { uniqueBookingID } = req.body;
  try {
    const data = await UserBookings.findOne({ uniqueBookingID });

    if (!data) {
      res.status(400).send("No data found to update Payment status");
    }

    data.isAmountPaid = true;
    data.amountPaidDate = Date.now();

    await data.save();
    res.status(200).send("Booking payment updated Succesfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error while updating payment status");
  }
};

exports.createReview = async (req, res) => {
  const { username, text, rating } = req.body;
  const { _id } = req.params;

  try {
    const data = await CleanSubCategories.findOne({_id});
    const new_review = {
      user: req.user,
      username,
      text,
      rating,
    };

    data.review.push(new_review);
    await data.save();

    res.status(200).send("Review successfully added");
  } catch (err) {
    res.status(400).send("Error while Creating review");
  }
};


exports.getReviews = async(req,res) => {
  const { _id } = req.params;

  try {
    const data = await CleanSubCategories.findOne({_id});
    res.status(200).json({review:data.review});
  } catch (err) {
    res.status(400).send("Error while Creating review");
  }
}

exports.deleteReview = async (req,res) => {
  const { _id , deleteID} = req.params;

  try {
    const data = await CleanSubCategories.findOne({_id});
    const reviewToUpdate = data.review;
    const newReview = reviewToUpdate.filter((ele)=> ele._id != deleteID)

    data.review = newReview;
    await data.save();
    res.status(200).send("Deleted Review Successfully");

  } catch (err) {
    res.status(400).send("Error while Delete review");
  }
}

exports.updateReview = async (req,res) => {
  const {_id, reviewID } = req.params;
  const { text, rating, username } = req.body;

  try {
    const data = await CleanSubCategories.findOne({_id});
    const reviewToUpdateEdit = data.review;

    reviewToUpdateEdit.map((ele)=>{
      if(ele._id == reviewID){
        ele.text = text || ele.text;
        ele.rating = rating || ele.rating;
        ele.username = username || ele.username;
      }
    })

    data.review = reviewToUpdateEdit;
    await data.save();
    res.status(200).send("Review Updated Successfully");

  } catch (err) {
    console.log(err)
    res.status(400).send("Error while Delete review");
  }
}