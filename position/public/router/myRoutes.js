/**
 * Created by Administrator on 2017/9/14.
 */

const myRoutes=[
    {path:'/myLogin',component:Login},
    {path:'/myMain',component:Mymain,
        children:[
            {path:'/myCard',component:CardInfo},
            {path:'/myObject',component:myObj},
            {path:'/myAnt',component:antInfo},
            {path:'/myLocation',component:myPosition},
            {path:'/myAct',component:myActivity}
        ]
    },
    {path:'',component:Login}
]
const myRouter=new VueRouter({
    routes:myRoutes
})
new Vue({
    router:myRouter,
    el:'#example',
    data:{
        msg:'hello'
    }
})