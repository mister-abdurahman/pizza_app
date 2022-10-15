const express = require('express');
const passport = require('passport')
const bodyParser = require('body-parser')
const authRoute = require('./routes/authRoutes')  //done.

// I Modified the UserModel... 

const {connectToMongoDB} = require('./database')
const orderRoute = require("./routes/order")
const userRoute = require("./routes/user")

require("dotenv").config()
require("./authentication/auth") //done.

// Connecting to the MongoDB instance
connectToMongoDB();

const PORT = process.env.PORT

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', authRoute); //.....

app.use('/order', passport.authenticate('jwt', { session: false }), orderRoute); //..........
app.use('/user', passport.authenticate('jwt', { session: false }), userRoute); //..........

 
// render the Pizza App Home Page
app.get('/', (req, res) => {
    res.send('Welcome to the Pizza App API');
});

// Handle errors.
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});

app.listen(PORT, () => {
    console.log('Listening on port, ', PORT)
})