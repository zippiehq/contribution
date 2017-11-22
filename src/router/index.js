import Vue from 'vue'
import Router from 'vue-router'
import Frontpage from '@/components/Frontpage'
import Create from '@/components/Create'
import Explore from '@/components/Explore'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Frontpage',
      component: Frontpage
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/explore',
      name: 'Explore',
      component: Explore
    }
  ]
})
