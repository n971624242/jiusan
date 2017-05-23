var Sequelize = require('sequelize');
// var sequelize = new Sequelize('kameng', 'root', 'root', {
//     host: '127.0.0.1',
//     dialect: 'mysql'
// });
let sequelize = require('./modelhead')();

var Seller = sequelize.define('seller', {
	id: {type:Sequelize.BIGINT,primaryKey: true},
	uid:Sequelize.BIGINT,
	shopname: Sequelize.STRING,
	licenseid: Sequelize.STRING,
	licensephoto: Sequelize.STRING,
	idnumber: Sequelize.STRING,
	idphoto: Sequelize.STRING,
	shoptype: Sequelize.INTEGER,
	description: Sequelize.STRING,
	status: Sequelize.INTEGER,
	createtime: Sequelize.DATE,
	updtime:Sequelize.DATE
	},{
		timestamps: false,
		//paranoid: true  //获取不到id的返回值
	});

module.exports = Seller;