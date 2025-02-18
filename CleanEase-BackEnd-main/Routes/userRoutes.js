const express = require("express");
const { getProfile, updateProfile } = require('../Contorllers/UserContorller')
const auth = require("../MiddleWare/auth");

const router = express.Router();

router.get('/getProfile', auth, getProfile);

router.put('/updateProfile', auth, updateProfile);

module.exports = router;
