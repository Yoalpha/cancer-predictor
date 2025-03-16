const mongoose = require("mongoose")

const patientInfoSchema = new mongoose.Schema({

    patientName: {
        type: String,
        required: true
    }, 

    doctorName: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    airPollution: {
        type: String,
        required: true
    },
    alcoholUse: {
        type: String,
        required: true
    },
    dustAllergy: {
        type: String,
        required: true
    },
    occupationalHazards: {
        type: String,
        required: true
    },
    geneticRisk: {
        type: String,
        required: true
    },
    chronicLungDisease: {
        type: String,
        required: true
    },
    balancedDiet: {
        type: String,
        required: true
    },
    obesity: {
        type: String,
        required: true
    },
    smoking: {
        type: String,
        required: true
    },
    passiveSmoker: {
        type: String,
        required: true
    },
    chestPain: {
        type: String,
        required: true
    },
    coughingOfBlood: {
        type: String,
        required: true
    },
    fatigue: {
        type: String,
        required: true
    },
    weightLoss: {
        type: String,
        required: true
    },
    shortnessOfBreath: {
        type: String,
        required: true
    },
    wheezing: {
        type: String,
        required: true
    },
    swallowingDifficulty: {
        type: String,
        required: true
    },
    clubbingOfFingerNails: {
        type: String,
        required: true
    },
    frequentCold: {
        type: String,
        required: true
    },
    dryCough: {
        type: String,
        required: true
    },
    snoring: {
        type: String,
        required: true
    }

}, {timestamps: true})

const user_login = mongoose.connection.useDb('user-login');

module.exports = user_login.model('PatientInfo', patientInfoSchema)