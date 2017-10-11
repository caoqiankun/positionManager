/**
 * Created by Administrator on 2017/7/18.
 */
/**
 * Created by Administrator on 2017/7/18.
 */
var query= require('../lib/mysql');
var dgram = require('dgram');
var moment=require('moment');
var serverSocket = dgram.createSocket('udp4');
var userCache=require('./users');
var antCache=require('./ant');
initUser();
initAnt();
//区域划分：1在前门里 2在前门外 3在后门里 4在后门外 5教室中央区域
//全局变量：房间的id 所在区域 是否在激活区1/0 标签卡 激活天线id
var cardId;
serverSocket.on('message', function(msg, rinfo){
    //msg 客户端发送过来的数据 rinfo.address是远程主机的地址，rinfo.port是远程主机的端口
    var receive=Buffer.from(msg);
    serverSocket.send(receive,0, receive.length, rinfo.port, rinfo.address);
    //发送数据是否有误
    var sn=parseInt(receive.slice(9,10).toString('hex'),16)
    if(!sn){
        console.log("Devices to send data error ");
    }else {
        //设备id;
        var deviceId = parseInt(receive.slice(6, 8).toString('hex'), 16);
        //一次读到的标签数量
        var count = parseInt(receive.slice(10, 11).toString('hex'), 16);
        //截取标签总长度
        var data = receive.slice(11, receive.length - 1);
        for(var i=0;i<count;i++){
            //截取卡信息
            var cardInfo = data.slice(i*7, 7*(i+1));
            //截取激活字段
            var activation = parseInt(cardInfo.slice(3, 4).toString('hex'), 16).toString(2).slice(0, 1);
            //console.log("激活值：",activation)
            cardId = parseInt(cardInfo.slice(0, 3).toString('hex').toUpperCase(),16);
            console.log("标签id:", cardId);
            //如果标签被激活
            if (activation === "1") {
                //在激活范围
                //激活天线id;
                activationId = (cardInfo.slice(4, 6).toString('hex'),16);
                ssid=parseInt(cardInfo.slice(cardInfo.length-1).toString('hex'),16);
                console.log("ssid:",ssid);
                console.log("天线id:", activationId);
                var coor=antCache.getCoor(activationId);
                var area=coor[0];
                var points=[coor[1],coor[2]];
                    if(ssid>8){
                        userCache.update(cardId,points,area);
                        console.log(userCache.getItems());
                    }

            }else {
                cardId = parseInt(cardInfo.slice(0, 3).toString('hex').toUpperCase(),16);
                userCache.noActivation(cardId)
            }
        }
    }

});


//初始化
function initUser(){
    query(`select user.uname,cardinfo.cardid from user,cardinfo where user.tagid=cardinfo.id`,function(err,vals,fields){
        if(err){
            console.log({'code':-1});
        }else{
            for(var i=0;i<vals.length;i++){
                userCache.init(vals[i].uname,vals[i].cardid,[],0,0,0);
            }
            console.log('用户初始化:');
            console.log(userCache.getItems());
        }

    })
}

function initAnt(){
    query(`select * from antenna`,function(err,vals,fields){
        if(err){
            console.log({'code':-1});
        }else{
            for(var i=0;i<vals.length;i++){
                var point=vals[i].point.split(',');
                var antNo=vals[i].antNum;
                antCache.set(antNo,point);
            }
            console.log('天线信息初始化:');
            console.log(antCache.getItems());
        }
    })
}

setInterval(function(){
    var array=userCache.getItems();
    var date=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    for(var key in array){
        var distance=array[key][2];
        (function(tagid){
            var sql=`insert into hisdata (tagid,distance,insertTime) values ('${tagid}','${distance}','${date}')`;
            query(sql,function(err,vals,fields){
                if(err){
                    console.log(err);
                }else{
                    console.log("活动历史数据插入成功！");
                }
            })
        })(key);
    }

},3000);

serverSocket.on('error', function(err){
    console.log('error:', err.message, err.stack);
});

serverSocket.on('listening', function(){
    console.log("echo server is listening on port 3011.");
})

serverSocket.bind(32500);

