require('dotenv').config()

const express = require("express")
const { default: mongoose } = require("mongoose")
const User = require('./models/user')
const session = require("express-session")

// Express app
const app = express()

mongoose.connect(process.env.USER_LOGIN)
 
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
    let username = req.body.namee
    let password = req.body.password


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
            
        }

    }else{
        //user does not exist
        res.render("login", { msg: "USERNAME OR PASSWORD IS INCORRECT" })
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
                console.log(result)
            })
            .catch((err) => {
                console.log(err)
            })
    }else{
        res.render("register", { msg: "USERNAME ALREADY IN USE" })
    }




})


app.get("/patient-form", (req, res) => {

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


app.listen(3000)



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