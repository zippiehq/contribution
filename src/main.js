// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
var VueMaterial = require('vue-material')
import 'vue-material/dist/vue-material.css'
import App from './App'
import router from './router'
import models from './models'
var Web3 = require('web3')

Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
  primary: {
    color: 'cyan',
    hue: 800
  },
  accent: {
    color: 'orange',
    hue: 400
  },
  warn: {
    color: 'orange',
    hue: 900
  },
  background: {
    color: 'white',
    hue: 900
  }
})

Vue.material.registerTheme('whiteday', {
  primary: {
    color: 'grey',
    hue: 0
  },
  accent: {
    color: 'orange',
    hue: 400
  },
  warn: {
    color: 'orange',
    hue: 900
  },
  background: {
    color: 'grey',
    hue: 100
  }
})

router.beforeEach(function (to, from, next) {
  window.scrollTo(0, 0)
  next()
})

window.WEB3 = new Web3(Web3.givenProvider || 'ws://localhost:8546')

var vue = new Vue({
  el: '#app',
  data: { models: models },
  router,
  template: '<App/>',
  components: { App }
})

vue
