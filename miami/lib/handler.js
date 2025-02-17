let eList = require("../data/emails.json")

const fs = require("fs")

exports.newsletterSignup = (req, res) => {
    res.render('newsletter-signup', { csrf: 'supersecret' })
}

exports.newsletterSignupProcess = (req, res) => {
    console.log(req.body)
    var newUser = {
        'firstname': req.body.firstname,
        'lastname': req.body.lastname,
        'address': req.body.address,
        'city': req.body.city,
        'state': req.body.state,
        'zip': req.body.zip,
        'email': req.body.email
    }

    //the push method adds items to an array
    eList.users.push(newUser)
    var json = JSON.stringify(eList)
    console.log(json)
    fs.writeFileSync('./data/emails.json', json, 'utf8')
    res.redirect(303, '/newsletter/thankyou')
}

exports.newsletterSignupList = (req, res) => {
    console.log(eList)
    res.render('userspage', { "users": eList.users })
}

exports.newsletterUser = (req, res) => {
    console.log(eList)
    var userDetails = eList.users.filter((user) => {
        return user.email == req.params.email
    })

    console.log(userDetails)
    res.render('userdetails', { "users": userDetails })
}

exports.newsletterUserDelete = (req, res) => {
    let newList = {}
    newList.users = eList.users.filter((user) => {
        return user.email != req.params.email
    })

    console.log("deleting: " + req.params.email)
    var json = JSON.stringify(newList)
    console.log(json)
    fs.writeFile('./data/emails.json', json, 'utf8', () => { })
    res.send('<a href="/newsletter/list">Go Back</a>')
}