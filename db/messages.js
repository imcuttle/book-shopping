/**
 * Created by Yc on 2016/6/17.
 */
var connection = require('./base');
var format = connection.format;
var table = 'messages';

function newPromise(excutor) {
    return new Promise(excutor);
};

module.exports = {
    add : function (username,content) {
        return newPromise((resolve,reject)=>{
            connection.query('insert into ?? values(?,?,NOW())',[table,username,content],(err,rlt)=>{
                if(err) reject(err);
                else resolve(rlt.affectedRows>0);
            })
        })
    },
    getRecents : function (n) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? order by datetime desc limit ?',[table,n],(err,rlt)=>{
                if(err) reject(err);
                else{
                    rlt.forEach(x=>{
                        x.datetime = x.datetime.format('yyyy-MM-dd hh:mm');
                    })
                    resolve(rlt);
                }
            })
        })
    }
}