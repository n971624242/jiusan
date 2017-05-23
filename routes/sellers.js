var router = require('koa-router')();
let  Users = require('../models/UserModel');
let  Seller = require('../models/SellerModel');
let  Msg = require('../models/MsgModel');
let  sessionOpt = require('../common/SessionOpt');
let sequelize = require('../models/modelhead')();


router.get('/sellerApplyList', function *(next) {
  let loginbean = yield sessionOpt.getSession(this,'loginbean');
  if(loginbean){
  	if(loginbean.role==0){
  		//let rs = yield Seller.find({where:{'status':0},include:{model:Users,as:'uid'}});
  		let rs = yield sequelize.query('SELECT s.id,u.id as uid,u.nicheng,s.shopname,s.licenseid,s.licensephoto,s.idnumber,s.idphoto,s.description,s.shoptype,s.updtime from users u,sellers s where s.uid=u.id and s.status=0');
  		this.body = rs;
  		return;
  	}
  }
  this.body='访问非法';
});

router.get('/acceptApply', function *(next) {
  let loginbean = yield sessionOpt.getSession(this,'loginbean');
  if(loginbean){
    if(loginbean.role==0){
      let id = this.request.query['id'];
      let uid = this.request.query['uid'];
      //try{
        yield sequelize.query('update sellers set status=1 where id=?',{replacements: [parseInt(id)],type: sequelize.QueryTypes.UPDATE});
        //------插入消息---
        let msg = {};
        msg.sendid = loginbean.id;
        msg.toid = uid;
        msg.message = '您的商户申请已经审核通过,请进入空间定位您的商铺';
        msg.sendtime = new Date();
        // let rs = yield Msg.create(msg);
        // //-----给users表中msgnum+1---update users set msgnum=msgnum+1 where id=?-------
        // yield Users.update({msgnum:sequelize.literal('`msgnum`+1')},{where:{'id':uid}});
        let ers = yield new Promise(function(resolve,reject){
          sequelize.transaction().then(function (t) {
            return Msg.create(msg, {transaction: t}).then(function (data) {
              console.log('---------');
              console.log(data);
              return Users.update({msgnum:sequelize.literal('msgnum+1')},{where:{'id':uid}},{transaction: t});
            }).then(function(data){
              t.commit();
              console.log('成功-------------------');
              resolve(1);
            }).catch(function(err){
              t.rollback.bind();
              resolve(0);
            });
          })
        })
      // }catch(err){
      //   console.log(err);
      //   this.body = 0;
      //   return;
      // }
      this.body = ers;
      return;
    }
  }
  this.body='访问非法';
});

router.get('/rejectApply', function *(next) {
  let loginbean = yield sessionOpt.getSession(this,'loginbean');
  if(loginbean){
    if(loginbean.role==0){
      let id = this.request.query['id'];
      try{
        yield sequelize.query('update sellers set status=-1 where id=?',{replacements: [parseInt(id)],type: sequelize.QueryTypes.UPDATE});
        //-------------插入消息------------

        //------------修改users表中的msgnum+1------------
      }catch(err){
        this.body = 0;
        return;
      }
      this.body = 1;
      return;
    }
  }
  this.body='访问非法';
});

module.exports = router;