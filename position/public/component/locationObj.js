/**
 * Created by Administrator on 2017/9/14.
 */
var myObj=Vue.component('objInfo',{
    template:`
          <transition name="slide-fade">
              <div style="padding: 10px">
                 <div class="my-nav-title">
                    <form class="navbar-form navbar-right" role="search">
                      <div class="form-group">
                        <input type="text" class="form-control" placeholder="搜索" v-model="pageData.kw">
                      </div>
                      <button type="submit" class="btn btn-success" v-on:click="getData"><span class="glyphicon glyphicon-search"></span>搜索</button>
                      <button type="submit" class="btn btn-info" @click.stop.prevent="getObj()"><span class="glyphicon glyphicon-plus" ></span>添加</button>
                    </form>
                 </div>
                 <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <td class="text-center">对象名称</td>
                                <td class="text-center">卡号</td>
                                <td class="text-center">操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in cardItems">
                                <td class="text-center" >{{item.uname}}</td>
                                <td class="text-center">{{item.cardid}}</td>
                                <td class="text-center" style="width: 300px">
                                   <button class="btn btn-danger" style="padding:0 2px" :id="item.id" :card="item.cardid" v-on:click="deleteBox($event,index,item.id,item.cardid)">
                                   <span class="glyphicon glyphicon-remove"></span>删除</button>
                                   <button class="btn btn-success" style="padding:0 2px" :id="item.cardid" :card="item.uname"  v-on:click="getEditData($event,index,item.uname,item.cardid)" data-toggle="modal" data-target="#myEditModal">
                                   <span class="glyphicon glyphicon-pencil"></span>编辑
                                   </button>
                                </td>
                            </tr>
                        </tbody>
                  </table>
                  <pages v-bind:cur="cur" v-bind:all="all" :callback="callback"></pages>
                  <delete-com v-bind:msg="deleteId" v-bind:position="index" v-bind:list="cardItems" v-bind:card='card'></delete-com>
                  <editObj v-bind:cardNum="list" v-bind:objName="objname" v-bind:number="number"  v-bind:items="cardItems" v-bind:index="index"></editObj>
                  <addUser v-bind:numList="marks" v-bind:users="cardItems" v-bind:getData="getData" v-bind:itemList="addlist"></addUser>
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
            marks:'',
            objname:'',
            number:'',
            card:'',addlist:''
        }
    },
    methods:{
        getData:function(){
            var me=this;
            this.$http.post('/userObj/query',this.pageData).then(function(response){
                var data=response.data;
                me.cardItems=data.msg;
                me.pageCount=Math.ceil(data.pageCount);
                me.pageNum=parseInt(data.pageNum);
                me.cur=parseInt(me.pageNum);
                me.all=Math.ceil(me.pageCount);
            })
        },
        deleteBox:function(e,index,id,card){
            var e=e.target;
            this.deleteId=id;
            this.index=index;
            this.card=card;
            $('#myModal').modal('show');
        },
        callback(data) {
            this.cur = data;
            this.pageData.page=this.cur;
            this.msg = '你点击了'+data+ '页'
            this.getData();
        },

        getEditData(e,index,name,number){
            var e=e.target;
            this.objname=name;
            this.number=number;
            this.index=index;
        },
        getObj(){
            $('#add').modal('show');
            this.$http.get('/userObj/getCard').then(function(res){
                this.addlist=res.data.msg;
            })
        }

    },
    watch:{
        pageData:{
            handler:function(val,oldval){
            },
            deep:true//对象内部的属性监听，也叫深度监听
        }
    },
    created:function(){
        this.getData();
    }
})

Vue.component('delete-com',{
    props:['msg','position','list','card'],
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
            this.$http.post('/userObj/delete',{id:this.msg,card:this.card}).then(function(response){
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

Vue.component('editObj',{
    template:`
        <div id="myEditModal" class="modal" data-backdrop="static">
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
                        <label for="card">对象:</label>
                        <input type="card" class="form-control" id="card" placeholder="对象" v-model="objName">
                      </div>
                     <div class="form-group">
                      <div class="input-group">
                          <div class="input-group-btn">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">卡号 <span class="caret"></span></button>
                            <ul class="dropdown-menu" style="height: 180px;overflow: auto">
                              <li v-for="(item ,index) in numList"><a href="#" v-on:click.stop.prevent="getMark(index)">{{item.id}}</a></li>
                            </ul>
                          </div>
                          <input type="text" class="form-control" aria-label="..." v-model="number" disabled>
                        </div>
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
    props:['cardNum','objName','number','numList','items','index'],
    data:function(){
      return {
            editObj:{obj:'',num:''},
            num:1
      }
    },
    methods:{
        editSub:function(){
            console.log(this.objName);
            this.$http.post('/userObj/up',{name:this.objName,tagid:this.number}).then(function(response){
                if(response.data.code==1){
                    this.items[this.index].uname=this.objName;
                    $('#myEditModal').modal('hide');
                }else{
                    alert('提交失败！');
                };
            })
        },
        init:function(){
            this.editObj.obj=this.items[this.mark].uname;
            this.editObj.num=this.items[this.mark].tagid;
        }
    }

})

Vue.component('addUser',{
    template:`
 <div id="add" class="modal">
    <div class="modal-dialog" >
        <div class="modal-content add-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4>对象添加</h4>
            </div>
            <form >
            <div class="modal-body">
                <div class="form-group">
                    <label for="objName">对象:</label>
                    <input type="text" class="form-control" id="objName" placeholder="对象" v-model="userAdd.uname">
                </div>
                <div class="form-group">
                      <div class="input-group">
                          <div class="input-group-btn">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">卡号 <span class="caret"></span></button>
                            <ul class="dropdown-menu" style="height: 180px;overflow: auto">
                              <li v-for="(item ,index) in itemList"><a href="#" v-on:click.stop.prevent="mark(index)">{{item.cardid}}</a></li>
                            </ul>
                          </div>
                          <input type="text" class="form-control" aria-label="..." v-model="userAdd.cardid">
                        </div>
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
    props:['items','users','getData','itemList'],
    data:function(){
        return{
            cardNum:{cardid:""},
            userAdd:{uname:'',tagid:'',cardid:''}
        }
    },
    methods:{
        submit:function(){
            this.$http.post('/userObj/insert',this.userAdd).then(function(response){
                if(response.data.code==1){
                    alert("添加成功");
                    this.getData();
                    $('#add').modal('hide');
                }else{
                    alert("添加失败");
                };
            })
        },
        mark:function(index){
            this.userAdd.tagid=this.itemList[index].id;
            this.userAdd.cardid=this.itemList[index].cardid;
            this.itemList.splice(index,1);
        }
    }

})

