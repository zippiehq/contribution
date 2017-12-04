<template>
  <div id="frontpage"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
        <div align=center>
        <h1>Welcome to the Zipper pre-sale contribution page</h1>

        Thank you for your interest in Zipper project.<br><br>
        <div v-if="$data.protocol == 'http:'">
        This page is using 'http' as to make it possible for the contribution page to connect to a local Ethereum node, if needed, due to Mixed Content browser rules.<br>
        All personal information sent to Zipper is done with 'https'. <a href="https://contribution.zipperglobal.com">You can switch to https if you use the MetaMask browser extension</a><br>
        </div>
        <div v-if="$data.protocol == 'https:'">
        This page is using 'https'. You can only use this page with the MetaMask browser extension.<br>If you need to use a local Ethereum node, <a href="http://contribution.zipperglobal.com">switch to http</a>
        </div>

        <br>
        Please first read <a href="https://zipperglobal.com/presale/" target="_blank">our token pre-sale page before proceeding</a><br><br>
        We will guide you through four steps so you are able to contribute to the project:<br>
         
        <h2>Phase 1</h2>
        1. Select your Ethereum (ETH) account<br>
        2. Enter your personal info such as name and country of residence and create a personal Contribution Wallet<br>
        3. Transfer your desired contribution amount in ETH to your Contribution Wallet (note minimum participation 0.262 ETH = 120 USD)<br>
        4. Receive acknowledgement of transfer done.<br>

        <h2>Phase 2</h2>
        After completing phase 1, when we're ready, we will invite you via email to finalize your contribution: to submit your KYC documents and confirm your contribution transaction.<br><br>
        
        <i>Note: You can cancel your contribution through this site anytime before completing Phase 2. Your Contribution Wallet is an account that requires two parties, you and Zipper Global Ltd., to agree in order to transfer anything from it (you can see the account’s <a href="https://etherscan.io/address/0xe2e36080d4952ae9e90a9bb87ec2c9a1e7781976#code">smart contract code here</a>). Until your contribution is fully processed in Phase 2, no offer, sale, or any form of transaction between you and Zipper Global Ltd. has been entered into.</i><br>

        <md-checkbox class="md-warn" v-model="terms"></md-checkbox>I have read and agree to the <a href="https://zipperglobal.com/contribution-terms-conditions/" target="_blank">Zipper Contribution Terms &amp; Conditions</a> and understand the risks mentioned therein<br>
       
        <md-button v-if="$data.terms" class="md-raised md-primary" @click="$router.push('/phase1')">Start phase 1</md-button>
        <md-button v-if="!$data.terms" class="md-raised md-primary" disabled>Start phase 1</md-button>
        <br>
        </div>

       </md-card-content>
      </md-card>
    </div>
    <div align=right>v1.2.3</div>
  </div>
</template>

<script>

export default {
  name: 'frontpage',
  data: () => ({
    terms: false,
    protocol: location.protocol
  })
}
</script>

<style>
</style>

