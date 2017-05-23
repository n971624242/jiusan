var router = require('koa-router')();
let  Msg = require('../models/MsgModel');
let  Users = require('../models/UserModel');
let sequelize = require('../models/modelhead')();
let  sessionOpt = require('../common/SessionOpt');


router.post('/newmsg', function *(next) {
  let loginbean = yield sessionOpt.getSession(this,'loginbean');
   let nicheng = this.request.body.nicheng;
   //----------查出toid-----------------------------
   let uids = yield sequelize.query('select id from users where nicheng=?',{replacements: [nicheng],type: sequelize.QueryTypes.SELECT});
   if(uids.length==0){
    this.body=-1; //查无此人
    return;
   }
   let toid = uids[0].id;
   //-----------------------------------------------
   let message = this.request.body.message;
   let msg = {};
   msg.sendid = loginbean.id;
   msg.toid = toid;
   msg.message = message;
   msg.sendtime = new Date();
   try{
     let rs = yield Msg.create(msg);
     let rs1 = yield Users.update({msgnum:sequelize.literal('msgnum+1')},{where:{'id':msg.toid}});
     this.body=1;
   }catch(err){
     this.body=0;
   }
});

router.post('/replymsg', function *(next) {
  let loginbean = yield sessionOpt.getSession(this,'loginbean');
	 let rid = this.request.body.rid;
   let message = this.request.body.message;
   let msg = {};
   msg.sendid = loginbean.id;
   msg.toid = rid;
   msg.message = message;
   msg.sendtime = new Date();
   try{
     let rs = yield Msg.create(msg);
     let rs1 = yield Users.update({msgnum:sequelize.literal('msgnum+1')},{where:{'id':msg.toid}});
	   this.body=1;
   }catch(err){
     this.body=0;
   }
});

router.get('/delmsg', function *(next) {
  let loginbean = yield sessionOpt.getSession(this,'loginbean');
   let msgid = this.request.query.id;
   console.log(msgid);
   try{
     yield sequelize.query('delete from msgs where id=? and toid=?',{replacements: [msgid,loginbean.id],type: sequelize.QueryTypes.DELETE});
     //yield Msg.destroy({'where':{'id':{eq:msgid},'toid':{eq:loginbean.id}}});
     let rs = yield sequelize.query('select u.id as sendid,u.nicheng,m.id,m.message,m.sendtime from msgs m,users u where m.toid=? and m.sendid=u.id',{replacements: [loginbean.id],type: sequelize.QueryTypes.SELECT});
     this.body={type:1,rs:rs};
   }catch(err){
     this.body={type:0};
   }
   
});

module.exports = router;
