/**
 * Created by Administrator on 2017/9/9.
 */
var express=require('express');
var router=express.Router();
var query=require('../lib/mysql');
var moment=require('moment');

router.post(`/insert`,function(req,res){
      var tagid=req.body.tagid;
      var distance=req.body.distance;
      var username=req.body.username;
      var date=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      var sql=`insert into hisdata (tagid,distance,insertTime) values ('${tagid}','${distance}','${date}')`;
     query(sql,function(err,vals,fields){
        if(err){
            console.log(err);
        }else{
            res.json({'code':1});
        }
     })
})

router.post(`/getdata`,function(req,res){
      var startTime=req.body.startTime;
      var endTime=req.body.endTime+' 23:59:59';
      var tagid=req.body.tagid;
        var sql=`select * from hisdata where tagid='${tagid}' and insertTime between '${startTime}' and '${endTime}' `;
        query(sql,function(err,vals,fields){
          console.log(vals.length);
          if(vals.length==0){
            res.json({'code':-1,'msg':[]});
          }else{
            for(var i=0;i<vals.length;i++){
              vals[i].insertTime=moment(vals[i].insertTime).format('YYYY-MM-DD HH:mm:ss');
            }
            res.json({'code':1,'msg':vals});
          }
        })
})
module.exports=router;