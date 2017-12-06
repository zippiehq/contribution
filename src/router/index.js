import Vue from 'vue'
import Router from 'vue-router'
import Frontpage from '@/components/Frontpage'
import FrontpageOld from '@/components/FrontpageOld'
import Phase1 from '@/components/Phase1'
import Phase1New from '@/components/Phase1New'
import Phase2New from '@/components/Phase2New'
import Phase1Account from '@/components/Phase1Account'
import Phase1NewAccount from '@/components/Phase1NewAccount'
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
      path: '/frontpage-old',
      name: 'FrontpageOld',
      component: FrontpageOld
    },
    {
      path: '/phase1',
      name: 'Phase1',
      component: Phase1
    },
    {
      path: '/phase2new',
      name: 'Phase2',
      component: Phase2New
    },
    {
      path: '/phase1new',
      name: 'Phase1New',
      component: Phase1New
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
      path: '/phase1new-account/:account/:step',
      name: 'Phase1NewAccount',
      component: Phase1NewAccount
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
