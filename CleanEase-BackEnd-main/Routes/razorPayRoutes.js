const express = require("express");
const { payment, validate } = require('../Contorllers/razorPayController');
const auth = require("../MiddleWare/auth");

const router = express.Router();

router.post('/create-order', auth, payment);

router.post('/validate',auth, validate)

module.exports = router;
