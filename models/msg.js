const {Client} = require('pg')
const dbConfig = require('../config/db')
const client = new Client({connectionString: dbConfig.db.URL})
let crypto = require('crypto');
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize(dbConfig.db.URL);
const Messages = require('../models/messages')(sequelize, DataTypes)
const Users = require('../models/users')(sequelize, DataTypes)

client.connect();

module.exports.sendMsg = async function (req){
    let msgContent = req.body.msgContent;
    let senderId = req.session.user.id_number;
    let receiverId = req.query.to;
    let time = Date.now();
    const results = await client.query("INSERT INTO messages(sender_id, receiver_id, content, time) VALUES($1, $2, $3, $4) RETURNING *", [senderId, receiverId, msgContent, time]);
    return results.rows;
}
module.exports.socketSendMsg = async function (from, to, msgContent){
    await Messages.create({sender_id: from, receiver_id: to, content: msgContent , time: Date.now()});
    const objUser = await Users.findOne({where:{id_number: to}});
    return objUser ? objUser.dataValues.token : '';
}