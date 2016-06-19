/**
 * Created by Yc on 2016/6/16.
 */
var express = require('express');
var router = express.Router();
var utils = require('../utils/index');
var booksDB = require('../db/books');
var tradeDB = require('../db/buyrecords');



router.get('/books/:bookID',(req,res,next)=>{
    var bookID = req.params.bookID;
    booksDB.getImageByID(bookID)
        .then((rlt)=>{
            if(rlt.length===0){
                res.render('error',{
                    title:'发生错误',
                    message:'不存在'+bookID+'图书',
                    error : {},
                    req :req
                });
            }else{
                res.end(rlt[0].image);
            }
        },(err)=>{
            console.error(err);
            res.render('error',{
                title:'发生错误',
                message:err.message,
                error : err,
                req :req
            });
        });
});

router.get('/trades/:tradeID',(req,res,next)=>{
    var tradeID = req.params.tradeID;
    tradeDB.getImageByID(tradeID)
        .then((rlt)=>{
            if(rlt.length===0){
                res.render('error',{
                    title:'发生错误',
                    message:'不存在'+tradeID+'交易',
                    error : {},
                    req :req
                });
            }else{
                res.end(rlt[0].image);
            }
        },(err)=>{
            console.error(err);
            res.render('error',{
                title:'发生错误',
                message:err.message,
                error : err,
                req :req
            });
        });
});

module.exports = router;

