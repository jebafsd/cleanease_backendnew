const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config();

//CONNECT TO MONGODB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB URI"))
  .catch((error) => console.log("Failed To Connect MongoDB",error));
