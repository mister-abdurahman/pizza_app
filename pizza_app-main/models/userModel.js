const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    id: ObjectId,
    username: {type: String, maxLength: 20, required: true},
    password: {type: String, minLength: 4, required: true},
    user_role:{type: String,enum: ["user", "admin"],default: ["user"], required: true}
})


module.exports = mongoose.model('User', userSchema);

