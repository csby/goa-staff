import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: function (to, from, next) {
      const authorized = Vue.prototype.$db.authorized()
      if (authorized) {
        if (from) {
          next(from)
        } else {
          next('/')
        }
      } else {
        next(true)
      }
    }
  },
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        component: () => import('../views/Public')
      },
      {
        path: '/resource/server',
        component: () => import('../views/authorized/resource/Index'),
        beforeEnter: function (to, from, next) {
          const authorized = Vue.prototype.$db.authorized()
          if (authorized) {
            next(true)
          } else {
            next('/login')
          }
        },
        children: [
          {
            path: '',
            component: () => import('../views/authorized/resource/server/Index')
          },
          {
            path: '/resource/share',
            component: () => import('../views/authorized/resource/share/Index')
          },
          {
            path: '/resource/svn',
            component: () => import('../views/authorized/resource/svn/Index')
          }
        ]
      },
      {
        path: '/wireless/filter',
        component: () => import('../views/authorized/wireless/Index'),
        beforeEnter: function (to, from, next) {
          const authorized = Vue.prototype.$db.authorized()
          if (authorized) {
            next(true)
          } else {
            next('/login')
          }
        },
        children: [
          {
            path: '',
            component: () => import('../views/authorized/wireless/AddressFilter')
          },
          {
            path: '/wireless/lease',
            component: () => import('../views/authorized/wireless/AddressLease')
          }
        ]
      },
      {
        path: '/security/account',
        component: () => import('../views/authorized/security/Index'),
        beforeEnter: function (to, from, next) {
          const authorized = Vue.prototype.$db.authorized()
          if (authorized) {
            next(true)
          } else {
            next('/login')
          }
        },
        children: [
          {
            path: '',
            component: () => import('../views/authorized/security/account/Index')
          },
          {
            path: '/security/mail',
            component: () => import('../views/authorized/security/mail/Index')
          }
        ]
      },
      {
        path: '/vpn/pptp',
        component: () => import('../views/authorized/vpn/Index'),
        beforeEnter: function (to, from, next) {
          const authorized = Vue.prototype.$db.authorized()
          if (authorized) {
            next(true)
          } else {
            next('/login')
          }
        },
        children: [
          {
            path: '',
            component: () => import('../views/authorized/vpn/pptp/Index')
          },
          {
            path: '/vpn/openvpn',
            component: () => import('../views/authorized/vpn/openvpn/Index')
          }
        ]
      },
      {
        path: '/cloud/fwd',
        component: () => import('../views/authorized/cloud/fwd/Index')
      },
      {
        path: '/node',
        component: () => import('../views/authorized/node/Index')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes
})

export default router
