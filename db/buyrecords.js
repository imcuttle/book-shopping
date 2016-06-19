/**
 * Created by Yc on 2016/6/18.
 */
var connection = require('./base');
var booksDB = require('./books');

var table = 'buyrecords';

function newPromise(excutor) {
    return new Promise(excutor);
};
/*
 tradeID
 tradeDate
 buyer
 bookID
 title
 author
 press
 price
 quantity
 image
 seller
 */

module.exports = {
    newTradeID : function (cb) {
        var self = arguments.callee;
        function create() {
            return 'BK'+(Math.random()*100000000).toFixed(0);
        }
        var id = create();
        connection.query('select * from ?? where bookID=?',[table,id],(err,rlt)=>{
            if(err) console.error(err);
            else
            if(rlt.length!==0) self(cb);
            else cb(id);
        })
    },
    add : function (tradeID,buyer,bookID,title,author,press,price,quantity,image,seller) {
        var arr = [].slice.call(arguments);
        return booksDB.checkIsExist(bookID)
            .then(rlt=>{
                if(rlt.length!==0)
                    return newPromise((resolve,reject)=>{
                        connection.query('insert into ?? values(?,CURDATE(),?,?,?,?,?,?,?,?,?)',[table].concat(arr),(err,rlt)=>{
                            if(err) reject(err);
                            else resolve(rlt.affectedRows>0);
                        })
                    });
            })
    },
    getImageByID : function (bookID) {
        return newPromise((resolve,reject)=>{
            connection.query('select image from ?? where tradeID=?',[table,bookID],(err,rlt)=>{
                if(err) reject(err);
                else{
                    resolve(rlt);
                }
            })
        });
    },
    getRecentsByBookID : function (bookID,n) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where bookID=? ORDER BY tradeDate DESC Limit ?',
                [table].concat([].slice.call(arguments)),(err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach((x,i)=>{
                            x.tradeDate = x.tradeDate.format('yyyy-MM-dd');
                            delete x.image;
                        });
                        resolve(rlt);
                    }
                })
        });
    },
    getRecentsByByuer : function (buyer,n) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where buyer=? ORDER BY tradeDate DESC Limit ?',
                [table].concat([].slice.call(arguments)),(err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach((x,i)=>{
                            x.tradeDate = x.tradeDate.format('yyyy-MM-dd');
                            delete x.image;
                        });
                        rlt.tag = 'recentTrades';
                        resolve(rlt);
                    }
                })
        });
    },
    getRecentsBySeller : function (seller,n) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where seller=? ORDER BY tradeDate DESC Limit ?',
                [table].concat([].slice.call(arguments)),(err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach((x,i)=>{
                            x.tradeDate = x.tradeDate.format('yyyy-MM-dd');
                            delete x.image;
                        });
                        resolve(rlt);
                    }
                })
        });
    },
    getAllBySeller : function (seller) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where seller=? ORDER BY tradeDate DESC',
                [table].concat([].slice.call(arguments)),(err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach((x,i)=>{
                            x.tradeDate = x.tradeDate.format('yyyy-MM-dd');
                            delete x.image;
                        });
                        resolve(rlt);
                    }
                })
        });
    }
};
