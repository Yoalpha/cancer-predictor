require('dotenv').config()

const express = require("express")

const { default: mongoose } = require("mongoose")
const app = express()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
 
const db = mongoose.connection

db.on('error', (error)=> console.log(error))
db.once('open', ()=> console.log('CONNECTED TO DATABASE'))

// Static files
app.use(express.static('public'))
app.user(express.json())
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/images', express.static(__dirname + 'public/images'))
app.use(express.urlencoded())


// Set views
app.set('views', './views')
app.set('view engine', 'ejs')


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
.post((req, res) => {
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let confirm_password = req.body.confirm_password
    let role = req.body.role
    if(password !== confirm_password){
        res.render("register", { msg: "PASSWORDS DO NOT MATCH" })

    }



    res.redirect('/login')
})




app.get("/patient-form", (req, res) => {
    res.render("form")
})


app.listen(3000)