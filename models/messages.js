/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('messages', {
        'id_number': {
            type: DataTypes.INTEGER,
            // allowNull: false,
            autoIncrement: true,
            comment: "null",
            primaryKey: true
        },
        'sender_id': {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "null"
        },
        'receiver_id': {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "null"
        },
        'content': {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "null"
        },
        'time': {
            type: DataTypes.BIGINT,
            allowNull: true,
            comment: "null"
        }
    }, {
        tableName: 'messages',
        createdAt: false,
        updatedAt: false,
    });
};
