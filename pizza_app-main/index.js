const express = require('express');
const {connectToMongoDB} = require('./database')
const orderRoute = require("./routes/order")
const userRoute = require("./routes/user")

require("dotenv").config()

const PORT = process.env.PORT

const app = express()

// Connecting to the MongoDB instance

connectToMongoDB();

app.use(express.json());

app.use("/order", orderRoute)
app.use("/user", userRoute)

app.listen(PORT, () => {
    console.log('Listening on port, ', PORT)
})