/**
 * Created by Administrator on 2017/9/19.
 */
var area=require('../config/config');
var userCache=new Users();
var w=area.w;
var h=area.h;
function Users(){
    var users={};
    this.init=function(name,tagid,coor,distance,area,count){
        users[tagid]=new Array();
        users[tagid].push(name);
        users[tagid].push(coor);
        users[tagid].push(distance);
        users[tagid].push(area);
        users[tagid].push(count);
    }
    this.update=function(tagid,coor,area){
        if(users.hasCard(tagid)){
            if(users[tagid][3]==-1){
               this.compute(coor,tagid,area);
                users[tagid][4]++;
            }else if(users[tagid][4]>0&&users[tagid][4]<2){
                users[tagid][4]++;
            }else if(users[tagid][4]==2){
                this.compute(coor,tagid,area);
                users[tagid][4]==0;
            }
        }
    }
    this.hasCard=function(cardid){
        for(var key in users){
            if(cardid==key){
                return true;
            }
        }
        return false;
    }
    this.removeCard=function(tagid){
        if(this.hasCard(tagid)){
            delete users[tagid];
            return true;
        }
        return false;
    }

    this.set=function(name,tagid){
        if(this.has(tagid)){
            users[tagid].name=name;
        }
    }
    //计算坐标
    this.compute=function(newCoor,tagid,area){
        if(users[tagid][1][0]!=newCoor[0]||users[tagid][1][1]!=newCoor[1]){
            var x1=parseInt(users[tagid][1][0]);
            var y1=parseInt(users[tagid][1][1]);
            var x2=parseInt(newCoor[0]);
            var y2=parseInt(newCoor[1]);
            var calx=(x2-x1)*w;
            var caly=(y2-y1)*h;
            var distance=Math.pow((calx*calx+caly*caly),0.5);
            users[tagid][1]=newCoor;
            users[tagid][2]+=distance;
            users[tagid][3]=area;
        }
    }
    this.getItems=function(){
        return users;
    }
}

module.exports=userCache;