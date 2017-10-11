/**
 * Created by Administrator on 2017/7/5.
 */
var mysql=require('mysql');
var pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'situation',
    port:'3306',
    datatime:true
});
function query(sql,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,function(qerr,vals,fields){
                //释放连接
                conn.release();
                callback(qerr,vals,fields);
            })
        }
    })
}

module.exports=query;