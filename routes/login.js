const express = require('express')
const router = express.Router()
const userFunc = require('../models/usersFunction')
const title = 'Sign in or Sign up'
let data = {
    msg: '',
    username: '',
    password: ''
}

// view login form (not submit)
router.get('/', function(req, res, next) {
    res.render('login', { title: title, data: data})
})

// submit form login
router.post('/', function(req, res, next) {
    if(req.body.username){
        // input username
        userFunc.doSignInOrSignUp(req).then((resLogin) => {
            if(resLogin.statusCode){
                // login success
                res.redirect('/')
            } else {
                // login fail
                data.msg = resLogin.msg
                data.username = req.body.username
                data.password = req.body.password
                res.render('login', { title: title, data: data})
            }
        })
    } else {
        // empty username
        data.msg = 'Empty username'
        data.username = req.body.username
        data.password = req.body.password
        res.render('login', { title: title , data: data});
    }
})

module.exports = router
