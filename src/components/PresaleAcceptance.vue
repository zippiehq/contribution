<template>
  <div id="phase1"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
        <div align=center>
            <h1>Presale terms change no longer possible</h1>
        </div>
       </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'presaleacceptance',
  data: () => ({
  }),
  methods: {
    submit: function () {
      var xmlhttp = new XMLHttpRequest()
      var url = 'https://api.contribution.zipperglobal.com/submit/presaleacceptterms'
      xmlhttp.open('POST', url)
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
        }
      }
      xmlhttp.send(JSON.stringify({
        email: this.$route.params.email
      }))
    }
  },
  beforeMount () {
    this.submit()
  }
}
</script>

<style>
</style>

