var express = require('express');
var router = express.Router();
var utils = require('../utils/index');
var db = require('../db/users');
var cmtsDB = require('../db/comments');

var common = {};

router.use((req,res,next)=>{
  common = {
    title : '用户中心',
    subtitle : '所有的用户信息都在这里',
    req : req
  };
  next();
})

function handle(username,req,res){
  db.getByName(username)
      .then((rlt)=>{
        if(rlt.length == 0){
          return utils.extend(common, {
            code : 0,
            msgx : '未找到用户'+username,
            name : username,
          })
        }
        common = utils.extend(common, {
              code : 1,
              msgx : '找到用户'+username,
              name : username,
              user : rlt[0]
          });
        if(req.session.username!=null && req.session.username==username){
            return cmtsDB.getSpAllsByUserName(username)
                .then(rlt=>{
                   return utils.extend(common,{comments:rlt});
                })
        }else
            return common;
      }).then(data=>{
        res.render('user',data);
      }).catch(err=>{
        res.render('error',{
          error : err,message:err.message,title:'发生错误',req:req
        })
      });
}

router.get('/', function(req, res, next) {
  handle(req.session.username,req,res);
});

router.get('/:username', function(req, res, next) {
  handle(req.params.username,req,res);
});

module.exports = router;
