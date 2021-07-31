const {Client} = require('pg')
const dbconfig = require('../config/db')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const posgresObj = new Client({connectionString: dbconfig.db.URL})
const dbConfig = require('../config/db')
const {Sequelize, Model, DataTypes} = require("sequelize");
const { Op } = require("sequelize");
const sequelize = new Sequelize(dbConfig.db.URL);
const Messages = require('../models/messages')(sequelize, DataTypes)

module.exports.searchMsg = async function (user_id) {
    const msgs = await Messages.findAll({
        where: {
            [Op.or]: [{sender_id: user_id}, {receiver_id: user_id}]
        },
        order: [
            ['time', 'DESC']
        ],
        limit: 5
    })
    let result = []
    let i = 0
    if (msgs) {
        // console.log(typeof user, JSON.stringify(users, null, 2));
        for (let key in msgs) {
            if (msgs.hasOwnProperty(key)) {
                let msg = msgs[key].dataValues
                let dt = new Date(parseInt(msg.time))
                msg.readable_time = dt.toLocaleString('es-US')
                result[i++] = msg
            }
        }
    }
    return result.reverse();
}
