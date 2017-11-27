import Vue from 'vue'
import Router from 'vue-router'
import Frontpage from '@/components/Frontpage'
import Phase1 from '@/components/Phase1'
import Phase1Account from '@/components/Phase1Account'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Frontpage',
      component: Frontpage
    },
    {
      path: '/phase1',
      name: 'Phase1',
      component: Phase1
    },
    {
      path: '/phase1-account/:account/:step',
      name: 'Phase1Account',
      component: Phase1Account
    }
  ]
})
