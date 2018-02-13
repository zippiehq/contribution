<template>
  <div id="frontpage"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
        <div align=center>
             <md-button @click="doOnFido()">Test</md-button>
<!-- At the bottom of your page, you need an empty element where the
verification component will be mounted. -->
<div id='onfido-mount'></div>


        </div>
       </md-card-content>
      </md-card>
    </div>
    <div align=right>v3.0.2</div>
  </div>
</template>

<script>

export default {
  name: 'frontpage',
  data: () => ({
    terms: false,
    protocol: location.protocol
  }),
  methods: {
    doOnFido: function () {
      console.log('hello')
      var url = 'https://api.contribution.zipperglobal.com/submit/create_applicant'
      var request = new XMLHttpRequest()
      request.open('GET', url, true)
      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText)
          console.log('got data' + data)
          window.ONFIDO.init({
            // the JWT token that you generated earlier on
            token: data.token,
            // id of the element you want to mount the component on
            containerId: 'onfido-mount',
            onComplete: function () {
              console.log('everything is complete')
              // You can now trigger your backend to start a new check
            }
          })
        } else {
          console.log(request)
        }
      }
      request.send()
    }
  }
}
</script>

<style>
</style>

