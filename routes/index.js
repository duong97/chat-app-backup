var express = require('express');
var router = express.Router();
const user = require('../models/usersFunction');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.query.searchUsername) {
        user.findByUsername(req.query.searchUsername, true).then((rows) => {
            res.render('index', {title: 'Express', req: req, searchResult: rows});
        });
    } else {

        // find by normal sql
        // const dbConfig = require('../config/db')
        // const {Client} = require('pg')
        // const client = new Client({connectionString: dbConfig.db.URL})
        // client.connect();
        // let result = client.query("select * from users", (err, res) => {
        //     console.log(typeof res.rows)
        // });

        // find by sequelize auto v2
        // const { Sequelize, Model, DataTypes } = require("sequelize");
        // const sequelize = new Sequelize(dbConfig.db.URL);
        // const User = require('../models/users')(sequelize, DataTypes)
        // User.findAll().then((res) => {
        //     res.every(user => {
        //         console.log(user.dataValues)
        //     })
        // });

        res.render('index', {title: 'Express', req: req, searchResult: {}});
    }
});

module.exports = router;
