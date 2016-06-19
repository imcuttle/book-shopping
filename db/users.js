/**
 * Created by Yc on 2016/6/16.
 */
var connection = require('./base');
var format = connection.format;
var table = 'users';
function newPromise(excutor) {
    return new Promise(excutor);
};

function getAll(cb) {
    connection.query(format('SELECT * FROM ??',[table]),cb);
}
function checkIsExistByUsername(username,cb) {
    connection.query(format('SELECT * FROM ?? where username=?',[table,username]),cb);
}
function checkIsExistByEmail(em,cb) {
    connection.query(format('SELECT * FROM ?? where email=?',[table,em]),cb);
}
function add(user,cb) {
    connection.query(format('INSERT INTO ?? VALUES(?,?,?,curdate())',[table,user.username,user.email,user.password]), cb);
}

var sFilter = connection.likeStrFilter;

module.exports={
    getAll : getAll,
    checkIsExistByUsername : checkIsExistByUsername,
    checkIsExistByEmail: checkIsExistByEmail,
    add : add,
    getByName :　function (username) {
        return newPromise((resolve,reject)=>{
            connection.query('select * from ?? where username=?',[table,username],
                (err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach(x=>{
                            x.registerDate = x.registerDate.format('yyyy-MM-dd');
                        })
                        resolve(rlt);
                    }
                })
        })
    },
    getByLikeName : function (likename) {
        return newPromise((resolve,reject)=>{
            connection.query("select * from ?? where username like ? escape '*'",[table,sFilter(likename)],
                (err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach(x=>{
                            x.registerDate = x.registerDate.format('yyyy-MM-dd');
                        })
                        resolve(rlt);
                    }
                })
        })
    },
    getByLikeEmail : function (likeemail) {
        return newPromise((resolve,reject)=>{
            connection.query("select * from ?? where email like ? escape '*'",[table,sFilter(likeemail)],
                (err,rlt)=>{
                    if(err) reject(err);
                    else{
                        rlt.forEach(x=>{
                            x.registerDate = x.registerDate.format('yyyy-MM-dd');
                        })
                        resolve(rlt);
                    }
                })
        })
    }
}