const nodeMailer = require("nodemailer");
require("dotenv").config();

const sendEmail = (options) => {
  const transporter = nodeMailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_ACC,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_ACC,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  transporter.sendMail(mailOptions, async (err, info) => {
    if (err) {
      options.res.status(400).send("Connection timeout! Please try again later.");
    }
    if (info.response) {
      options.res.status(200).send("Email sent successfully");
    }
  });
};

module.exports = sendEmail;