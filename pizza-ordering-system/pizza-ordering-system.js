// Set up Express server with Handlebars as the template engine
const express = require('express')
const app = express()

//Setup the template engine
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

//set up body parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// Set up the port to listen on
const port = process.env.port || 3000

// Create Sequelize instance
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});



// Create your first Model
const Customer = sequelize.define('Customers', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING
})

const Order = sequelize.define('Orders', {
    size: DataTypes.STRING,
    toppings: DataTypes.STRING,
    notes: DataTypes.STRING,
    total: DataTypes.NUMBER,
    status: DataTypes.STRING,
})

// make relationship to customer
Order.belongsTo(Customer)
Customer.hasMany(Order)

// sync models with the database
sequelize.sync()

//Create some routes
app.get('/', (request, response) => {
    response.type("text/html")
    response.render("page")
})

// CREATE READ UPDATE DELETE
// Create a new customer
app.get('/customer/create', (request, response) => {
    response.type("text/html")
    response.render("customer-form")
})

// Create a new customer
app.post('/customer/create', async (request, response) => {
    response.type("text/html")
    response.render("page")
    // Create a new customer
    const newCustomer = await Customer.create({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        address: request.body.address,
        city: request.body.city,
        state: request.body.state,
        zip: request.body.zip,
        phone: request.body.phone,
        email: request.body.email
    })
})

// Read all customers
app.get('/customers', async (request, response) => {
    const customers = await Customer.findAll().then((data) => {
        response.type("text/html")
        response.render("customers", { "customers": data })
    })
})

// display specific customer by id
app.get('/customer/details/:id', async (request, response) => {
    const customers = await Customer.findOne({
        where: { id: request.params.id }, raw: true
    }).then((data) => {
        response.type("text/html")
        response.render("customerdetails", { "customer": data })
    })
})

// Update or edit a customer
app.get('/customer/edit/', async (request, response) => {
    const customers = await Customer.findByPk(request.body.id);
    await customers.update({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        address: request.body.address,
        city: request.body.city,
        state: request.body.state,
        zip: request.body.zip,
        phone: request.body.phone,
        email: request.body.email
    }).then(() => {
        customers.save()
        response.type("text/html")
        response.redirect("customers")
    })
})

// Delete a customer
app.get('/customer/delete/:id', async (request, response) => {
    const customers = await Customer.findByPk(request.params.id);
    customers.destroy();
    response.type("text/html")
    response.redirect("/customers")
})

// order process
// Create a new order
app.get('/order/create', async (request, response) => {
    const customers = await Customer.findAll().then((data) => {
        response.type("text/html")
        response.render("order", { "customers": data })
    })
})







// Error handling
app.use((request, response) => {
    response.type("text/html")
    response.status(404)
    response.send("404 not found")
})
//Server Error
app.use((error, request, response, next) => {
    console.log(error)
    response.type("text/html")
    response.status(500)
    response.send("500 server error")
})


//start the server
app.listen(port, () => {
    console.log(`Express is running on http://localhost:${port};`)
    console.log(` press Ctrl-C to terminate.`)
})
