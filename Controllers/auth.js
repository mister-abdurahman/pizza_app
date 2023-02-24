const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const { hashSync } = require("bcrypt");
const bcrypt = require("bcrypt");
const passport = require("passport");

passport.initialize();
require("../passport");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
// My Code:

// Sign Up
async function signup(req, res, next) {
  try {
    const user = new userModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: hashSync(req.body.password, 10),
    });
    await user.save();

    return res.status(200).send({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        username: user.username,
      },
    });
    // const payload = { user: { id: user._id, email: user.email } };
    // const payload = { id: user._id, email: user.email };
    // const token = jwt.sign(
    //   payload,
    //   process.env.JWT_SECRET || "something_secret",
    //   {
    //     expiresIn: process.env.JWT_EXPIRY_TIME,
    //   }
    // );
    // user.password = undefined; //Prevent password display.
    // user.save();
  } catch (error) {
    res.status(500).send("Something broke");
  }
}

// Log In
async function login(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "User not found" });
    }

    // if (!compareSync(req.body.password, user.password)) {
    //   return res
    //     .status(401)
    //     .send({ success: false, message: "Incorrect Password" });
    // }
    const compare = await bcrypt.compare(req.body.password, user.password);
    if (!compare) {
      return res
        .status(401)
        .send({ success: false, message: "Incorrect Password" });
    }

    const payload = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).send({
      success: "true",
      message: "Logged in successfully",
      token: "Bearer " + token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something broke");
  }
}

// accts11111111111111111111111
// {
//   username: BAT,
//   password: aramide12j345671
// }
// {
//   username: BATMAN,
//   password: FORGOTTENjewel
// }

module.exports = {
  signup,
  login,
};
