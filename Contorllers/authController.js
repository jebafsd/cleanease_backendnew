const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const sendEmail = require("../Utils/EmailServises");

dotenv.config();

const generateToken = (user) => {
  const jwtData = {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role:user.role,
  };
  return jwt.sign(jwtData, process.env.JWTSECRET, { expiresIn: "1d" });
};

exports.sendRegisterMail = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if(!firstname || !lastname || !email || !password){
    return res.status(400).send("All credentials required")
  }

  const user_detail = await User.findOne({ email });
  if (user_detail && user_detail.active) {
    return res.status(400).send("User / Email already exists and accound has been activated!");
  }

  const registerToken = Math.random().toString(36).slice(-8);
  const registerTokenExp = Date.now() + 3600000; //Expires in for 1hr

  const salt = parseInt(process.env.SALT);
  const hasedPassword = await bcrypt.hash(password, salt);

  const new_user = new User({
    firstname,
    lastname,
    email,
    password: hasedPassword,
    registerToken,
    registerTokenExp,
    
  });
  await new_user.save();

  const message = `<div style="display:flex;flex-direction:column;justify-content:center;text-align: center;background-color: lightgreen;border: 5px outset black;color:black">
  <div style="padding:10px;margin:5px">
  <h3 style="margin:0px">Verify Account to login!</h3>
  <p>Account Created successfully, please follow the instructions to register your account. Click on the below link to register your account, this link expires in 1hr. <br>  If you did not request this, please ignore this email.</p>
  <a style="text-decoration:none; border:1px solid black; background-color:black;color:white;padding:4px;border-radius:5px" type="button" href="${process.env.NETLIFY_REGISTOR}${registerToken}" target="_blank">Verify Now!</a>
  <h4>NOTE : IF THE ABOVE BUTTON IS NOT CLICKABLE PLEASE COPY AND PAST THE LINK IN YOUR BROWSER TO ACTIVATE YOUR ACCOUNT</h4>
  <p>${process.env.NETLIFY_REGISTOR}/${registerToken}</p>`;

  sendEmail({
    email: new_user.email,
    subject: "Email account verification",
    message,
    res,
  });
};

exports.checkRegisterUser = async (req, res) => {
  const { registerToken } = req.params;
  console.log("Received registerToken:", registerToken);//console log
  try {
    const user = await User.findOne({ registerToken });
    if (!user) {
      console.log("User not found with registerToken:", registerToken);//console log
      return res.status(400).send("Registration Url error");
    }
    if (Date.parse(user.registerTokenExp) < Date.now()) {
      console.log("Token expired for user:", user.email); // Debugging log
      return res.status(400).send("Register Verify token expires!");
    }
    user.active = true;
    user.registerTokenExp = null;
    user.registerToken = null;

    await user.save();
    console.log("User activated successfully:", user.email); // Debugging log
    
    res.status(200).json({
      token: generateToken(user),
      message:"User Account activation success!"
    });
  } catch (err) {
    console.error("Error in checkRegisterUser:", err); // Debugging log
    res.status(400).send("Connection Timeout! Try again later");
  }
};

exports.userlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const check_user = await User.findOne({ email });
    if (!check_user) {
      return res.status(400).send("Email Not Exists");
    }
    const isMatch = await bcrypt.compare(password, check_user.password);
    if (!isMatch) {
      return res.status(400).send("Incorrect password");
    }
    if (check_user.active == false) {
      return res.status(400).send("Account email activation required to login");
    }

    res.status(200).json({
      token: generateToken(check_user),
    });
  } catch (err) {
    res.status(400).send("Connection timeout! Error when login");
  }
};

exports.resetPassToken = async (req, res) => {
  const { email } = req.body;
  const userData = await User.findOne({ email });

  if (!userData) {
    return res.status(400).send("Email Not found");
  }

  const passResetToken = Math.random().toString(36).slice(-8);
  userData.passResetToken = passResetToken;
  userData.passResetTokenExp = Date.now() + 3600000; //Validate for 1hr

  await userData.save();

  const message = `<div style="display:flex;flex-direction:column;justify-content:center;text-align: center;background-color: lightblue;border: 5px outset black;color:black">
    <div style="padding:10px;margin:5px">
    <h3 style="margin:0px">Password Reset Request</h3>
    <p>Your Password reset token - ${passResetToken}. Click on the below link to reset your password, this link expires in 1hr. <br>  If you did not request this, please ignore this email and your password will remain unchanged.</p>
    <a style="text-decoration:none; border:1px solid black; background-color:black;color:white;padding:4px;border-radius:5px" type="button" href="${process.env.NETLIFY_PASSWORD}${passResetToken}" target="_blank">Reset Password</a>
  <h4>NOTE : IF THE ABOVE BUTTON IS NOT CLICKABLE PLEASE COPY AND PAST THE LINK IN YOUR BROWSER TO RESET YOUR PASSWORD</h4>
  <p>${process.env.NETLIFY_PASSWORD}/${passResetToken}</p>`;
  sendEmail({
    email: userData.email,
    subject: "Password Reset Request",
    message,
    res,
  });
};

exports.verifyResetPassToken = async (req, res) => {
  const { passResetToken } = req.params;

  const user = await User.findOne({ passResetToken });

  if (!user) {
    return res.status(400).send("Password reset token expiered!");
  }

  if (Date.parse(user.passResetTokenExp) < Date.now()) {
    return res.status(400).send("Reset Token Expires!");
  }

  res.status(200).send("Token Verifyed Success");
};

exports.createNewPass = async (req, res) => {
  const { passResetToken } = req.params;
  const { newPassword } = req.body;
  const user = await User.findOne({ passResetToken });

  if (!newPassword) {
    return res.status(400).send("Required Field newPassword");
  }

  const salt = parseInt(process.env.SALT);
  const hasedPassword = await bcrypt.hash(newPassword, salt);

  await User.updateOne(
    { _id: user._id },
    { password: hasedPassword, passResetToken: null, passResetTokenExp: null }
  );
  res.status(200).json({token:generateToken(user),message:"Updated password Succesfully"});
};
