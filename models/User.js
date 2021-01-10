const { model, Schema } = require("mongoose");

// Definition of the user model
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String
});

module.exports = model('User', userSchema, "users");