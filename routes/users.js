var router = require('koa-router')();
let  Users = require('../models/UserModel');
let  Seller = require('../models/SellerModel');
let  sessionOpt = require('../common/SessionOpt');
let formidable = require('formidable');


router.get('/', function *(next) {
  this.body = '我是koa1';
});


router.post('/login', function *(next) {
  let email = this.request.body.email;
  let pwd = this.request.body.pwd;

  let rs = yield Users.findOne({where:{'email':email,'pwd':pwd}});
  if(rs){
    let loginbean = {};
    loginbean.id = rs.id;
    loginbean.nicheng = rs.nicheng;
    loginbean.role = rs.role;
    loginbean.msgNum = rs.msgnum;
    //this.session.loginbean = loginbean;
    yield sessionOpt.setSession(this,'loginbean',loginbean);

    this.body = {type:1,loginbean:loginbean};
  }else{
    this.body = {type:0};
  }
  
  
  
});

router.post('/zhuce', function *(next) {
  //let email = this.request.body.email;
  this.request.body['role']=1;
  this.request.body['updtime']=new Date();
  try{
    let rs = yield Users.create(this.request.body);
    this.body = {type:1};
  }catch(err){
    if(err.fields.emailuniq){
      this.body = {type:0,msg:'email重复'};
    }else if(err.fields.nichenguniq){
      this.body = {type:0,msg:'昵称重复'};
    }else{
      this.body = {type:0,msg:'数据库错误'};
    }
  }
  
});

router.get('/getLoginBean', function *(next) {
  let loginbean = yield sessionOpt.getSession(this,'loginbean');
  if(!loginbean){
    loginbean={id:0,nicheng:'',role:-1};
  } 
  this.body=loginbean;
})

router.get('/logout', function *(next) {
  yield sessionOpt.logout(this,'loginbean'); 
  this.body={id:0,nicheng:null,role:-1};
})

router.post('/applySeller', function *(next) {
  let loginbean = yield sessionOpt.getSession(this,'loginbean');
  //this.locals.loginbean = loginbean;
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = './public/images/applyseller/';     //设置上传目录 文件会自动保存在这里
  form.keepExtensions = true;     //保留后缀
  form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M
  let thisa = this;
  let rs = yield new Promise(function(resolve,reject){
      form.parse(thisa.req, function (err, fields, files) {
          if(err){
              console.log(err);
          }
          fields.uid = loginbean.id;
          fields.licensephoto = (files.licensephoto.path).replace('public\\','');
          console.log(fields.licensephoto);
          fields.idphoto = (files.idphoto.path).replace('public\\','');
          console.log(fields.idphoto);
          // try{
            Seller.create(fields).then(function(msg){
                // console.log(msg);
                resolve(1);
            }).catch(function(err){
              console.log('#------------------------------#');
                // console.log(err);
                console.log(err.fields);
              console.log('#------------------------------#');
                resolve(0);
            })
          // }catch(err){
          //   console.log('再次捕获');
          //   console.log(err);
          //       reject(0);
          // }
      })
   })
  console.log('aaaaaaaaaaaaaa');
   this.body=rs;
  
})

module.exports = router;
