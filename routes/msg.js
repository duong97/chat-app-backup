const express = require('express');
const router = express.Router();
const message = require('../models/msg');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.session.hasOwnProperty('user')){
        res.redirect('/login');
    } else {
        res.render('msg', { title: 'Send message', req: req });
    }
});
router.post('/', function(req, res, next) {
    if(!req.session.hasOwnProperty('user')){
        res.redirect('/login');
    } else {
        console.log('aklsjdfhkaj')
        message.sendMsg(req).then();
        res.render('msg', { title: 'Send message', req: req  });
    }
});

module.exports = router;
