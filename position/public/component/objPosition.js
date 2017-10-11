/**
 * Created by Administrator on 2017/9/14.
 */
var myPosition=Vue.component('position',{
    template:`
          <transition name="slide-fade">
             <div id="parent">
                   <div v-for="(item, index) in arrays" :style="'width:'+ width +'%;'+'height:'+height+'%'" :id="index"><span class="badge ">{{index}}</span>
                       <div class="box">
                        <div class="children" v-for="item in list" style="margin-right: 10px" v-if="item[1]==index" @mouseenter="enter($event)" @mouseleave="leave($event)">
                            <p class="toggle">{{item[0]}}</p>
                        </div>
                       </div>
                   </div>
             </div>
          </transition>
    `,
    data:function(){
      return {
          row:'',
          col:'',
          width:'',
          height:'',
          list:[],
          item:''
      }
    },
    methods:{
        init:function(){
            this.$http.get('/area/query').then(function(response){
                var msg=response.data
                this.width=msg.width;
                this.height=msg.height;
                this.row=msg.row;
                this.col=msg.col;
            })
        },
        getData:function(){
            var me=this;
            this.$http.get('/location/get').then(function(response){
                        var data=response.data;
                        this.list=[];
                for(var key in data){
                    this.item=[];
                    this.item.push(data[key][0]);
                    this.item.push(data[key][3]);
                    this.list.push(this.item);
                    }
                console.log(this.list);
            })
        },
        enter:function(e){
            var e=e.target;
                e.firstChild.className="show"
        },
        leave:function(e){
            var e=e.target;
            e.firstChild.className="toggle"
        }
    }
    ,
    computed:{
        arrays:function(){
            var num=this.row*this.col;
            var list=[];
            for(var i=0;i<num;i++){
               list.push(i);
            }
            return list;
        }

    },
    created:function(){
        this.init();
        setInterval(this.getData,3000);
    }

})