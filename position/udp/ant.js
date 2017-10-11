/**
 * Created by Administrator on 2017/9/19.
 */

var antCache=new Ant();
function Ant(){
    var ants={};
    this.set=function(antNo,coor){
        ants[antNo]=coor;
    }
    this.has=function(antNo){
        for(var key in ants){
            if(key==antNo){
                return true;
            }
        }
        return false;
    }
    this.remove=function(antNo){
        if(this.has(antNo)){
            delete  ants[antNo];
            return true;
        }
        return false;
    }

    this.getCoor=function(antNo){
        return this.has(antNo)?ants[antNo]:undefined;
    }
    this.getItems=function(){
        return ants;
    }
}

module.exports=antCache;