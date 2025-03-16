const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({

    doctor: {
        type: String,
        required: true
    }, 

    patients: {
        type: [mongoose.SchemaTypes.ObjectId],
        requred: true
    }

}, {timestamps: true})

const user_login = mongoose.connection.useDb('user-login');

module.exports = user_login.model('Patient', patientSchema)