/**
 * Created by Administrator on 2017/9/13.
 */
var Login=Vue.component('login',{
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
          <a href="#" data-toggle="modal" data-target="#myModal" >
            <span class="glyphicon glyphicon-log-in"></span>
            登录
          </a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container-body">
         <img class="login-bg" src="images/sy-1.jpg" alt=""/>
    </div>
  <div id="myModal" class="modal" data-backdrop="static" >
    <!--第二层-->
    <div class="modal-dialog ">
      <!--第三层 :背景，边框，倒角，阴影-->
      <div class="modal-content my-modal-content">
        <!--第四层：控制内容-->
        <div class="modal-header my-modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body ">
            <form class="form-horizontal" id="login-form">
                <p v-if="titleShow" class="prompt"><b>{{alert}}</b></p>
                <div class="form-group">
                  <label for="user" class="col-sm-2 control-label">用户名：</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" name="user" id="user" placeholder="用户名" v-model="info.user">
                  </div>
                </div>
                <div class="form-group">
                  <label for="pwd" class="col-sm-2 control-label">密码：</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" name="pwd" id="pwd" placeholder="密码" v-model="info.pwd">
                  </div>
                </div>
            </form>
        </div>
        <div class="my-modal-header">
              <div class="col-sm-offset-1">
                <button type="button" v-on:click.stop.prevent="mylogin" class="btn btn-success add-device-submit" data-dismiss="modal" >提交</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click.stop.prevent="close">关闭</button>
              </div>
        </div>
      </div>
    </div>
  </div>
</div>
       `,
  data:function(){
    return {
      msg:'hello',
      alert:"用户名或密码错误",
      info:{user:"",pwd:""},
      titleShow:false
    }
  },
  methods:{
      close:function(){
        this.titleShow=false;
        $('#myModal').modal('hide');
      },
      modalShow:function(){
          this.loginModal=true;
        console.log(this.loginModal);
      },
      mylogin:function(){
        this.$http.post('/admin/login',this.info).then(function(response){
          var msg=response.data;
          if(msg.code==1){
            sessionStorage.uname=this.info.user;
            $('#myModal').modal('hide');
            this.titleShow=false;
            this.$router.push({path:'myMain'});
          }else{
            this.titleShow=true;
          }
        })
      }
  }

})






