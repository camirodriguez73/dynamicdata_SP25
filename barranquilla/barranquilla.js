const express = require('express')
const app = express()
const port = process.env.port || 3000
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
const handler = require('./lib/handler')

//Setup static routing
app.use(express.static('./public'))

//Import all JSON files
let navigation = require("./data/navigation.json")
let slideshow = require("./data/slideshow.json")
let gallery = require("./data/gallery.json")
let content = require("./data/pages.json")
let destinations = require("./data/destinations.json")

// Setup template engine
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');


// ROUTES - Home Page
app.get('/', (request, response) => {
    let slides = slideshow.slides.filter((slide) => {
        return slide.home == true
    })
    response.type("text/html")
    response.render("page", {
        title: "Visit Barranquilla!",
        nav: navigation,
        slides: slides,
        images: gallery.images
    })
})

// ROUTES - Dynamic Pages
app.get('/page/:page', (request, response) => {
    // filter pages to only show matches from request.params
    let page = content.pages.filter((item) => {
        return item.page == request.params.page
    })
    let slides = slideshow.slides.filter((slide) => {
        return slide.page == request.params.page
    })
    let dest = destinations.locations.filter((location) => {
        return location.page == request.params.page
    })

    // render the page
    response.type("text/html")
    response.render("page", {
        title: page[0].title,
        description: page[0].description,
        nav: navigation,
        destinations: dest,
        slides: slides,
        images: gallery.images
    })
})

// Newsletter Section
app.get('/newsletter-signup', handler.newsletterSignup)
app.post('/newsletter-signup/process', handler.newsletterSignupProcess)
app.get('/newsletter/list', handler.newsletterSignupList)
app.get('/newsletter/thankyou', (req, res) => {
    res.render('thankyou', { nav: navigation })
})

// Email dynamic Routes
app.get('/newsletter/details/:email', handler.newsletterUser)
app.get('/newsletter/delete/:email', handler.newsletterUserDelete)

// ERROR - response not found
app.use((request, response) => {
    response.type("text/html")
    response.status(404)
    response.send("404 not found")
})

// ERROR - Server Error
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