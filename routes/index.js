var express = require('express');
var router = express.Router();
const user = require('../models/usersFunction');
const message = require('../models/messagesFunction');

/* GET home page. */
router.get('/', function (req, res, next) {
    let isRender = false;

    if (Object.keys(req.query).length > 0) {
        isRender = true;
        hanleGetRequest(req).then(result => {
            if (result) {
                res.render('index', {title: 'Express', req: req, result: result});
            } else {
                res.redirect('/login')
            }
        });
    }

    if (!isRender) {
        res.render('index', {title: 'Express', req: req, result: {}});
    }
});

async function hanleGetRequest(req) {
    let reqQuery = req.query
    let resultSearch, resultMessage = []
    if (typeof req.session.user == 'undefined') {
        return null;
    }
    if (reqQuery.searchUsername) {
        resultSearch = await user.searchByUsername(reqQuery.searchUsername);
    }

    if (reqQuery.msgTo) {
        resultMessage = await message.searchMsg(reqQuery.msgTo)
    }

    return {resultSearch: resultSearch, resultMessage: resultMessage}
}

module.exports = router;
