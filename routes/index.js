var router = require('koa-router')();
router.get('/', function *(next) {
	//console.log(this.session.loginbean);
	this.res.header("Access-Control-Allow-Origin", "*");
    this.res.header("Access-Control-Allow-Headers", "X-Requested-With");
    this.res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    this.res.header("X-Powered-By",' 3.2.1')
    this.res.header("Content-Type", "application/json;charset=utf-8");
	 this.body='koa1';
  // yield this.render('index', {
  //   title: 'Hello World Koa1!'
  // });
});

module.exports = router;
