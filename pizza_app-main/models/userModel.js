const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    id: ObjectId,
    username: {type: String, maxLength: 20, required: true, unique: true},
    password: {type: String, minLength: 4, required: true},
    // user_role:{type: String,enum: ["user", "admin"],default: ["user"], required: true}
})

// Pre-Hook
userSchema.pre('save', async function(next){
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
})

// Compare Password 
userSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;