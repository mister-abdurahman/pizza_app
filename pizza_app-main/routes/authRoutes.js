const mongoose = require('mongoose');

const userModel = require("../models/userModel")

async function authenticate(req, res){
    const {username, password, user_role} = req.body
    const user = await userModel.findOne({username: username, password: password}) 
    if(!user) return res.status(401).json({message: "Authorization Failed !"})
    
    return res.status(200)
}

module.exports = { authenticate }