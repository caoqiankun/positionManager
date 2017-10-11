/**
 * Created by Administrator on 2017/9/14.
 */

var CardInfo=Vue.component('card',{
    template:`
          <transition name="slide-fade">
              <div style="padding: 10px">
                 <div class="my-nav-title">
                    <form class="navbar-form navbar-right" role="search">
                      <div class="form-group">
                        <input type="text" class="form-control" placeholder="搜索" v-model="pageData.kw">
                      </div>
                      <button type="submit" class="btn btn-success" v-on:click="getData"><span class="glyphicon glyphicon-search"></span>搜索</button>
                      <button type="submit" class="btn btn-info" data-toggle="modal" data-target="#add"><span class="glyphicon glyphicon-plus"  ></span>添加</button>
                    </form>
                 </div>
                 <table class="table table-hover table-bordered">
                        <thead>
                            <tr>

                                <td class="text-center">编号</td>
                                <td class="text-center">卡号</td>
                                <td class="text-center">时间</td>
                                <td class="text-center">操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in cardItems">
                                <td class="text-center">{{index+1}}</td>
                                <td class="text-center" >{{item.cardid}}</td>
                                <td class="text-center" >{{item.insertTime}}</td>
                                <td class="text-center" style="width: 300px">
                                   <button class="btn btn-danger" style="padding:0 2px" :id="item.id"  v-on:click="deleteBox($event,index,item.id)">
                                   <span class="glyphicon glyphicon-remove"></span>删除</button>
                                   <button class="btn btn-success" style="padding:0 2px" :id="item.id" :card="item.cardid" :index="index" v-on:click.stop.prevent="getEditData($event,index,item.cardid,item.id)" data-toggle="modal" data-target="#cardEdit">
                                   <span class="glyphicon glyphicon-pencil"></span>编辑
                                   </button>
                                </td>
                            </tr>
                        </tbody>
                  </table>
                  <pages v-bind:cur="cur" v-bind:all="all" :callback="callback"></pages>
                  <delete-component v-bind:msg="deleteId" v-bind:position="index" v-bind:list="cardItems"></delete-component>
                  <edit  v-bind:items="cardItems" v-bind:mark="index" v-bind:card="cardNum" v-bind:tagid="cardid"></edit>
                  <add v-bind:callback="getData"></add>
                 <!--<div id="loading" :class="myloading">-->
                       <!--<div class="loading-content" >-->
                              <!--<img src="images/loading.gif" alt=""/>-->
                       <!--</div>-->
                  <!--</div>-->
              </div>
          </transition>
    `,
    data:function(){
        return {
            list:{cardNum:'',id:''},
            pageData:{page:1,rows:8,kw:''},
            pageCount:'',
            pageNum:1,
            pages:'',
            cardItems:'',
            deleteId:'',
            index:'',
            cur:'',
            all:'',
            msg:'',
            find:'',
            cardNum:'',
            cardid:'',
            myloading:''
        }
    },
    methods:{
        getData:function(){
            var me=this;
            this.$http.post('/card/blur',this.pageData).then(function(response){
                var data=response.data;
                me.cardItems=data.msg;
                if(me.cardItems.length>0){
                    me.pageCount=Math.ceil(data.pageCount);
                    me.pageNum=parseInt(data.pageNum);
                    me.cur=parseInt(me.pageNum);
                    me.all=Math.ceil(me.pageCount);
                }

            })
        },
        deleteBox:function(e,index,id){
            var e=e.target;
            this.deleteId=id;
            this.index=index;
            $('#myModal').modal('show');
        },
        callback(data) {
            this.cur = data;
            this.pageData.page=this.cur;
            this.msg = '你点击了'+data+ '页'
            this.getData();
        },
        getEditData(e,index,number,id){
            var e=e.target;
            this.cardNum=number;
            this.cardid=id;
            this.index=index;
            $('#cardEdit').modal('show');
        }

    },
    created:function(){
        this.getData();
    }
})

