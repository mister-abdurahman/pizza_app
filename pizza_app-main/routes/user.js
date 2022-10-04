const express = require('express');
const moment = require('moment');

const userRoute = express.Router()

const userModel = require("../models/userModel");


userRoute.post('/', async (req, res) => {
    const body = req.body;

    const username = body.username
    const password = body.password
    const user_role = body.user_role

    const order = await userModel.create({ 
        username,
        password,
        user_role
    })
    
    return res.json({ status: true, order })
})


userRoute.get('/', async (req, res) => {
    const user  = await userModel.find()

    return res.json({ status: true, user })
})






module.exports = userRoute