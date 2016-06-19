/**
 * Created by Yc on 2016/6/17.
 */
var connection = require('./base');
var format = connection.format;
var table = 'comments';

function newPromise(excutor) {
    return new Promise(excutor);
};

module.exports = {
    add : function (username,bookID,content) {
        return newPromise((resolve,reject)=>{
            connection.query('insert into ?? values(?,?,NOW(),?)',[table,username,bookID,content],(err,rlt)=>{
                if(err) reject(err);
                else resolve(rlt.affectedRows>0);
            })
        })
    },
    getAllsByBookID : function (bookID) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where bookID=? order by datetime desc',[table,bookID],(err,rlt)=>{
                if(err) reject(err);
                else{
                    rlt.forEach(x=>{
                        x.datetime = x.datetime.format('yyyy-MM-dd hh:mm:ss');
                    })
                    resolve(rlt);
                }
            })
        })
    },
    getSpAllsByUserName : function (username) {
        return newPromise((resolve,reject)=>{
            connection.query('select username,bookID,datetime from ?? where username=? order by datetime desc',
                [table,username],(err,rlt)=>{
                if(err) reject(err);
                else{
                    rlt.forEach(x=>{
                        x.datetime = x.datetime.format('yyyy-MM-dd hh:mm:ss');
                    })
                    resolve(rlt);
                }
            })
        })
    },
    delete : function (username,bookID,datetime) {
        return newPromise((resolve,reject)=>{
            connection.query('delete from ?? where username=? and bookID=? and datetime=?',
                [table,username,bookID,datetime],(err,rlt)=>{
                    if(err) reject(err);
                    else{
                        resolve(rlt.affectedRows>0);
                    }
                })
        })
    }
}

