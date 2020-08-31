import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/user/Users.vue'
import Rights from '../views/power/Rights.vue'
import Roles from '../views/power/Roles.vue'
import Cate from '../views/goods/Cate.vue'
import Params from '../views/goods/Params.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: "/login" },  // 路由重定向
  { path: '/login', component: Login },
  { path: '/home', component: Home, redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
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
