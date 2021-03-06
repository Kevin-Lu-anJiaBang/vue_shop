import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../views/Login.vue'
const Login = () => import(/* webpackChunkName: "Login_home_welcome" */ '../views/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_home_welcome" */ '../views/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_home_welcome" */ '../views/Welcome.vue')

// import Home from '../views/Home.vue'
// import Welcome from '../views/Welcome.vue'

const Users = () => import(/* webpackChunkName: "Users_rights_roles" */ '../views/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_rights_roles" */ '../views/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_rights_roles" */ '../views/power/Roles.vue')
// import Users from '../views/user/Users.vue'
// import Rights from '../views/power/Rights.vue'
// import Roles from '../views/power/Roles.vue'

const Cate = () => import(/* webpackChunkName: "Cate_params" */ '../views/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_params" */ '../views/goods/Params.vue')
// import Cate from '../views/goods/Cate.vue'
// import Params from '../views/goods/Params.vue'

const goodList = () => import(/* webpackChunkName: "GoodsList_Add_Modify" */ '../views/goods/List.vue')
const Add = () => import(/* webpackChunkName: "GoodsList_Add_Modify" */ '../views/goods/Add.vue')
const Modify = () => import(/* webpackChunkName: "GoodsList_Add_Modify" */ '../views/goods/Modify.vue')
// import goodList from '../views/goods/List.vue'
// import Add from '../views/goods/Add.vue'
// import Modify from '../views/goods/Modify.vue'
const Orders = () => import(/* webpackChunkName: "Orders_report" */ '../views/order/Orders.vue')
const Report = () => import(/* webpackChunkName: "Orders_report" */ '../views/report/Report.vue')
// import Orders from '../views/order/Orders.vue'
// import Report from '../views/report/Report.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: "/home" },  // 路由重定向
  { path: '/login', component: Login },
  { path: '/home', component: Home, redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: goodList },
      { path: '/goods/add', component: Add },
      { path: '/goods/modify/:id', component: Modify },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Report },
    ]
}
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to, from, next) =>{
  // 如果用户访问的登录页，直接放行
  if (to.path == '/login') return next()
  // 从sessionStorage 中获取到保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  //没有 token，强制跳转到登录页
  if (!tokenStr) {
    // this.$message.error('请先登录')
    window.alert("请先登录！")
    return next('/login')
  }
  next()
})

export default router
