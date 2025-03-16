const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    }, 

    role: {
        type: String,
        requred: true
    },

    email: {
        type: String,
        requred: true
    },

    password: {
        type: String,
        requred: true
    }


}, {timestamps: true})

const user_login = mongoose.connection.useDb('user-login');

module.exports = user_login.model('User', userSchema)