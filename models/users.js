/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('users', {
        'id_number': {
            type: DataTypes.INTEGER,
            // allowNull: false,
            autoIncrement: true,
            comment: "null",
            primaryKey: true
        },
        'username': {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "null"
        },
        'password': {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "null"
        },
        'socket_id': {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "null"
        },
        'token': {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "null"
        }
    }, {
        tableName: 'users',
        createdAt: false,
        updatedAt: false,
    });
};
