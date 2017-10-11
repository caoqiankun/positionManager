/**
 * Created by Administrator on 2017/7/12.
 */
var express=require('express');
var router=express.Router();
var query=require('../lib/mysql');
var moment=require('moment');
var antCache=require('../udp/ant');

//查询数据
router.post(`/query`,function(req,res){
    var page=req.body.page,
        count=req.body.rows,
        kw=req.body.kw||'',
        start=count*(page-1),total,pages;
    query(`SELECT * FROM antenna WHERE antNum LIKE '%${kw}%'`,function(err,vals,fields){
        total=vals.length;
        pages=Math.ceil(total/count);
        query(`SELECT * FROM antenna WHERE antNum LIKE '%${kw}%' LIMIT ${start},${count}`,function(err,vals,fields){
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
    var name=req.body.name;
    var point=req.body.point;
    query(`INSERT INTO antenna (antNum,point) VALUES (${name},'${point}')`,function(err,vals,fields){
        if(err){
            res.json({'code':-1,'success':false});
        }else{
            point=point.split(',');
            antCache.set(name,point);
            console.log("添加成功");
            console.log(antCache.getItems());
            res.json({'code':1,'success':true});
        }
    })
})

//删除
router.post('/delete',function(req,res){
    var id=req.body.id;
    var antNum=req.body.antNum;
    console.log(id,antNum);
    query(`DELETE FROM antenna WHERE id=${id}`,function(err,vals,fields){
        if(err){
            res.json({'code':-1,'success':false});
        }else{
            antCache.remove(antNum);
            console.log("移除成功");
            console.log(antCache.getItems());
            res.json({'code':1,'success':true});
        }
    })
})

//验证
router.post('/check',function(req,res){
    var kw=req.body.kw;
    query(`select * from activating where sensorName='${kw}' `,function(err,vals,fields){
            if(vals.length){
                res.json({'code':-1,'success':false});
            }else{
                res.json({'code':1,'success':true});
            }
    })
})
//验证
router.post('/checkAnt1',function(req,res){
    var kw=req.body.kw;
    query(`select * from activating where antOne='${kw}' or antTwo='${kw}'`,function(err,vals,fields){
            if(vals.length){
                res.json({'code':-1,'success':false});
            }else{
                res.json({'code':1,'success':true});
            }
    })
})
//验证
router.post('/checkAnt2',function(req,res){
    var kw=req.body.kw;
    query(`select * from activating where antTwo='${kw}' or antOne='${kw}'`,function(err,vals,fields){
            if(vals.length){
                res.json({'code':-1,'success':false});
            }else{
                res.json({'code':1,'success':true});
            }
    })
})

//更新数据
router.post('/update',function(req,res){
    var name=req.body.name;
    var point=req.body.point;
    var uid=req.body.id;
    query(`UPDATE antenna SET antNum='${name}',point='${point}' WHERE id=${uid}`,function(err,vals,fields){
        if(err){
            res.json({'code':-1,'success':false});
        }else{
            res.json({'code':1,'success':true});
        }
    })
})
module.exports=router;