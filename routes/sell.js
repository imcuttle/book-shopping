/**
 * Created by Yc on 2016/6/17.
 */
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
module.exports=router;
var utils = require('../utils/index');
var db = require('../db/books');
var tradesDB = require('../db/buyrecords');


var common = {};
var recentN = 30;

router.use((req,res,next)=>{
    common = {
        title : '卖书界面',
        subtitle : '我要卖书！',
        activei : 1,
        req : req
    };
    next();
});

router.use('/editbook',(req,res,next)=>{
    common = utils.extend(common,{
        title: '编辑图书',
        subtitle: '可能会影响买家查看信息',
        param:{}
    });
    next();
})
router.use('/addbook',(req,res,next)=>{
    common = utils.extend(common,{
        title : '添加图书',
        subtitle : '图书添加后可以被销售',
        param:{}
    });
    next();
})

router.get('/',(req,res,next)=>{
    var username = req.session.username;
    db.getBySeller(username)
        .then((rlt)=>{
            return utils.extend(common,{books:rlt})
        }).then((json)=>{
            return tradesDB.getAllBySeller(username)
                .then(rlt=>{
                    var data = {
                        trades : rlt.slice(0,recentN),
                        linechart : makeLineChart(rlt),
                        piechart : makePieChart(rlt)
                    };
                    return utils.extend(json,data);
                })
        }).then(rlt=>{
            res.render('sell',rlt);
        }).catch(err=>{
            console.error(err);
            res.render('error',{req:req,error:err,message:err.message,title:'发生错误'});
        });
});

function makeLineChart(all) {
    if(all==null || all.length==0)
        return;
    return all.reduceRight((p,n)=>{
        var date = n.tradeDate;
        if(p.keys[p.keys.length-1]!=date){
            p.keys.push(date);
            p.data.push(1);
        }else{
            p.data[p.data.length-1]++;
        }
        return p;
    },{keys:[],data:[]})
}


function makePieChart(all) {
    if(all==null || all.length==0)
        return;
    var pivot = all[all.length-1];
    var end = new Date(pivot.tradeDate).setHours(24);
    var start = new Date(end - 1000*60*60*24*7);
    var data = {keys:[pivot.title],data:[1]},titleMap = {};
    titleMap[pivot.title]=0;
    for(var i=all.length-2;i>=0;i--){
        if(new Date(all[i].tradeDate)<start)
            break;
        var title = all[i].title;
        if(titleMap[title]==null){
            titleMap[title] = data.keys.length;
            data.keys.push(title);
            data.data.push(1);
        }else
            data.data[titleMap[title]]++;
    }
    return data;
}

router.get('/addbook',(req,res,next)=>{
    common = utils.extend(common,{
        title : '添加图书',
        subtitle : '图书添加后可以被销售',
    })
    res.render('addbook',common);
});
router.use('/editbook/:bookID',(req,res,next)=>{
    var bookID = req.params.bookID,username = req.session.username;
    db.checkByIDName(bookID,username)
        .then(rlt=>{
            if(rlt.length===0){
                res.render('error',{
                    title:'发生错误',
                    message:'你不是该图书的主人',
                    error:{},req:req
                })
            }else
                next();
        }).catch(err=>{
            res.render('error',{
                title:'发生错误',
                message:err.message,
                error:{},req:req
            })
        })
});

router.get('/editbook/:bookID',(req,res,next)=>{
    var bookID = req.params.bookID;
    var param = {bookID:bookID};
    db.getByBookID(bookID)
        .then((rlt)=>{
            if(rlt.length==0){
                res.render('error',{
                    title:'发生错误',
                    message:err.message,
                    error:{},req:req
                })
            }else
                res.render('editbook',utils.extend(common,{param:rlt[0]}));
        },(err)=>{
            console.error(err);
            res.render('error',{
                title:'发生错误',
                message:err.message,
                error:err,req:req
            });
        });
})
router.post('/editbook/:bookID',(req,res,next)=>{
    var param = {};
    common = utils.extend(common,{
        param : param
    });
    var form = makeForm(param);
    form.on('close', function() {
        if(!req.session.username) return;
        db.updateByIDName(param.title, param.author, param.press, param.price, param.quantity, param.image,
                param.bookID,req.session.username
            ).then((rlt)=> {
                if(rlt.length!=0)
                    return utils.extend(common, {code: 1, msgx: '修改成功，唯一书号为：' + param.bookID})
                return utils.extend(common, {code: 0, msgx: '修改失败，你未添加书号为' +param.bookID +'的图书'})
            }, (err)=> {
                console.error(err);
                return utils.extend(common, {code: 0, msgx: '修改失败，错误信息：' + err.message});
            })
            .then((data)=> {
                res.render('editbook', data);
            });
    });
    //上传完成后处理
    form.parse(req);
});

router.post('/addbook',(req,res,next)=>{
    var param = {};
    common = utils.extend(common,{
        param : param
    });
    var form = makeForm(param);
    form.on('close', function() {
        if(!req.session.username) return;
        db.newBookID((newid)=> {
            db.add(newid, param.title, param.author, param.press, param.price, param.quantity, param.image, req.session.username)
                .then((rlt)=> {
                    return utils.extend(common, {code: 1, msgx: '添加成功，唯一书号为：' + newid})
                }, (err)=> {
                    console.error(err);
                    return utils.extend(common, {code: 0, msgx: '添加失败，错误信息：' + err.message});
                })
                .then((data)=> {
                    res.render('addbook', data);
                });
        });
    });
    //上传完成后处理
    form.parse(req);
})

function makeForm(param) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({autoFields:true,autoFiles:false});
    form.on('part', function(part) {
        var img = new Buffer(0);
        part.on('readable',()=>{
            if(part.filename) {
                var d = null;
                while ((d = part.read()) != null) {
                    img=Buffer.concat([img,d]);
                }
            }
        })
        part.on('end',()=>{
            param[part.name] = img;
        })
    });
    form.on('field',(name,value)=>{
        param[name] = value;
    });
    return form;
}