const express = require("express");
const { createBooking, editBookings, getUserBookings, deleteBooking, createReview, bookingPaymentUpdate, getReviews, deleteReview, updateReview } = require('../Contorllers/BookingController');
const auth = require("../MiddleWare/auth");

const router = express.Router();

router.post('/create/:cleanSubCategoriesID', auth, createBooking);

router.get('/get', auth, getUserBookings);

router.put('/update/:userBookingID', auth, editBookings);

router.delete('/delete/:bookingID', auth, deleteBooking);

router.post('/review/:_id', auth, createReview);

router.get('/review/:_id', getReviews);

router.delete('/review/:_id/:deleteID',auth, deleteReview);

router.put('/review/:_id/:reviewID', auth, updateReview);
//API ROUTES FOR GET REVIEWS // DELETE REVIEWS // UPDATE REVIEWS

router.put('/payment-update', auth, bookingPaymentUpdate);

module.exports = router;
