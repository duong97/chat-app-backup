const {Client} = require('pg')
const dbConfig = require('../config/db')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const client = new Client({connectionString: dbConfig.db.URL})
const {Sequelize, Model, DataTypes} = require("sequelize");
const {Op} = require("sequelize");
const sequelize = new Sequelize(dbConfig.db.URL);
const Messages = require('../models/messages')(sequelize, DataTypes)
const Users = require('../models/users')(sequelize, DataTypes)

client.connect();

module.exports.searchMsg = async function (from, to) {
    let fromOnlyNumber = typeof from == "number" ? from : from.replace(/^\D+/g, '')
    let toOnlyNumber = typeof to == "number" ? to : to.replace(/^\D+/g, '')
    // get info sender and receiver
    const listUsers = await Users.findAll({
        where: {
            id_number: {
                [Op.in]: [from, to]
            }
        }
    });
    let rawObjSender = {}, rawObjReceiver = {}
    if(listUsers){
        listUsers.forEach(itemUser => {
            if(itemUser.dataValues.id_number==from){
                rawObjSender = itemUser
            } else if (itemUser.dataValues.id_number==to){
                rawObjReceiver = itemUser
            }
        })
    }
    const msgs = await Messages.findAll({
        where: {
            sender_id: {
                [Op.in]: [fromOnlyNumber, toOnlyNumber]
            },
            receiver_id: {
                [Op.in]: [fromOnlyNumber, toOnlyNumber]
            }
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
        msgs.forEach(itemMsg => {
            let userSend = itemMsg.sender_id==from ? rawObjSender : rawObjReceiver
            result[i++] = formatObjMessageForDisplay(itemMsg, userSend)
        })
    }
    return result.reverse();
}

module.exports.socketSendMsg = async function (from, to, msgContent) {
    let result = {objMsg: {}, receiverToken: '###', senderId: from} // if token is empty string, it's equal to token when not login
    const objMsg = await Messages.create({sender_id: from, receiver_id: to, content: msgContent, time: Date.now()})
    const listUsers = await Users.findAll({
        where: {
            id_number: {
                [Op.in]: [from, to]
            }
        }
    });
    let rawObjSender = {}, rawObjReceiver = {}
    if(listUsers){
        listUsers.forEach(itemUser => {
            if(itemUser.dataValues.id_number==from){
                rawObjSender = itemUser
            } else if (itemUser.dataValues.id_number==to){
                rawObjReceiver = itemUser
                result.receiverToken = itemUser.dataValues.token
            }
        })
    }
    if (objMsg) {
        result.objMsg = formatObjMessageForDisplay(objMsg, rawObjSender)
    }
    return result;
}

// rawObjMsg is object return by findOne function
// format data for display in chat box
function formatObjMessageForDisplay(rawObjMsg, rawObjSender = '') {
    if(!rawObjMsg){
        return {};
    }
    let result = rawObjMsg.dataValues
    let dt = new Date(parseInt(result.time))
    result.readable_time = dt.toLocaleString('es-US')
    result.sender_display_name = rawObjSender ? rawObjSender.dataValues.username : ''
    return result
}