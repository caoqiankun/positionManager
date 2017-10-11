/**
 * Created by Administrator on 2017/7/10.
 */
var express=require('express');
var router=express.Router();
var query=require('../lib/mysql');
var moment=require('moment');
router.post(`/query`,function(req,res){
    var page=req.body.page,
        count=req.body.rows,
        start=count*(page-1),total,pages;
    query(`SELECT * FROM cardInfo`,function(err,vals,fields){
        total=vals.length;
        pages=Math.ceil(total/count);
        query(`SELECT * FROM cardInfo LIMIT ${start},${count}`,function(err,vals,fields){
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
    var card=req.body.cardid;
    var date=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    query(`INSERT INTO cardinfo (cardid,insertTime) VALUES ('${card}','${date}')`,function(err,vals,fields){
        if(err){
            res.json({'code':-1,'success':false});
        }else{
            res.json({'code':1,'success':true});
        }
    })
})

//验证卡号是否存在
router.post('/cardExist',function(req,res){
    var card=req.body.cardName;
    query(`select id from cardInfo where rfid='${card}' `,function(err,vals,fields){
        if(vals.length==0){
            res.json({'code':1,'success':true});
        }else{
            res.json({'code':-1,'success':false});
        }
    })
})

//编号验证
router.post('/numExist',function(req,res){
    var num=req.body.number;
    query(`select id from cardInfo where number=${num}`,function(err,vals,fields){
        if(vals.length==0){
            res.json({'code':1,'success':true});
        }else{
            res.json({'code':-1,'success':false});
        }
    })
})
//删除
router.post('/delete',function(req,res){
    var id=req.body.id;
    query(`DELETE FROM cardInfo WHERE id=${id}`,function(err,vals,fields){
        if(err){
            res.json({'code':-1,'success':false});
        }else{
            res.json({'code':1,'success':true});
        }
    })
})

router.post('/update',function(req,res){
    var card=req.body.cardNum;
    var uid=req.body.id;
    query(`UPDATE cardinfo SET cardid='${card}' WHERE id=${uid}`,function(err,vals,fields){
        if(err){
            res.json({'code':-1,'success':false});
        }else{
            res.json({'code':1,'success':true});
        }
    })
})

//分页模糊查询
router.post('/blur',function(req,res){
    var page=req.body.page,
        count=req.body.rows,
        kw=req.body.kw||"",
        start=count*(page-1),total,pages;
    query(`SELECT * FROM cardinfo WHERE cardid LIKE '%${kw}%'`,function(err,vals,fields){
        total=vals.length;
        pages=Math.ceil(total/count);
        var sql=`SELECT * FROM cardinfo WHERE cardid LIKE '%${kw}%' LIMIT ${start},${count}`;
        query(sql,function(err,vals,fields){
              //console.log(vals);
            if(vals.length==0){
                console.log(err);
                res.json({'code':-1,'success':false});
            }else{
                for(var i=0;i<vals.length;i++){
                    vals[i].insertTime=moment(vals[i].insertTime).format('YYYY-MM-DD HH:mm:ss');
                }
                res.json({'code':1,'success':true,'msg':vals,'pageNum':page,'pageCount':pages});
            }
        })
    })
})
module.exports=router;