const express = require("express");
const { getUserBookingsAdmin, updateUserBookingsAdmin, getTotalUsersAdmin, getUsersAndThereTotalBookings } = require('../Contorllers/AdminController');
const admin = require('../MiddleWare/admin');

const router = express.Router();

router.get('/get-bookings', admin, getUserBookingsAdmin);

router.put('/update-booking/:_id', admin, updateUserBookingsAdmin);

router.get('/get-total-users', admin, getTotalUsersAdmin);

router.get('/get-users-with-booking', admin, getUsersAndThereTotalBookings);

module.exports = router;