import Vue from 'vue'
import Router from 'vue-router'
import Frontpage from '@/components/Frontpage'
import Phase1 from '@/components/Phase1'
import Phase1Account from '@/components/Phase1Account'
import Admin from '@/components/Admin'
import Waiver from '@/components/Waiver'
import WaiverAccount from '@/components/WaiverAccount'
import Kyc from '@/components/Kyc'
import KycAccount from '@/components/KycAccount'

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
      path: '/admin/:account',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/phase1-account/:account/:step',
      name: 'Phase1Account',
      component: Phase1Account
    },
    {
      path: '/waiver',
      name: 'Waiver',
      component: Waiver
    },
    {
      path: '/waiver-account/:account',
      name: 'WaiverAccount',
      component: WaiverAccount
    },
    {
      path: '/kyc',
      name: 'Kyc',
      component: Kyc
    },
    {
      path: '/kyc-account/:account/:step',
      name: 'KycAccount',
      component: KycAccount
    }
  ]
})
