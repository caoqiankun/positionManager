/**
 * Created by Administrator on 2017/7/6.
 */
var express=require('express');
var router=express.Router();
var query=require('../lib/mysql');
var moment=require('moment');
var userCache=require('../udp/users');
//查询数据
router.post(`/query`,function(req,res){
    var page=req.body.page,
        count=req.body.rows,
       start=count*(page-1),total,pages;
       var kw=req.body.kw||"";
        console.log(page,count);
        query(`select * from user where  uname like '%${kw}%'`,function(err,vals,fields){
        total=vals.length;
        pages=Math.ceil(total/count);
        var sql= `SELECT user.*, cardinfo.cardid FROM user, cardinfo where user.tagid=cardinfo.id and uname like '%${kw}%' limit ${start},${count}`;
        query(sql,function(err,vals,fields){
            if(err){
                    res.json({'code':-1,'success':false});
                }else{
                    res.json({'code':1,'success':true,'msg':vals,'pageNum':page,'pageCount':pages});
            }
        })
    })
})

//插入数据
router.post('/insert',function(req,res){
    var name=req.body.uname;
    var tagid=req.body.tagid;
    var cardid=req.body.cardid;
    query(`INSERT INTO user (uname,tagid) VALUES ('${name}',${tagid})`,
        function(err,vals,fields){
            if(err){
                res.json({'code':-1,'success':false});
            }else{
                console.log("对象添加成功：")
                userCache.init(name,cardid,[],0,-1,0);
                console.log(userCache.getItems());
                res.json({'code':1,'success':true});
            }
        })
})

//查找没有绑定的卡号
router.get('/getCard',function(req,res){
    query(`select id,cardid from cardinfo where not exists(select tagid from user where cardinfo.id=user.tagid)`,function(err,vals,fields){
        if(err){
            res.json({'code':-1,'success':false});
        }else{
            res.json({'code':1,'success':true,'msg':vals});
        }
    })
})

//更新数据
router.post('/up',function(req,res){
    var name=req.body.name;
    var tagid=req.body.tagid;
    query(`update user set uname='${name}'  where tagid=${tagid} `,function(err,vals,fields){
        if(err){
            res.json({'code':-1,'success':false});
        }else{
            res.json({'code':1,'success':true});
        }
    })
})

router.post('/delete',function(req,res){
    var id=req.body.id;
    var cardid=req.body.card;
    query(`delete from user where id=${id} `,function(err,vals,fields){
        if(err){
            res.json({'code':-1,'success':false});
        }else{
            if(userCache.hasCard(cardid)){
                userCache.removeCard(cardid);
                console.log("移除成功：")
                console.log(userCache.getItems());
            }
            res.json({'code':1,'success':true});
        }
    })
})
module.exports=router;