   var Sequelize = require('sequelize');
// var sequelize = new Sequelize('kameng', 'root', 'root', {
//     host: '127.0.0.1',
//     dialect: 'mysql'
// });
let sequelize = require('./modelhead')();

var Msgs = sequelize.define('msgs', {
	id: {type:Sequelize.BIGINT,primaryKey: true},
	//uid:{type:Sequelize.BIGINT,primaryKey: true},
    sendid:Sequelize.BIGINT,
    toid:Sequelize.BIGINT,
    message:Sequelize.STRING,
    sendtime:Sequelize.DATE
	},{
		timestamps: false,
		//paranoid: true  //获取不到id的返回值
	});

module.exports = Msgs;
