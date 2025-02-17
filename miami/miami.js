const express = require('express')
const app = express()
const port = process.env.port || 3000
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
const handler = require('./lib/handler')

//Import navigation data
let navigation = require("./data/navigation.json")

// Setup template engine
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// Create some routes
app.get('/', (request, response) => {
    response.type("text/html")
    response.render("home", { title: "Miami Travel Site", nav: navigation })
})

app.get('/beaches', (request, response) => {
    response.type("text/html")
    response.render("page", { title: "Beaches", nav: navigation })
})

app.get('/nightlife', (request, response) => {
    response.type("text/html")
    response.render("page", { title: "Night Life", nav: navigation })
})

app.get('/about', (request, response) => {
    response.type("text/html")
    response.render("page", { title: "About Miami", nav: navigation })
})

app.get('/search', (request, response) => {
    console.log(request)
    response.type("text/html")
    response.render("page", { title: "Search Results for " + request.query.q + ":" })
})

app.get('/basic', (req, res) => {
    response.render("page", { req })
})




// Newsletter Section
app.get('/newsletter-signup', handler.newsletterSignup)
app.post('/newsletter-signup/process', handler.newsletterSignupProcess)
app.get('/newsletter/list', handler.newsletterSignupList)
app.get('/newsletter/thankyou', (req, res) => { res.render('thankyou') })
app.get('/newsletter/details/:email', handler.newsletterUser)
app.get('/newsletter/delete/:email', handler.newsletterUserDelete)


// Error handling goes after actual routes
// default - response not found
app.use((request, response) => {
    response.type("text/html")
    response.status(404)
    response.send("404 not found")
})


// Server Error
app.use((error, request, response, next) => {
    console.log(error)
    response.type("text/html")
    response.status(500)
    response.send("500 server error")
})





//start the server
app.listen(port, () => {
    console.log(`Express is running on http://localhost:${port};`)
    console.log(` press control-c to terminate.`)
})