const express = require('express');
const passport = require('passport');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet')

const app = express()

const limiter = rateLimit({
	windowMs: 0.2 * 60 * 1000, // 15 minutes
	max: 4, 
	standardHeaders: true, 
	legacyHeaders: false, 
})

//add secuirty
app.use(helmet())


// Applying the rate limiting middleware to all requests
app.use(limiter)

app.use(passport.initialize())
require('./authentication/passport')
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const orderRouter = require('./routes/order')//
const authRouter = require('./routes/user')//
    
app.use('/auth', authRouter) 
app.use('/order', orderRouter) 


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Interna Server Error";
    return res.status(statusCode).json({status: "Error !", message})

}) 

module.exports = app 