var express = require('express');
var router = express.Router();
var utils = require('../utils/index');
var booksDb = require('../db/books');
var tradeDB = require('../db/buyrecords');
var cmtDB = require('../db/comments');

function makeJsonStr(code,message) {
    return JSON.stringify({code:code,message:message});
}

router.use('/delete',(req,res,next)=>{
    if(req.session.username==null) {
        res.end(makeJsonStr(500, '未登录'));
        return;
    }
    next()
});

router.all('/delete/:what',(req,res,next)=>{
    var param = req.method=='GET'?req.query:req.body;
    new Promise((resolve,reject)=>{
        switch (req.params.what){
            case 'comments':{
                resolve(cmtDB.delete(param.username,param.bookID,param.datetime));
            }
        }
    }).then(p=>{
        if(p!=false){
            res.end(makeJsonStr(200,'删除成功！'));
        }else
            res.end(makeJsonStr(500,'删除失败'));
    }).catch(err=>{
        console.error(err);
        res.end(makeJsonStr(500,err.message));
    })
});


module.exports = router;
