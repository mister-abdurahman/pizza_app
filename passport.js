// The idea of using passport-jwt authentication is to use passport to confirm the correct
// generated token while accessing protected routes

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const userModel = require("./models/user");
// const localStrategy = require("passport-local").Strategy;
require("dotenv").config();

//Akilesh Rao Passport-JWT code:
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    userModel.findOne({ _id: jwt_payload.id }, function (err, user) {
      if (err) {
        console.log(err);
        return done(err, false);
      }
      if (user) {
        console.log(user);
        return done(null, user);
      } else {
        console.log("vague error");
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

//  My initial code Approach:
// passport.use(
//   new JwtStrategy(
//     {
//       secretOrKey: process.env.JWT_SECRET || "something_secret",
//       // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Use this if you are using Bearer token
//     },
//     async (token, done) => {
//       try {
//         return done(null, token.user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );
