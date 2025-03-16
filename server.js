require('dotenv').config()

const express = require("express")
const mongoose = require("mongoose")
const User = require('./models/user')
const Patient = require('./models/patients')
const PatientInfo = require('./models/patientInfo')

const session = require("express-session")


// Express app
const app = express()

// Database connection
mongoose.connect(process.env.USER_LOGIN)

// Connection confimation
const db = mongoose.connection 
db.on('error', (error)=> console.log(error))
db.once('open', ()=> console.log('CONNECTED TO DATABASE'))

// Static files
app.use(
    session({
        secret: process.env.SECRET_KEY,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60 // session expire time
        }
    })
)

app.use(express.static('public'))
app.use(express.json())
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/images', express.static(__dirname + 'public/images'))
app.use(express.urlencoded())

// Set views
app.set('views', './views')
app.set('view engine', 'ejs')


// Routes
app.get("/", (req, res) => {
    res.render("index")
})


app.route("/login")
.get((req, res) => {
    res.render("login")

})
.post(async (req, res) => {

    // Getting input from user
    const username = req.body.namee
    const password = req.body.password


    // check if username exists
    if(await checkIfUserExists(username)){
        // user exists
        const user = await getUserObj(username)
        const dbpassword = user[0].password
        const role = user[0].role

        // checking if passwords match
        if(dbpassword === password){
            
            // creating session
            req.session.user = {
                username: username,
                role: role
            }

            // redirecting acording to role
            if(role === "doctor"){
                res.redirect('/doctor-page')
            }else if(role === "patient"){
                res.redirect("/patient-form")
            }
            
        }else{
            //user entered incorrect password error message
            res.render("login", { msg: "PASSWORD IS INCORRECT" , usr: username})
        }

    }else{
        //user does not exist error message
        res.render("login", { msg: "USERNAME IS INCORRECT" })
    }

})


app.route("/register")
.get((req, res) => {
    res.render("register")
    
})
.post(async (req, res) => {

    // Getting the user data from register page
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let confirm_password = req.body.confirm_password
    let role = req.body.role

    // Checking if the passwords are equal
    if(password !== confirm_password){
        res.render("register", { msg: "PASSWORDS DO NOT MATCH" })
    }

    // Checking if username exists    
    const flag = await checkIfUserExists(username)

    // Validating
    if(flag === false){
        
        // creating user object defined in ./models/user.js
        const user = new User({
            username: username,
            role: role,
            email: email,
            password: password
        })

        // updating the database with the new model
        user.save()
            .then((result) => {
                res.redirect('/login') 
            })
            .catch((err) => {
                console.log(err)
            })
    }else{
        // rendering the register page with error message
        res.render("register", { msg: "USERNAME ALREADY IN USE" })
    }

})


app.route("/patient-form")
.get((req, res) => {

    const user = req.session.user

    // Checking if user is in session
    if(user === undefined){
        // Redirect to login if session is not created
        res.redirect("/login")
    }else{
        // rendering the form is the session is created
        res.render("form")
    }
    
})
.post(async (req, res) => {
    
    // Collecting data from assessment form
    const patientName = req.body.patientName
    const doctorName = req.body.doctorName
    const age = req.body.age
    const gender = req.body.gender
    const airPollution = req.body.airPollution
    const alcoholUse = req.body.alcoholUse
    const dustAllergy = req.body.dustAllergy
    const occupationalHazards = req.body.occupationalHazards
    const geneticRisk = req.body.geneticRisk
    const chronicLungDisease = req.body.chronicLungDisease
    const balancedDiet = req.body.balancedDiet
    const obesity = req.body.obesity
    const smoking = req.body.smoking
    const passiveSmoker = req.body.passiveSmoker
    const chestPain = req.body.chestPain
    const coughingOfBlood = req.body.coughingOfBlood
    const fatigue = req.body.fatigue
    const weightLoss = req.body.weightLoss
    const shortnessOfBreath = req.body.shortnessOfBreath
    const wheezing = req.body.wheezing
    const swallowingDifficulty = req.body.swallowingDifficulty
    const clubbingOfFingerNails = req.body.clubbingOfFingerNails
    const frequentCold = req.body.frequentCold
    const dryCough = req.body.dryCough
    const snoring = req.body.snoring

    // creating pstientInfo object
    const patientInfo = new PatientInfo({
        patientName: patientName,
        doctorName: doctorName,
        age: age,
        gender: gender,
        airPollution: airPollution,
        alcoholUse: alcoholUse,
        dustAllergy: dustAllergy,
        occupationalHazards: occupationalHazards,
        geneticRisk: geneticRisk,
        chronicLungDisease: chronicLungDisease,
        balancedDiet: balancedDiet,
        obesity: obesity,
        smoking: smoking,
        passiveSmoker: passiveSmoker,
        chestPain: chestPain,
        coughingOfBlood: coughingOfBlood,
        fatigue: fatigue,
        weightLoss: weightLoss,
        shortnessOfBreath: shortnessOfBreath,
        wheezing: wheezing,
        swallowingDifficulty: swallowingDifficulty,
        clubbingOfFingerNails: clubbingOfFingerNails,
        frequentCold: frequentCold,
        dryCough: dryCough,
        snoring: snoring
    })

    // adding patient name to session to retrive data on result page
    req.session.user.patientName = patientName

    // saving patient info to database
    patientInfo.save()
    .then(() => {
        res.redirect('/results') 
    })
    .catch((err) => {
        console.log(err)
    })

})


app.get('/results', async (req, res) => {
    
    const user = req.session.user
    
    // Checking if user is in session
    if(user === undefined){
        // Redirect to login if session is not created
        res.redirect("/login")
    }else{
        const patient = req.session.user.patientName
        // rendering the form is the session is created
        // res.render('results', {})
        console.log(await getPatientInfo(patient))
    }

})


app.get('/logout', (req, res) => {

    // destroying session
    req.session.destroy((err) => {
        if(err){
            res.status(500).send('ERROR LOGGIN OUT')
        }else{
            res.redirect('/')
        }
    })

})

app.listen(3000)

// Database Helper functions

// function to check if user exists. returns boolean
async function checkIfUserExists(username){
    const existing_username = await User.find({ username: username })
    if(existing_username.length === 0){
        return false // indicating user does not exist
    }else{
        return true // indicating the user exists
    }

}

// function to get user object
async function getUserObj(username){
    const userObj = await User.find({ username: username })
    return userObj
}

// function to get user information

async function getPatientInfo(username){
    const userInfoObj = await PatientInfo.find({patientName: username})
    return userInfoObj
}