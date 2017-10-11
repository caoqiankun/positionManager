/**
 * Created by Administrator on 2017/7/5.
 */
var express=require('express');
var router=express.Router();
var query=require('../lib/mysql');

router.post('/login',function(req,res){
    var uname=req.body.user;
    var password=req.body.pwd;
    console.log(uname,password);
    query(`select * from login where name='${uname}' and password='${password}'`,
        function(err,vals,fileds){
        if(vals.length==0){
            res.json({'code':-1,success:"false"});
        }else{
            res.json({'code':1,success:"true"});
        }
    })
})

module.exports=router;
