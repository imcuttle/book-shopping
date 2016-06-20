/**
 * Created by Yc on 2016/6/18.
 */
var express = require('express');
var router = express.Router();
var utils = require('../utils/index');
var booksDB = require('../db/books');
var tradeDB = require('../db/buyrecords');
var cmtsDB = require('../db/comments');

var common = {};

router.use((req,res,next)=>{
    common = {
        title : '交易中心',
        subtitle : '金钱换知识的生意稳准不赔',
        activei : 0,
        req : req
    }
    next();
});
router.use('/books/:bookID',(req,res,next)=>{
    var bookID = req.params.bookID,param={};
    tradeDB.getRecentsByBookID(bookID,10)
        .then(rlt=>{
            common = utils.extend(common,{
                recentTrades:rlt
            });
            next();
        }).catch(err=>{
            res.render('error',{
                title:'发生错误',
                message:'请登录后再购买！',
                error : {},
                req :req
            });
        });
})
router.post('/books/:bookID',(req,res,next)=>{
    var bookID = req.params.bookID,param={},username = req.session.username;
    if(username==null){
        res.render('error',{
            title:'发生错误',
            message:'请登录后再购买或评论！',
            error : {},
            req :req
        });
        return;
    }
    cmtsDB.getAllsByBookID(bookID)
        .then(rlt=>{
            common = utils.extend(common,{comments : rlt});
            if(req.body.action=='buy'){
                postBuyBook(bookID,username,res,req);
            }else if(req.body.action=='comment'){
                postNewComment(username,req.body.content,bookID,res,req);
            }
        })
});
var Timer = require('../utils/timer');
function postNewComment(username,content,bookID,res,req) {
    booksDB.getByBookID(bookID)
        .then(book=>{
            if(book.length===0){
                res.render('error',{
                    title:'发生错误',
                    message:'不存在'+bookID+'图书',
                    error : {},
                    req :req
                });
            }else{
                common['book'] = book[0];
                if(Timer.isExist(username+bookID)){
                    res.render('buybook',utils.extend(common,{msgcode:0,msg:'一小时内不能重复提交评论。'}));
                    return;
                }
                Timer.set(username+bookID,1000*60*60);
                cmtsDB.add(username,bookID,content)
                    .then((rlt)=>{
                        common.comments.unshift({bookID:bookID,username:username,content:content,datetime:new Date().format('yyyy-MM-dd hh:mm')});                res.render('buybook',utils.extend(common,{msgcode:1,msg:'评论成功！'}));
                    }).catch(err=>{
                    console.error(err);
                    res.render('error',{error:err,message:err.message,req:req,title:'发生错误'});
                });
            }
        })
}

function postBuyBook(bookID,username,res,req) {
    tradeDB.newTradeID(tradeID=>{
        booksDB.getByBookID(bookID)
            .then((rlt)=>{
                if(rlt.length===0){
                    res.render('error',{
                        title:'发生错误',
                        message:'不存在'+bookID+'图书',
                        error : {},
                        req :req
                    });
                }else{
                    rlt[0].quantity = parseInt(rlt[0].quantity);
                    if(rlt[0].quantity>0)
                        return booksDB.descOneQuantity(bookID)
                            .then(x=>{
                                return tradeDB.add(tradeID,username,bookID,rlt[0].title,rlt[0].author,rlt[0].press,rlt[0].price,
                                    rlt[0].quantity,rlt[0].image,rlt[0].seller)
                                    .then(x=>{
                                        rlt[0].quantity--;
                                        res.render('buyBook',utils.extend(common,{
                                            msgcode:1,
                                            msg: '你已经成功购买'+bookID+'书籍',
                                            book : rlt[0]
                                        }));
                                    });
                            });
                    else{
                        res.render('buyBook',utils.extend(common,{
                            msgcode:0,
                            msg: bookID+'书籍库存已不足',
                            book : rlt[0]
                        }));
                    }
                }
            }).catch(err=>{
            console.error(err);
            res.render('error',{
                title:'发生错误',
                message:err.message,
                error : err,
                req :req
            });
        });
    });
}
router.get('/books/:bookID',(req,res,next)=>{
    var bookID = req.params.bookID;
    cmtsDB.getAllsByBookID(bookID)
        .then(rlt=>{
            return utils.extend(common,{comments : rlt});
        }).then(common=>{
            booksDB.getByBookID(bookID)
                .then((rlt)=>{
                    if(rlt.length===0){
                        res.render('error',{
                            title:'发生错误',
                            message:'不存在'+bookID+'图书',
                            error : {},
                            req :req
                        });
                    }else{
                        res.render('buyBook',utils.extend(common,{
                            book : rlt[0]
                        }));
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
        })

});

//username cart
router.get('/cart',(req,res,next)=>{
    var username = req.session.username;
    res.render('cart',{

    })
});

module.exports = router;

