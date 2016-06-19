/**
 * Created by Yc on 2016/6/16.
 */
var express = require('express');
var router = express.Router();
var utils = require('../utils/index');
var usersDB = require('../db/users');
var booksDB = require('../db/books');

var common = {};
router.use(function(req, res, next) {
    common = {
        title:'搜一下',
        subtitle:'据说什么都能搜',
        req : req,
    }
    next();
});

router.get('/',(req,res,next)=>{
    var param = req.query;
    param = utils.extend({for:'users',typeusers:'username',typebooks:'title',content:''},param);
    param.content = param.content.trim();
    common.param = param;
    new Promise((resolve,reject)=>{
        if(param.for==='users'){
            if(param.typeusers=='email')
                resolve(usersDB.getByLikeEmail)
            else if(param.typeusers=='username')
                resolve(usersDB.getByLikeName)
            else
                resolve();
        }else if(param.for==='books'){
            switch(param.typebooks){
                case 'bookID':{
                    resolve(booksDB.getByBookID)
                    break;
                }
                case 'title':{
                    resolve(booksDB.getByLikeTitle)
                    break;
                }
                case 'author':{
                    resolve(booksDB.getByLikeAuthor)
                    break;
                }
                case 'press':{
                    resolve(booksDB.getByLikePress)
                    break;
                }
                default:resolve();
            }
        }
    }).then(rlt=>{
        if(rlt==null){
            res.render('error',{
                error:{},title:'发生错误',message:'搜索参数有错',req:req
            })
        }else {
            return rlt(param.content)
                .then(data=>{
                    data = param.for=='users'?{users:data}:{books:data};
                    res.render('search',utils.extend(common, data));
                })
        }
    }).catch(err=>{
        console.error(err);
        res.render('error',{
            error:err,title:'发生错误',message:err.message,req:req
        })
    });

});

module.exports = router;
