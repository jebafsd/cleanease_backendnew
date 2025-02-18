# 🧹 CleanEase Site BackEnd

## 🚀 Overview
This repository contains the backend of a functional booking platform for a cleaning service. The backend is built with Node.js and Express.js, providing a robust and scalable solution for managing user bookings, user authentication and other logic. MongoDB is used as the database to store and manage data.

**RENDER URL --> https://cleanease-backend-780q.onrender.com**

## 🧰 Tech Stack

- **Node.js 🟢: JavaScript runtime for server-side programming.
- **Express.js : Web framework for building RESTful APIs.
- **MongoDB 🍃: NoSQL database for storing and managing data.
- **JWT 🔐: JSON Web Tokens for secure user authentication.
- **Mongoose : ODM (Object Data Modeling) library for MongoDB, facilitating data interaction.
- **Socket-io : For Real time Notification generation about booking status from Admin to User.

## 📂 Folder Structure
```
/src
|-- controllers
|   |-- authController
|   |-- UserController
|   |-- BookingController
|   |-- NotificationController
|   |-- razorPayController
|   |-- UserCheckListController
|   |-- cleanEaseController
|   |-- AdminController
|-- DB
|   |-- ConnectMongoDB
|-- MiddleWare
|   |-- Admin
|   |-- auth
|-- Models
|   |-- CleanServices
|   |-- CleanSubCategories
|   |-- Notification
|   |-- User
|   |-- UserBookings
|   |-- UserChecklist
|-- Routes
|   |-- adminRoutes
|   |-- authRoutes
|   |-- bookingRoutes
|   |-- cleanEaseRoutes
|   |-- notificationRoutes
|   |-- razorPayRoutes
|   |-- userRoutes
|   |-- userCheckListRoutes
|-- Utils
|   |-- EmailServices
|-- server.js
|-- package
|-- package-lock
```

## 🧪 How to Run the BackEnd
**Install Dependencies** 📦
   ```bash
	npm install express
	npm install mongoose
	npm install jsonwebtoken
	npm install bcryptjs
	npm install body-parser
	npm install nodemailer
	npm install razorpay
	npm install dotenv
	npm install cors
	npm install socket.io
   ```


**Environment files required fields**
```bash
PORT=SERVER_RUNNING_PORT
MONGODB_URI=YOUR_MONGODB_ATLAS_URI
JWTSECRET=YOUR_JSON_WEB_TOKEN_SECRET
SALT=JSON_WEB_TOKEN_SALT
GMAIL_PASS=YOUR_NODEMAILER_PASSWORD
GMAIL_ACC=YOUR_NODEMAILER_EMAIL
VERIFY_REGISTER=YOUR_FRONTEND_URL_FOR_REGISTER_VERIFICATION
VERIFY_PASSWORD=YOUR_FRONTEND_URL_FOR_FORGOT_PASSWORD_VERIFICATION
TEST_KEY_ID=YOUR_RAZOR_PAY_ID
TEST_KEY_SECRET=YOUR_RAZOR_PAY_SECRET
```

**API END-POINT EXPLANATION**

AUTH-ROUTE ---> /api/auth
      
	POST	- /register --> To Create User in DB and send an Account Activation Link for user to activate his/her account.
	GET	- /register-check/:registerToken --> To check the register token generated for the user and activate his/her account and generate JWT(JSON WEB TOKEN).
	POST	- /login --> To Login registered User and generate JWT
	POST	- /resetPass --> Check the user mailID and send the reset pass token to user mailID.
	GET	- /resetPass-check/:passResetToken --> To verify the reset pass token and allow user to reset there password.
	PUT	- /updatePass/:passResetToken --> To Update the user password.

USER-ROUTE ---> /api/user (REQUIRED USER JWT)

	GET	- /getProfile --> To get the user details.
	PUT	- /updateProfile --> To update user details.

BOOKING-ROUTE ---> /api/bookings (REQUIRED USER JWT)

	POST	- /create/:cleanSubCategoriesID --> User to create bookings
	GET	- /get --> Get All User's Bookings.
	PUT	- /update/:userBookingID --> To edit the user booking
	DELETE	- /delete/:bookingID --> To delete user bookings
	POST	- /review/:_id --> To create user review
	GET	- /review/:_id --> To get all reviews for particular service (NO NEED FOR JWT)
	DELETE	- /review/:_id/:deleteID --> TO delete the user review
	PUT	- /review/:_id/:reviewID --> To Update the user Review
	PUT	- /payment-update --> To Update the payment status for user bookings.
	
NOTIFICATION-ROUTE ---> /api/notification (REQUIRED USER JWT)

	POST	- /create --> Create User Notification
	GET	- /get --> Get user Notification
	DELETE	- /delete/:_id --> TO Delete User Notification

CLEANEASE-ROUTE ---> /api/data

	GET	- / --> Get all main services from clean ease
	GET	- /:cleanServiceID --> Get all subCleanServices

RAZORPAY-ROUTE ---> /api/payment (REQUIRED USER JWT)

	POST	- /create-order --> To create RazorPay Order
	POST	- /validate --> To validate the RazorPay Payment

USER-CHECKLIST-ROUTE ---> /api/checklist (REQUIRED USER JWT)

	POST	- /create --> Create a new checklist item for user
	GET	- /get --> Get all checklist items
	PUT	- /update/:_id --> To Update Particular checklist item
	DELETE	- /delete/:_id --> Delete a particular checklist item

ADMIN-ROUTE ---> /api/admin (REQUIRED ADMIN JWT)

	GET	- /get-bookings --> To get all Users Bookingdetails
	PUT	- /update-booking/:_id --> To update the user Booking
	GET	- /get-total-users --> To get the details of total users
	GET	- /get-users-with-bookings --> To get users with total number of bookings.
