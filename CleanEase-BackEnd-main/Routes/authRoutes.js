const express = require("express");
const { sendRegisterMail, checkRegisterUser, userlogin, resetPassToken, verifyResetPassToken, createNewPass } = require('../Contorllers/authController');

const router = express.Router();

router.post('/register', sendRegisterMail);

router.get('/register-check/:registerToken', checkRegisterUser);

router.post('/login', userlogin);

router.post('/resetPass', resetPassToken);

router.get('/resetPass-check/:passResetToken', verifyResetPassToken);

router.put('/updatePass/:passResetToken', createNewPass);

module.exports = router;