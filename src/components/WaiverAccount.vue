<template>
  <div id="waiveraccount"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
           "{{ this.statement() }}"<br>
           <md-button class="md-raised md-primary" @click="sign">Sign this statement with my Ethereum private key and submit it to Zipper</md-button><br>
           <div v-if="$data.sig.length > 0">Signature submitted: {{ sig }}</div>
       </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'waiveraccount',
  data: () => ({
    sig: ''
  }),
  computed: {
/*    statement: function () {
      return 'I, the owner of Ethereum account ' + this.$route.params.account + ' accept that my Contribution to Zipper will not be refunded in the event that the presale Minimum Cap of 0.5M USD is not met, provided that when Zipper platform is live, I will receive 30% additional ZIP tokens from Zipper together with my non-bonus ZIP tokens as to compensate for my additional risk'
    } */
  },
  methods: {
    statement: function () {
      return 'I, the owner of Ethereum account ' + this.$route.params.account + ' accept that my Contribution to Zipper will not be refunded in the event that the presale Minimum Cap of 0.5M USD is not met, provided that when Zipper platform is live, I will receive 30% additional ZIP tokens from Zipper together with my non-bonus ZIP tokens as to compensate for my additional risk'
    },
    sign: function () {
      let obj = this
      window.WEB3.eth.personal.sign(this.statement(), this.$route.params.account).then(function (result) {
        obj.$data.sig = result
        var xmlhttp = new XMLHttpRequest()
        var url = 'https://api.contribution.zipperglobal.com/submit/waiver'
        xmlhttp.open('POST', url)
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          }
        }
        xmlhttp.send(JSON.stringify({account: obj.$route.params.account,
          signature: result,
          statement: obj.statement()}))
      })
    }
  },
  beforeMount () {
  }
}
</script>

<style>
</style>

