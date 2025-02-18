const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  id: ObjectId,
  created_at: Date,
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_type: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
});

// The Pre-hook
// userSchema.pre("save", async function (next) {
//   const hash = await bcrypt.hash(this.password, 10);

//   this.password = hash;
//   next();
// });

// Password Validation
// userSchema.methods.isValidPassword = async function (password) {
//   const compare = await bcrypt.compare(password, this.password);

//   return compare;
// };

const User = mongoose.model("users", userSchema);
module.exports = User;
