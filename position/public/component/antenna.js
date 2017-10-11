/**
 * Created by Administrator on 2017/9/14.
 */
/**
 * Created by Administrator on 2017/9/14.
 */
let antInfo=Vue.component('antenna',{
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
                                <td class="text-center">天线编号</td>
                                <td class="text-center">区域/坐标</td>
                                <td class="text-center">操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in cardItems">
                                <td class="text-center" >{{item.antNum}}</td>
                                <td class="text-center">{{item.point}}</td>
                                <td class="text-center" style="width: 300px">
                                   <button class="btn btn-danger" style="padding:0 2px" :id="item.id" :ant="item.antNum" v-on:click="deleteBox($event,index,item.id,item.antNum)">
                                   <span class="glyphicon glyphicon-remove"></span>删除</button>
                                   <button class="btn btn-success" style="padding:0 2px" :point="item.point" :card="item.antNum" :id="item.id" v-on:click="getEditData($event,index,item.antNum,item.point,item.id)" data-toggle="modal" data-target="#myEditModal">
                                   <span class="glyphicon glyphicon-pencil"></span>编辑
                                   </button>
                                </td>
                            </tr>
                        </tbody>
                  </table>
                  <pages v-bind:cur="cur" v-bind:all="all" :callback="callback"></pages>
                  <nav-delete v-bind:msg="deleteId" v-bind:position="index" v-bind:list="cardItems" v-bind:antNum="antNum"></nav-delete>
                  <editAnv v-bind:cardNum="list" v-bind:tag="objname" v-bind:point="number" v-bind:id="marks" v-bind:items="cardItems" v-bind:index="index"></editAnv>
                  <addAnv v-bind:numList="marks" v-bind:users="cardItems" v-bind:getData="getData"></addAnv>
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
            antNum:''
        }
    },
    methods:{
        getData:function(){
            var me=this;
            this.$http.post('/ant/query',this.pageData).then(function(response){
                var data=response.data;
                me.cardItems=data.msg;
                me.pageCount=Math.ceil(data.pageCount);
                me.pageNum=parseInt(data.pageNum);
                me.cur=parseInt(me.pageNum);
                me.all=Math.ceil(me.pageCount);
            })
        },
        deleteBox:function(e,index,id,num){
            var e=e.target;
            this.deleteId=id;
            this.index=index;
            this.antNum=num;
            $('#myModal').modal('show');
        },
        callback(data) {
            this.cur = data;
            this.pageData.page=this.cur;
            this.msg = '你点击了'+data+ '页'
            this.getData();
        },

        getEditData(e,index,name,number,id){
            var e=e.target;
            this.objname=name;
            this.number=number;
            this.marks=id;
            this.index=index;
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

Vue.component('nav-delete',{
    props:['msg','position','list','antNum'],
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
            this.$http.post('/ant/delete',{id:this.msg,antNum:this.antNum}).then(function(response){
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

Vue.component('editAnv',{
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
                        <input type="card" class="form-control" id="card" placeholder="天线编号" v-model="tag">
                      </div>
                     <div class="form-group">
                        <label for="objName">区域/坐标:</label>
                        <input type="text" class="form-control" id="objName" placeholder="坐标" v-model="point">
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
    props:['cardNum','tag','point','numList','items','index','id'],
    methods:{
        editSub:function(){
            this.$http.post('/ant/update',{name:this.tag,point:this.point,id:this.id}).then(function(response){
                if(response.data.code==1){
                    this.items[this.index].antNum=this.tag;
                    this.items[this.index].point=this.point;
                    $('#myEditModal').modal('hide');
                }else{
                    alert('提交失败！');
                };
            })
        }
    }

})

Vue.component('addAnv',{
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
                    <label for="objName">天线编号:</label>
                    <input type="text" class="form-control" id="objName" placeholder="天线编号" v-model="antAdd.name">
                </div>
                <div class="form-group">
                    <label for="objName">区域/坐标:</label>
                    <input type="text" class="form-control" id="objName" placeholder="坐标" v-model="antAdd.point">
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
    props:['numList','items','users','getData'],
    data:function(){
        return{
            cardNum:{cardid:""},
            antAdd:{name:'',point:''}
        }
    },
    methods:{
        submit:function(){
            this.$http.post('/ant/insert',this.antAdd).then(function(response){
                if(response.data.code==1){
                    alert("添加成功");
                    this.getData();
                    $('#add').modal('hide');
                }else{
                    alert("添加失败");
                };
            })
        }

    }

})

