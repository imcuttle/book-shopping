/**
 * Created by Yc on 2016/6/17.
 */
var express = require('express');
var router = express.Router();
var utils = require('../utils/index');
var db = require('../db/messages');

var Num = 30;
var common = {};

router.use((req,res,next)=>{
    common = {
        title : '留言板',
        subtitle : '欢迎您的留言',
        activei : 2,
        req : req
    };
    next();
});

router.get('/',(req,res,next)=>{
    db.getRecents(Num)
        .then(rlt=>{
            res.render('message',utils.extend(common,{
                msgs : rlt
            }));
        }).catch(err=>{
            console.error(err);
            res.render('error',{error:err,message:err.message,req:req,title:'发生错误'});
        })

});

router.post('/',(req,res,next)=>{
    db.getRecents(Num)
        .then(rlt=>{
            return utils.extend(common,{msgs : rlt});
        }).then(common=>{
            var username = req.session.username,
                msg = req.body.msg;
            if(username==null){
                res.render('message',utils.extend(common,{msgcode:0,msg:'登录后才能提交提交留言。<a href="/login">点击登录</a>'}));
                return;
            }
            if(Timer.isExist(username)){
                res.render('message',utils.extend(common,{msgcode:0,msg:'一小时内不能重复提交留言。'}));
                return;
            }
            Timer.set(username,1000*60*60);
            db.add(username,msg)
                .then((rlt)=>{
                    common.msgs.unshift({username:username,content:msg,datetime:new Date().format('yyyy-MM-dd hh:mm')});
                    res.render('message',utils.extend(common,{msgcode:1,msg:'留言成功！'}));
                }).catch(err=>{
                    console.error(err);
                    res.render('error',{error:err,message:err.message,req:req,title:'发生错误'});
                });
        })

});

var Timer = require('../utils/timer');


module.exports = router;