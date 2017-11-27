<template>
  <div id="frontpage"> 
    <div width="100%" style="margin-top: 0%">
      <md-card>
       <md-card-content> 
        <div align=center>
        <h1>Welcome to the Zipper pre-sale contribution page</h1>
        
        Thank you for your interest in Zipper project. We will guide you through a few steps so you are able to contribute to the project:<br>
         
        <h2>Phase 1</h2>
        1. Select your Ethereum (ETH) account and create a personal Contribution Wallet<br>
        2. Enter your personal info such as name and country of residence<br>
        3. Transfer your desired contribution amount in ETH to your Contribution Wallet<br>

        <h2>Phase 2</h2>
        After completing phase 1, when we're ready, we will invite you via email to finalize your contribution: to submit your KYC documents and confirm your contribution transaction.<br><br>
        
        <i>Note: You can cancel your contribution through this site anytime before completing Phase 2. Your Contribution Wallet is an account that requires two parties, you and Zipper Global Ltd., to agree in order to transfer anything from it (you can see the account’s <a href="https://etherscan.io/address/0xe2e36080d4952ae9e90a9bb87ec2c9a1e7781976#code">smart contract code here</a>). Until your contribution is fully processed in Phase 2, no offer, sale, or any form of transaction between you and Zipper Global Ltd. has been entered into.</i><br>

        <md-checkbox class="md-warn" v-model="terms">I agree to the <a href="/#terms" target="_blank">Zipper Contribution Terms &amp; Conditions</a></md-checkbox><br>
      
        <md-button v-if="$data.terms" class="md-raised md-primary" @click="$router.push('/phase1')">Start phase 1</md-button>
        <md-button v-if="!$data.terms" class="md-raised md-primary" disabled>Start phase 1</md-button>
        <br>
        
        </div>

       </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'frontpage',
  data: () => ({
    terms: false
  })
}
</script>

<style>
</style>

