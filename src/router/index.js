import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/pages/Index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/contents',
      name: 'Contents',
      component: resolve => require(['@/components/pages/Contents'], resolve)
    },
    {
      path: '/lables',
      name: 'Lables',
      component: resolve => require(['@/components/pages/Lables'], resolve)
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/components/pages/Login'], resolve)
    },
    {
      path: '/regist',
      name: 'Regist',
      component: resolve => require(['@/components/pages/Regist'], resolve)
    },
    {
      path: '/admin',
      name: 'admin',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: resolve => require(['@/components/admin/Admin'], resolve),
      children: [
        {
          path: 'newEssay',
          name: 'newEssay',
          meta: {
            requireAuth: true,  
          },
          component: resolve => require(['@/components/admin/NewEssay'], resolve)
        },
        {
          path: 'tags',
          name: 'tags',
          meta: {
            requireAuth: true, 
          },
          component: resolve => require(['@/components/admin/Tags'], resolve)
        },
        {
          path: 'settings',
          name: 'settings',
          meta: {
            requireAuth: true,  
          },
          component: resolve => require(['@/components/admin/Settings'], resolve)
        },
        {
          path: 'draft',
          name: 'draft',
          meta: {
            requireAuth: true, 
          },
          component: resolve => require(['@/components/admin/Draft'], resolve)
        },
        {
          path: 'content',
          name: 'content',
          meta: {
            requireAuth: true,  
          },
          component: resolve => require(['@/components/admin/DraftContent'], resolve)
        },
        {
          path: 'update',
          name: 'update',
          meta: {
            requireAuth: true,  
          },
          component: resolve => require(['@/components/admin/Update'], resolve)
        },
        {
          path: 'comments',
          name: 'comments',
          meta: {
            requireAuth: true,  
          },
          component: resolve => require(['@/components/admin/Comments'], resolve)
        }
      ]
    },
    {
      path: "/404",
      name: "notFound",
      component: resolve => require(['@/components/pages/NotFound'], resolve)
    },
    {
      path: "*",
      redirect: "/404"
    }
  ]
})
