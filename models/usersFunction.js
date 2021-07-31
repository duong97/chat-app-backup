const {Client} = require('pg')
const dbconfig = require('../config/db')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const posgresObj = new Client({connectionString: dbconfig.db.URL})
const dbConfig = require('../config/db')
const {Sequelize, Model, DataTypes} = require("sequelize");
const {Op} = require("sequelize");
const sequelize = new Sequelize(dbConfig.db.URL);
const User = require('../models/users')(sequelize, DataTypes)

const secretKey = 'chatapp';
module.exports.secretKey = secretKey
posgresObj.connect();

module.exports.doSignInOrSignUp = async function (req) {
    let password = req.body.password;
    let usernameFormatted = req.body.username.replace(/\s/g, ''); // remove all whitespace
    const objUser = await User.findOne({where: {username: usernameFormatted}}); // find by username

    if (objUser) {
        let userAttr = objUser.dataValues; // object data values
        // validate
        let isValidUser = await authUser(userAttr, password);
        if (isValidUser) {
            // input correct username and password => login OK
            req.session.user = {id: userAttr.id_number, username: userAttr.username, token: userAttr.token};
        }
        return {
            statusCode: isValidUser ? 1 : 0,
            msg: isValidUser ? "Login success" : "Wrong username or password",
            objUser: userAttr
        };
    }
    if (!usernameFormatted) {
        // empty username
        return {
            statusCode: 0,
            msg: "Empty username",
            objUser: {}
        };
    }

    // sign up <=> create new account
    let md5pass = crypto.createHash('md5').update(password).digest("hex"); // encrypt password
    const objUserCreate = await User.create({username: usernameFormatted, password: md5pass}); // create new account
    if (objUserCreate) {
        let userId = objUserCreate.dataValues.id_number;
        req.session.user = { // create session for user
            id: objUserCreate.dataValues.id_number,
            username: objUserCreate.dataValues.username,
            token: objUserCreate.dataValues.token
        };
        let md5Token = jwt.sign({username: usernameFormatted, id: userId}, secretKey) // create token for user by username and user id
        await User.update({token: md5Token}, {where: {id_number: userId}}); // update token back to db
    }
    return {
        statusCode: objUserCreate ? 1 : 0,
        msg: objUserCreate ? "Sign up success" : "Error occur, please try again",
        objUser: objUserCreate ? objUserCreate.dataValues : {}
    }
}
module.exports.setSocketId = async function (user_id, socket_id) {
    await posgresObj.query("update users set socket_id = $1 where id_number = $2", [socket_id, user_id]);
}

async function authUser(userExists, passwordInput) {
    if (userExists) {
        let md5pass = crypto.createHash('md5').update(passwordInput).digest("hex");
        return userExists.password === md5pass;
    }
    return false;
}

module.exports.searchByUsername = async function (username) {
    const users = await User.findAll({where: {
            username: {[Op.like]: '%'+username+'%'}
        }});
    let result = [];
    let i = 0;
    if(users){
        // console.log(typeof users)
        // users.every(user => {console.log(1)})
        // console.log("All users:", JSON.stringify(users, null, 2));
        for(let key in users){
            if(users.hasOwnProperty(key)){
                let user = users[key].dataValues
                result[i++] = {id_number: user.id_number, username: user.username};
            }
        }
    }
    return result;
}