Vue.component('delete-component',{
    props:['msg','position','list'],
    template:`
      <div id="myModal" class="modal" data-backdrop="static">
         <div class="modal-dialog my-modal-delete">
        <!--第三层 :背景，边框，倒角，阴影-->
          <div class="modal-content">
              <!--第四层：控制内容-->
             <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4>操作</h4>
              </div>
              <div class="modal-body">
                  <p>是否删除选中内容？</p>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-warning  " v-on:click="submitData">确认</button>
                  <button type="button" class="btn btn-default btn-success" data-dismiss="modal">关闭</button>
              </div>
          </div>
      </div>
    </div>
    `,
    methods:{
        submitData:function(){
            this.$http.post('/card/delete',{id:this.msg}).then(function(response){
                if(response.data.code==1){
                   this.list.splice(this.position,1);
                    $('#myModal').modal('hide');
                }
            })
        }
    }
})

Vue.component('pages',{
    template:`
            <div class="page-bar">
                <ul>
                <li v-if="cur!=1"><a v-on:click="cur--">上一页</a></li>
                <li v-for="index in indexs"  v-bind:class="{ active: cur == index}">
                    <a v-on:click="btnClick(index)">{{ index }}</a>
                    </li>
                    <li v-if="cur!=all"><a v-on:click="cur++">下一页</a></li>
                    <li><a>共<i>{{all}}</i>页</a></li>
                </ul>
              </div>
        `,
    props: {
        cur: {
            type: [String, Number],
            required: true
        },
        all: {
            type: [String, Number],
            required: true
        },
        callback: {
            default() {
                return function callback() {

                }
            }
        }
    },
    computed: {
        indexs() {
            var left = 1
            var right = this.all
            var ar = []
            if (this.all >= 11) {
                if (this.cur > 5 && this.cur < this.all - 4) {
                    left = this.cur - 5
                    right = this.cur + 4
                } else {
                    if (this.cur <= 5) {
                        left = 1
                        right = 4
                    } else {
                        right = this.all
                        left = this.all -5
                    }
                }
            }
            while (left <= right) {
                ar.push(left)
                left ++
            }
            return ar
        }

    },
    methods: {
        btnClick(page) {
            if (page != this.cur) {
                this.callback(page)
            }
        }
    }

})
Vue.component('edit',{
    template:`
        <div id="cardEdit" class="modal" data-backdrop="static">
         <div class="modal-dialog my-modal-delete">
        <!--第三层 :背景，边框，倒角，阴影-->
          <div class="modal-content" >
              <!--第四层：控制内容-->
             <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4>操作</h4>
              </div>
              <div class="modal-body">
                  <form>
                      <div class="form-group">
                        <label for="card">标签号:</label>
                        <input type="card" class="form-control" id="card" placeholder="标签号" v-model="card">
                      </div>
                   </form>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-warning " @click="editSub">确认</button>
                  <button type="button" class="btn btn-default btn-success" data-dismiss="modal">关闭</button>
              </div>
          </div>
      </div>
    </div>
    `,
    props:['items','mark','card','tagid'],
    methods:{
        editSub:function(){
            this.$http.post('/card/update',{cardNum:this.card,id:this.tagid}).then(function(response){
                if(response.data.code==1){
                    this.items[this.mark].cardid=this.card;
                    $('#cardEdit').modal('hide');
                }else{
                    alert('提交失败！');
                };
            })
        }
    }

})

Vue.component('add',{
    template:`
 <div id="add" class="modal">
    <div class="modal-dialog" >
        <!--第三层 :背景，边框，倒角，阴影-->
        <div class="modal-content add-content">
            <!--第四层：控制内容-->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4>设备添加</h4>
            </div>
            <form id="add-device-form">
            <div class="modal-body">
                <div class="form-group">
                    <label for="deviceName">卡号:</label>
                    <input type="text" class="form-control" name="name" id="deviceName" placeholder="设备名称" v-model="cardNum.cardid">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success " @click="submit">提交</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
            </form>
        </div>
    </div>
   </div>
    `,
    props: {
        callback: {
            default() {
                return function callback() {

                }
            }
        }
    },
    data:function(){
      return{
          cardNum:{cardid:""}
      }
    },
    methods:{
        submit:function(){
            this.$http.post('/card/insert',this.cardNum).then(function(response){
                if(response.data.code==1){
                    this.callback();
                    $('#add').modal('hide');
                }else{
                    alert("添加失败");
                };
            })
        }
    }

})

