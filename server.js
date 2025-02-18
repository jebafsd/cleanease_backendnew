const express = require("express");
const cors= require("cors");
//require("dotenv").config();
require("dotenv").config({ path: '.env.override', override: true });
require("./DB/ConnectMongoDB");

//
const http = require('http');
const socketIo = require('socket.io');
//


const bodyParser = require("body-parser");
const authRoute = require('./Routes/authRoutes');
const userRoute = require('./Routes/userRoutes');
const bookingRoute = require('./Routes/bookingRoutes');
const notificationRoute = require('./Routes/notificationRoutes');
const cleanEaseRoute = require('./Routes/cleanEaseRoutes');
const razorPayRoute = require('./Routes/razorPayRoutes');
const UserCheckListRoute = require("./Routes/userCheckListRoutes");
const AdminRoute = require("./Routes/adminRoutes");

const app = express();

//
const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
        origin: '*', // Allow all origins, or specify allowed domains
        methods: ['GET', 'POST']
    },
});

app.set('io', io); // Make io accessible via the app
//

//
io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);
    });

    socket.on("joinRoom",(data) => {
        socket.join(data);
    })

    socket.on('StatusUpdatedNotification', (data) => {
        console.log(data);
        // Broadcast the updated booking status to the specific user
        socket.to(data.userId).emit('bookingStatusUpdated', data);
    });
});
//

const PORT = process.env.PORT;

app.use(cors());
//app.use(cors({ origin: 'http://127.0.0.1:5173' })); // Replace with your frontend URL
app.use(bodyParser.json());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use('/api/booking', bookingRoute);
app.use('/api/notification', notificationRoute);
app.use('/api/data', cleanEaseRoute);
app.use('/api/payment', razorPayRoute);
app.use('/api/checklist', UserCheckListRoute);
app.use('/api/admin', AdminRoute);

server.listen(PORT,()=>{
    console.log(`Server Running on Port - ${PORT}`)
    console.log(`MOngodburi - ${process.env.MONGODB_URI}`)
    console.log(`Email - ${process.env.GMAIL_ACC}`)
}) 