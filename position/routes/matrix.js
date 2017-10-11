/**
 * Created by Administrator on 2017/9/18.
 */

var express=require('express');
var router=express.Router();
var query=require('../lib/mysql');
var area=require('../config/config');
var width=Math.floor(100/area.row);
var height=Math.floor(100/area.col);

router.get(`/query`,function(req,res){
    res.send({'width':width,'height':height,'row':area.row,'col':area.col})
})

module.exports=router;