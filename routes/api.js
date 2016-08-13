var express = require('express');
var router = express.Router();
var utils = require('../utils/index');
var booksDb = require('../db/books');
var tradeDB = require('../db/buyrecords');
var cmtDB = require('../db/comments');
var fs = require('fs');

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

const imagePath = require('path').resolve(__dirname, '../public/messImages')

router.post('/upload/image', (req, res, next) => {
    let body = req.body
    let filename = Date.now()
    let json = utils.decodeBase64Image(body.base64)
    if(!json) res.end(makeJsonStr(500, 'error base64'));
    else {
        fs.writeFile(`${imagePath}/${filename}.${json.type}`, json.data, function (err) {
            if(err){
                console.error(err);
                res.end(makeJsonStr(500, err.message))
            }else {
                res.end(makeJsonStr(200, `/messImages/${filename}.${json.type}`))
            }
        })
    }
})

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
