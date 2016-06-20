var express = require('express');
var router = express.Router();
var utils = require('../utils/index');
var booksDb = require('../db/books');
var tradeDB = require('../db/buyrecords');

var common = {};
var recentNum = 3,
    otherNum = recentNum<<2;

router.use((req,res,next)=>{
  common = {
    title: '书窝',
    subtitle: '欢迎来到书窝',
    activei : 0, req:req,
  }
  next();
});
router.post('/api/:action',(req,res,next)=>{
  var username = req.session.username,
      action = req.params.action;
    switch (action){
      case 'randOthers' : {
        booksDb.randomOthers(otherNum,username)
            .then(rlt=>{
              res.end(JSON.stringify({code:200,data:rlt}));
            }).catch(err=>{
          console.error(err);
          res.end(JSON.stringify({code:500,message:err.message}));
        });
        break;
      }
      default: res.end(JSON.parse({code:500,message:'错误的指令：'+action}));
    }

});
router.get('/', function(req, res, next) {
  var username = req.session.username;
  //recent books
  if(typeof username==='undefined'){
    booksDb.getOthersRecent(false,otherNum)
        .then(rlt=>{
          var data = {},tag = rlt.tag;
          delete rlt.tag;
          data[tag] = rlt;
          res.render('index',utils.extend(common,data));
        }).catch(err=>{
          console.error(err);
          res.render('error', {error:err,message:err.message,title:'发生错误',req:req});
        });
      return;
  }
  Promise
      .all([booksDb.getRecentsByName(username,recentNum),
        tradeDB.getRecentsByByuer(username,recentNum),booksDb.getOthersRecent(username,otherNum)])
      .then((rlts)=>{
        var data = {};
        rlts.forEach((x,i)=>{
          var tag = x.tag;
          delete x.tag;
          data[tag]=x;
        });
        data = utils.extend(common,data);
        res.render('index',data);
      }).catch(err=>{
        console.error(err);
        res.render('error',{
          error : err, message: err.message,title:'发生错误',req:req
        })
      });

});

module.exports = router;
