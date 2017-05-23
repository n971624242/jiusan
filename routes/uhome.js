var router = require('koa-router')();
let  Msg = require('../models/MsgModel');
let  sessionOpt = require('../common/SessionOpt');
let sequelize = require('../models/modelhead')();

router.get('/', function *(next) {
	let loginbean = yield sessionOpt.getSession(this,'loginbean');
  if(loginbean){
      let page = 1;
      if(this.request.query.page){
      	page = parseInt(this.request.query.page);
      }
      if(page<1){
      	page=1;
      }
      let countRs = yield sequelize.query('select count(*) as sum from msgs where toid=?',{replacements: [loginbean.id],type: sequelize.QueryTypes.SELECT});
      let count = countRs[0].sum;
      let pageLimit = 2;
      let countPage = Math.ceil(count/pageLimit);
      if(countPage>0&&page>countPage){
      	page=countPage;
      }
      let point = (page-1)*pageLimit;
      let rs = yield sequelize.query('select u.id as sendid,u.nicheng,m.id,m.message,m.sendtime from msgs m,users u where m.toid=? and m.sendid=u.id limit ?,?',{replacements: [loginbean.id,point,pageLimit],type: sequelize.QueryTypes.SELECT});
      
      yield sequelize.query('update users set msgnum=0 where id=?',{replacements: [loginbean.id],type: sequelize.QueryTypes.UPDATE});

      this.body = {count:count,page:page,countPage:countPage,msgRs:rs};
      return;
  }
  this.body='访问非法';
});

module.exports = router;