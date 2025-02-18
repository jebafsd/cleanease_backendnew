const Razorpay = require("razorpay");
const crypto = require('crypto');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.TEST_KEY_ID,
  key_secret: process.env.TEST_KEY_SECRET,
});

exports.payment = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.validate = async (req, res) => {
  try{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    const secret = process.env.TEST_KEY_SECRET; // Replace with your Razorpay secret
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (generatedSignature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err){
    res.status(400).send(err)
  }
}