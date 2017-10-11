/**
 * Created by Administrator on 2017/9/19.
 */

var express=require('express');
var router=express.Router();
var query=require('../lib/mysql');
var userCache=require('../udp/users');
//删除
router.get('/get',function(req,res){
    var users=userCache.getItems();
    res.send(users);
})

module.exports=router;

