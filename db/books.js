/**
 * Created by Yc on 2016/6/17.
 */
var connection = require('./base');
// var format = connection.format;
var table = 'books';

function newPromise(excutor) {
    return new Promise(excutor);
};

var sFilter = connection.likeStrFilter;

module.exports = {
    newBookID : function (cb) {
        var self = arguments.callee;
        function create() {
            return 'BK'+(Math.random()*1000000).toFixed(0);
        }
        var id = create();
        connection.query('select * from ?? where bookID=?',[table,id],(err,rlt)=>{
            if(err) console.error(err);
            else
                if(rlt.length!==0) self(cb);
                else cb(id);
        })
    },
    checkByIDName:function (bookID,seller) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where bookID=? and seller=?',[table,bookID,seller],
                (err,rlt)=>{
                    if(err) reject(err);
                    else resolve(rlt);
                })
        })
    },
    checkIsExist : function (bookID) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where bookID=?',[table,bookID],(err,rlt)=>{
                if(err) reject(err);
                else resolve(rlt);
            })
        })
    },
    add : function (bookID,title,author,press,price,quantity,image,seller) {
        var arr = [].slice.call(arguments);
        return newPromise((resolve,reject)=>{
            connection.query('insert into ?? values(?,?,?,?,?,?,?,?,curdate())',[table].concat(arr),(err,rlt)=>{
                if(err) reject(err);
                else resolve(rlt);
            })
        })
    },
    getBySeller :　function (seller) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where seller=? order by importDate desc',[table,seller],(err,rlt)=>{
                if(err) reject(err);
                else{
                    rlt.forEach((x,i)=>{
                        x.importDate = x.importDate.format('yyyy/MM/dd');
                        // x.image = x.image.toString('base64');
                    });
                    resolve(rlt);
                }
            })
        })
    },
    getImageByID : function (bookID) {
        return newPromise((resolve,reject)=>{
            connection.query('select image from ?? where bookID=?',[table,bookID],(err,rlt)=>{
                if(err) reject(err);
                else{
                    resolve(rlt);
                }
            })
        });
    },
    getByBookID : function (bookID) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where bookID=?',[table,bookID],(err,rlt)=>{
                if(err) reject(err);
                else{
                    rlt.forEach((x,i)=>{
                        x.importDate = x.importDate.format('yyyy/MM/dd');
                        // delete x.image;
                    });
                    resolve(rlt);
                }
            })
        });
    },
    descOneQuantity : function (bookID) {
        return newPromise((resolve,reject)=>{
            connection.query('update ?? set quantity=quantity-1 where bookID = ?',
                [table,bookID],(err,rlt)=>{
                    if(err) reject(err);
                    else
                        resolve(rlt.affectedRows>0);
                })
        });
    },
    updateByIDName : function (title,author,press,price,quantity,image,bookID,username) {
        return newPromise((resolve,reject)=>{
            connection.query('update ?? set title=?,author=?,press=?,price=?,quantity=?,image=? where bookID=? and seller=?',
                [table].concat([].slice.call(arguments)),(err,rlt)=>{
                if(err) reject(err);
                else{
                    resolve(rlt);
                }
            })
        });
    },
    getRecentsByName : function (username,n) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where seller=? ORDER BY importDate DESC Limit ?',
                [table].concat([].slice.call(arguments)),(err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach((x,i)=>{
                            x.importDate = x.importDate.format('yyyy/MM/dd');
                            delete x.image;
                        });
                        rlt.tag = 'recentBooks';
                        resolve(rlt);
                    }
                })
        });
    },
    randomOthers : function (n,selfname) {
        return newPromise((resolve,reject)=>{
            var sql = '',arr;
            if(!!selfname){
                sql = 'select * from ?? where seller!=? order by rand() limit ?';
                arr = [selfname,n];
            }else{
                sql = 'select * from ?? order by rand() limit ?';
                arr = [n];
            }
            connection.query(sql, [table].concat(arr),(err,rlt)=>{
                if(err) reject(err);
                else{
                    rlt.forEach((x,i)=>{
                        x.importDate = x.importDate.format('yyyy/MM/dd');
                        delete x.image;
                    });
                    resolve(rlt);
                }
            });
        });
    },
    getOthersRecent : function (selfname,n) {
        return newPromise((resolve,reject)=>{
            var sql = '',arr;
            if(!!selfname){
                sql = 'select * from ?? where seller!=? order by importDate desc limit ?';
                arr = [].slice.call(arguments)
            }else{
                sql = 'select * from ?? order by importDate desc limit ?';
                arr = [n];
            }
            connection.query(sql, [table].concat(arr),(err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach((x,i)=>{
                            x.importDate = x.importDate.format('yyyy-MM-dd');
                            delete x.image;
                        });
                        rlt.tag = 'otherRecentBooks';
                        resolve(rlt);
                    }
                });
        });
    },
    getByLikeBookID : function (likeID) {
        return newPromise((resolve,reject)=>{
            connection.query("select * from ?? where bookID like ? escape '*'",[table,sFilter(likeID)],
                (err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach(x=>{
                            x.importDate = x.importDate.format('yyyy-MM-dd');
                            delete x.image;
                        })
                        resolve(rlt);
                    }
                })
        })
    },
    getByLikeTitle : function (liketitle) {
        return newPromise((resolve,reject)=>{
            connection.query("select * from ?? where title like ? escape '*'",[table,sFilter(liketitle)],
                (err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach(x=>{
                            x.importDate = x.importDate.format('yyyy-MM-dd');
                            delete x.image;
                        })
                        resolve(rlt);
                    }
                })
        })
    },
    getByLikeAuthor : function (likeauthor) {
        return newPromise((resolve,reject)=>{
            connection.query("select * from ?? where author like ? escape '*'",[table,sFilter(likeauthor)],
                (err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach(x=>{
                            x.importDate = x.importDate.format('yyyy-MM-dd');
                            delete x.image;
                        })
                        resolve(rlt);
                    }
                })
        })
    },
    getByLikePress : function (likepress) {
        return newPromise((resolve,reject)=>{
            connection.query("select * from ?? where press like %?% escape '*'",[table,sFilter(likepress)],
                (err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach(x=>{
                            x.importDate = x.importDate.format('yyyy-MM-dd');
                            delete x.image;
                        })
                        resolve(rlt);
                    }
                })
        })
    },

}