/**
 * Created by Administrator on 2017/9/14.
 */
var myActivity=Vue.component('activityInfo',{
    template:`
        <div class="my-port" style="margin-top:50px">
        <div class="container-fluid">
         <div class="row " >
            <div class="col-sm-3" style="float: left">
              <div class="list-group sport-list">
                <button class="list-group-item " >
                    <span>人员列表</span>
                </button>
                <a href="#" class="list-group-item select" v-bind:class="{active:isActive==index}" :tagid="item.key" v-bind:username="item.name" v-for="(item ,index) in characters" @click.stop.prevent="getData(item.key,item.name,index)">{{item.name}}</a>
              </div>
            </div>
            <div class="col-sm-9">
              <div class="row">
                <form  id="sport-form">
                <div class="col-sm-4 col-sm-offset-1">
                  <div class="input-group">
                    <span class="input-group-btn">
                      <button class="btn btn-default" type="button">开始时间</button>
                    </span>
                    <input type="date" class="form-control"  placeholder="Search for..." v-model="list.startTime">
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="input-group">
                    <span class="input-group-btn">
                      <button class="btn btn-default" type="button">结束时间</button>
                    </span>
                    <input type="date" class="form-control" name="endTime" placeholder="Search for..." v-model="list.endTime">
                  </div>
                </div>
                </form>
                <div class="col-sm-3">
                    <button class="btn btn-success sport-search" @click="search">
                        <span class="glyphicon glyphicon-search"></span>
                      查询
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                  <div id="dataHisChart" ></div>
                </div>
              </div>
          </div>
       </div>
       </div>
      </div>
    `,
    data:function(){
        return {
            option:{
                title: {
                    text: '人员：'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['活动距离']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                dataZoom: [{//用于区域缩放
                    // startValue:data.times[0],
                }, {
                    type: 'inside'
                }],
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                    name:"时间/天"
                },
                yAxis: {
                    name:"活动量/m",
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} m'
                    }
                },
                series: [
                    {
                        name:'活动距离',
                        type:'line',
                        data:[],
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    },
                ]
            },
            characters:[],
            list:{startTime:'',endTime:'',tagid:''},
            isActive:0,
            uname:'',chartsbox:'',mychart:'', xAxis:[],values:[]


        }
    },
    methods:{
        init:function(){
            var me=this;
            this.$http.get('/location/get').then(function(response){
               var msg=response.data;
                for(var key in msg){
                    var data={key:key,name:msg[key][0]}
                    this.characters.push(data);
                }
                this.uname=this.characters[0].name;
                this.list.tagid=this.characters[0].key;
                this.option.title.text="人员："+this.uname;
                this.chartsbox=document.getElementById('dataHisChart');
                this.mychart=echarts.init(this.chartsbox);
                this.mychart.setOption(this.option, true);
            })
        },
        getData(tagid,uname,index){
            this.list.tagid=tagid;
            this.isActive=index;
            this.uname=uname;
            this.option.title.text="人员："+this.uname;
            this.chartsbox=document.getElementById('dataHisChart');
            this.mychart=echarts.init(this.chartsbox);
            this.mychart.setOption(this.option, true);

        },
        search:function(){
            this.$http.post('/sport/getdata',this.list).then(function(response){
                var msg=response.data.msg;
                for(var i=0;i<msg.length;i++){
                    this.xAxis.push(msg[i].insertTime);
                    this.values.push(msg[i].distance);
                }
                this.option.xAxis.data=this.xAxis;
                this.option.series[0].data=this.values;
                this.mychart.setOption(this.option, true);
            })
        }
    },
    created:function(){
        this.init();
    }
})