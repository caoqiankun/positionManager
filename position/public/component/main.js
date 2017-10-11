/**
 * Created by Administrator on 2017/9/13.
 */
var Mymain=Vue.component('myMain',{
    template:`
    <div>
       <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
          <!--1、navbar头部-->
          <div class="navbar-header">
          <a href="#" class="navbar-brand">
            <img class="img-circle my-logo" src="images/logo.png" alt=""/>
          </a>
         <span class="logo-title">定位管理系统</span>

          </div>
          <ul class="nav navbar-nav navbar-right">
            <li>
              <a href="#">
                <span class="glyphicon glyphicon-user"></span>
                {{userName}}
              </a>
            </li>
            <li>
              <a href="#" v-on:click.stop.prevent="backLogin">
                <span class="glyphicon glyphicon-off"></span>
                退出
              </a>
            </li>
          </ul>
        </div>
      </nav>
     <div class="container-body">
          <div class="my-main-left">
               <div class="row">
                    <div class="col-md-12">
                        <div class="list-group my-left-list-group">
                          <a href="#" class="list-group-item " v-bind:class="{active:isActivity==0}" v-on:click.stop.prevent="changeClass(0,'/myCard')">
                           <span class="glyphicon glyphicon-tags title-color"></span>&nbsp;&nbsp;标签信息管理
                          </a>
                          <a href="#" class="list-group-item title-color" v-bind:class="{active:isActivity==1}" v-on:click.stop.prevent="changeClass(1,'/myObject')">
                          <span class="glyphicon glyphicon-user title-color"></span>&nbsp;&nbsp;定位对象管理</a>
                          <a href="#" class="list-group-item " v-bind:class="{active:isActivity==2}" v-on:click.stop.prevent="changeClass(2,'/myAnt')">
                          <span class="glyphicon glyphicon-credit-card title-color"></span>&nbsp;&nbsp;天线信息管理</a>
                          <a href="#" class="list-group-item " v-bind:class="{active:isActivity==3}" v-on:click.stop.prevent="changeClass(3,'/myLocation')">
                          <span class="glyphicon glyphicon-map-marker title-color"></span>&nbsp;&nbsp;对象位置查询</a>
                          <a href="#" class="list-group-item title-color" v-bind:class="{active:isActivity==4}" v-on:click.stop.prevent="changeClass(4,'/myAct')">
                           <span class="glyphicon glyphicon-heart title-color"></span>&nbsp;&nbsp;活动信息查询</a>
                        </div>
                    </div>
               </div>
          </div>
          <div class="my-main-right">
                <router-view></router-view>
          </div>
     </div>
  </div>
    `,
    data:function(){
        return {
            userName:sessionStorage.uname,
            isActivity:0
        }
    },
    methods:{
        backLogin:function(){
            this.$router.push({path:'myLogin'});
        },
        changeClass:function(index,href){
            this.isActivity=index;
            this.$router.push({path:href})

        }
    },
    created:function(){
        this.$router.push({path:'myCard'})
    }
})