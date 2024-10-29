const express = require("express");
const sequelize = require('./config/database');
const app = express();
const dotenv = require("dotenv");

// use the exported router
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const eventRoute = require("./routes/event");


dotenv.config();


// connect our code to the database
sequelize.sync().then(() => {
    console.log("Database connected");
    }).catch((err) => {
        console.log(err);
        });



//Use the route
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/event", eventRoute);

// to listen to the application
app.listen(process.env.PORT || 3307, () => {
    console.log("Backend services is running");
    });