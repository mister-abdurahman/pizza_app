const userModel = require("../models/user")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

// Sign Up
async function signup(req, res, next){
    try {
        const {email, password, username} = req.body;
        if(!email || !password || !username){
            return next(new Error("Ensure you enter the following details: Username, an Email and a password"))
        }
        const user = await userModel.create({email, password, username})
        const payload = { user: {id: user._id, email: user.email} } 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY_TIME })
        user.password = undefined //Prevent password display.
        return res.status(200).json({status: "success",token, user})
        } catch (error) {
        res.status(500).send("Something broke")
        }
}

// Log In
async function login(req, res, next){
    try {
        const {username, password} = req.body;
        if(!username || !password){
            return next(new Error("username and password required"))
        }
        const user = await userModel.findOne({username})
        if(!user) return next(new Error("Username does not exist, Enter a valid username"))
        const isValidPassword = await user.isValidPassword(password)
        if(!isValidPassword) return next(new Error("password is incorrect !"))
        const payload = { user: {id: user._id, username: user.username} } 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY_TIME})
        user.password = undefined //Prevent password display.
        return res.status(200).json({status: "success", token, user}) 
        } catch (error) {
        console.log(error)
        res.status(500).send("Something broke")
        }}


module.exports = {
    signup,
    login
}