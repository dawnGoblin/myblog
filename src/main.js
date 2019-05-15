// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import mavonEditor from 'mavon-editor'
import md5 from 'js-md5';
import 'mavon-editor/dist/css/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/reset.scss'
import './assets/icons/iconfont.css'
import * as filters from './assets/js/filters.js'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.axios = axios;
Vue.use(mavonEditor)
Vue.prototype.$md5 = md5;
/* eslint-disable no-new */

Object.keys(filters).forEach(key => { //过滤器挂载在Vue上
  Vue.filter(key, filters[key])
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      if (sessionStorage.getItem("token")) {  
          next();
      }
      else {
          next({
              path: '/login',
              query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
  }
  else {
      next();
  }
})
new Vue({
  el: '#app',
  router,
  render: h => h(App)
  // components: { App },
  // template: '<App/>'
})
