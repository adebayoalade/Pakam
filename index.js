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
sequelize.sync({ alter: true }).then(() => {
    console.log("Database Connection Established");
    }).catch((err) => {
        console.log(err);
        });



//Use the route
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/event", eventRoute);

const PORT = process.env.PORT || 3307;
app.listen(PORT, () => {
    console.log(`Backend services is running on ${PORT}`);
});