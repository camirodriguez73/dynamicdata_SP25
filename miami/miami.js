const express = require('express')
const app = express()
const port = process.env.port || 3000
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
const handler = require('./lib/handler')

//Setup static routing
app.use(express.static('./public'))

//Import navigation data
let navigation = require("./data/navigation.json")

//import slideshow
let slideshow = require("./data/slideshow.json")

//import gallery
let gallery = require("./data/gallery.json")

// import page data
let content = require("./data/pages.json")

// import destinations
let destinations = require("./data/destinations.json")

// Setup template engine
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// Create some routes
app.get('/', (request, response) => {
    let slides = slideshow.slides.filter((slide) => {
        return slide.home = true
    })
    response.type("text/html")
    response.render("page", {
        title: "Miami Travel Site",
        nav: navigation,
        slides: slides,
        images: gallery.images
    })
})


//dynamic routes for pages
app.get('/page/:page', (request, response) => {
    // filter pages object to get pages from request.params.page
    let page = content.pages.filter((item) => {
        return item.page = request.params.page
    })

    // filter slides object to get slides from request.params.page
    let slides = slideshow.slides.filter((slide) => {
        return slide.page = request.params.page
    })

    // filter slides
    let dest = destinations.locations.filter((location) => {
        return location.page = request.params.page
    })

    response.type("text/html")
    response.render("page", {
        title: page[0].title,
        description: page[0].description,
        nav: navigation,
        //locations: dest,
        slides: slides,
        images: gallery.images
    })
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

app.get('/newsletter/thankyou', (req, res) => {
    res.render('thankyou', { nav: navigation })
})

//Dynamic Routes
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