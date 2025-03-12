const express = require("express")
const app = express()

// Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/images', express.static(__dirname + 'public/images'))


// Set views
app.set('views', './views')
app.set('view engine', 'ejs')


app.get("/", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/patient-form", (req, res) => {
    res.render("form")
})


app.listen(3000)