/**
 * Created by Yc on 2016/6/16.
 */
var express = require('express');
var router = express.Router();
var utils = require('../utils/index');
var db = require('../db/users');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login',{
        title:'登录界面',
        subtitle:'欢迎登录',
        req : req,
        param : req.query,
    })
});

router.post('/',(req,res,next)=>{
    var json = generateMsg(req.body);
    json = utils.extend({
        title:'登录界面',
        subtitle:'欢迎登录',
        param : req.body,
        req : req,
    },json);
    if(json.code===1){
        if(json.type==='email')
            db.checkIsExistByEmail(req.body.user,(err,rows,fields)=>{
                if(err){console.error(err);}
                else
                    if(rows.length===0) {
                        json.code=0;json.msgx='电子邮箱与密码不匹配';
                        res.render('login',json);
                    }else loginOkHandle(res,req,rows[0].username);
            });
        else{
            db.checkIsExistByUsername(req.body.user,(err,rows,fields)=>{
                if(err){console.error(err);}
                else
                    if(rows.length===0){
                        db.checkIsExistByEmail(req.body.user,(err,rows,fields)=>{
                            if(err) console.error(err);
                            else
                                if(rows.length===0) {
                                    json.code = 0;
                                    json.msgx = '账户与密码不匹配';
                                    res.render('login', json);
                                }else loginOkHandle(res,req,rows[0].username);
                        });
                    }else loginOkHandle(res,req,rows[0].username);
            });
        }
    }else res.render('login',json);
});

module.exports = router;

function loginOkHandle(res,req,username) {
    req.session.username = username;
    var url = req.session.view?req.session.view:'/';
    res.redirect(url);
}

function generateMsg(query) {
    var s = '',
        type,
        code = 1;
    query.user=query.user.trim();
    query.password=query.password.trim();

    if(query.password.length<6 || query.password.length>12)
        s+='密码应在6-12位\n';
    if(query.user.length>12)
        type='email';

    if(s!=='')
        code = 0;
    return {msgx:s,code:code,type:type};
}