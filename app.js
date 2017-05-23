var app = require('koa')()
  , koa = require('koa-router')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror');
var cors = require('koa-cors');
var session = require('koa-generic-session');
const mysql = require('mysql');
const MysqlStore = require('koa-mysql-session');

var index = require('./routes/index');
var users = require('./routes/users');

app.keys = ['my secret key'];  // needed for cookie-signing,设置一个签名 Cookie 的密钥
app.use(session({store:new MysqlStore({
  host: 'localhost',       //主机  
  user: 'root',               //MySQL认证用户名  
  password: 'root',        //MySQL认证用户密码  
  database: 'kameng',  
  port: '3306',                   //端口号 
  acquireTimeout:0
})}));
// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'ejs'
}));
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());


app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

app.use(cors());

// routes definition
koa.use('/', index.routes(), index.allowedMethods());
koa.use('/users', users.routes(), users.allowedMethods());



// mount root routes  
app.use(koa.routes());

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});

module.exports = app;
