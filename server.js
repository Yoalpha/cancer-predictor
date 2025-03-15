require('dotenv').config()

const express = require("express")
const { default: mongoose } = require("mongoose")
const User = require('./models/user')

// Express app
const app = express()

mongoose.connect(process.env.USER_LOGIN)
 
const db = mongoose.connection 

db.on('error', (error)=> console.log(error))
db.once('open', ()=> console.log('CONNECTED TO DATABASE'))

// Static files
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
.post((req, res) => {
    let username = req.body.namee
    let password = req.body.password
    console.log(username)
    console.log(password)
    res.send("hi")
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
    console.log(flag)
    console.log('hello')
    
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
    res.render("form")
})


app.listen(3000)


// function to check if user exists. returns boolean
async function checkIfUserExists(username){
    const existing_username = await User.find({username: username})
    console.log(existing_username)
    if(existing_username.length === 0){
        return false // indicating user does not exist
    }else{
        return true // indicating the user exists
    }

}