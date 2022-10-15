// const mongoose = require('mongoose');
// const userModel = require("../models/userModel")

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRouter = express.Router();

authRouter.post(
    '/signup',
    passport.authenticate('signup', { session: false }), async (req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    }
);

authRouter.post('/login', async(req, res, next) => {
    passport.authenticate('login', async(err, user, info) => {
        try {
            if(err) return next(err);   
            
            if(!user){
                const error = new Error('Username or Password is Incorrect')
                return next(error);
            }

            req.login(user, {session: false}, async (error) => {
                if(error) return next(error);

                const body = {_id: user._id, username: user.username};

                const token = jwt.sign({user: body}, process.env.JWT_SECRET);

                return res.json({ token });
            })
        } catch (error) {
            return next(error)
        }
    })(req, res, next);
})

// I changed the authentication to JWT Passport Authentication.

// async function authenticate(req, res){
//     const {username, password, user_role} = req.body
//     const user = await userModel.findOne({username: username, password: password}) 
//     if(!user) return res.status(401).json({message: "Authorization Failed !"})
    
//     return res.status(200)
// }

// module.exports = { authenticate }

module.exports = authRouter;