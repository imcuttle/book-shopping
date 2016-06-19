/**
 * Created by Yc on 2016/6/16.
 */
var express = require('express');
var router = express.Router();
var utils = require('../utils/index');
var db = require('../db/users');

/* GET users listing. */
router.post('/', function(req, res, next) {
    var json = generateMsg(req.body);
    json = utils.extend({
        title:'注册界面',
        subtitle:'欢迎注册',
        req : req,
        param : req.body,
    },json);
    if(json.code===1)
        db.add(req.body,(err,rlt)=>{
            if(err){ json.code=0; json.msgx=req.body.username+'或者'+req.body.email+'已经存在' }
            res.render('register', json);
        });
    else res.render('register', json);
});
router.get('/',function (req,res,next) {
    res.render('register', {
        title:'注册界面',
        subtitle:'欢迎注册',
        req : req,
        param : req.query,
    })
});
module.exports = router;

function generateMsg(query) {
    var s = '',
        code = 1;
    query.email=query.email.trim();
    query.username=query.username.trim();
    query.password=query.password.trim();
    query.password2=query.password2.trim();

    if(query.username.length<6 || query.username.length>12)
        s+='用户名应在6-12位\n';

    if(!/^\w+@\w+\.\w+$/.test(query.email))
        s+='电子邮箱不符合格式要求\n';
    else if(query.email.length>20)
        s+='电子邮箱不符合格式要求\n';

    if(query.password!==query.password2)
        s+='两次密码输入不一致';
    //yanzm
    if(s!=='')
        code = 0;
    else
        s = query.username+'成功注册！';
    return {msgx:s,code:code};
}