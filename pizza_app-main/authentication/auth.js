const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/userModel');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require("dotenv").config()


// Passport Middleware
passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret-token')
        }, 
        async(token, next) => {
            try {
                return next(null, token.user)
            } catch (error) {
                next(error)
            }
        } 
    )
)

passport.use(
    'signup',
     new localStrategy(
        {
            usernameSpace: 'username',
            passwordSpace: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await UserModel.create({ username, password });
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
     )
)



passport.use(
    'login',
    new localStrategy(
        {
            usernameSpace: 'username',
            passwordSpace: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ username });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password); //remember this function?, we made it in the users.js model 

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);