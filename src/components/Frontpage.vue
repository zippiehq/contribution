<template>
  <div id="frontpage"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
        <div align=center>
        <h1>Welcome to the Zipper pre-sale contribution page</h1>

        Thank you for your interest in Zipper project.<br><br>
        <div v-if="$data.protocol == 'http:'">
        This page is using 'http' as to make it possible for the contribution page to connect to a local Ethereum node ONLY, due to Mixed Content browser rules.<br>
        All personal information sent to Zipper is done with 'https'. <a href="https://contribution.zipperglobal.com">Switch to https if you use the MetaMask browser extension or an web Ethereum wallet</a><br>
        </div>
        <div v-if="$data.protocol == 'https:'">
        This page is using 'https'. You can only use this page with the MetaMask browser extension or a web Ethereum wallet.<br>If you need to use a local Ethereum node, <a href="http://contribution.zipperglobal.com">switch to http</a>
        </div>

        <br>
        Please first read <a href="https://zipperglobal.com/presale/" target="_blank">our token pre-sale page before proceeding</a><br><br>
        <b><a href="/#/frontpage-old">If you have already started your contribution with the old system (before 6 December 2017), please click here to continue</a></b><br><br>
        We will guide you through five steps so you are able to contribute to the project:<br>
         
        <h2>Phase 1</h2>
        1. Select or enter your Ethereum (ETH) account<br>
        2. Choose that you haven't submitted your information yet<br>
        3. Create and download a temporary Ethereum account ('Contribution wallet')<br>
        4. Enter personal information, provide scans of ID and a selfie of yourself with that ID and how much you'd like to contribute; and if not using a web wallet, accept transfer.<br>
        5. Receive acknowledgement of transfer done or information where to transfer funds with your web wallet.

        <h2>Phase 2</h2>
        After completing phase 1, when we're ready, we will invite you via email to finalize your contribution through transferring control of the Contribution Wallet to Zipper<br><br>
        
        <i>Note: You can cancel your contribution through this site anytime before completing Phase 2. Until you have completed Phase 2, no offer, sale, or any form of transaction between you and Zipper Global Ltd. has been entered into.</i><br>

        <md-checkbox class="md-warn" v-model="terms"></md-checkbox>I have read and agree to the <a href="https://zipperglobal.com/contribution-terms-conditions/" target="_blank">Zipper Contribution Terms &amp; Conditions</a> and understand the risks mentioned therein<br>
       
        <md-button v-if="$data.terms" class="md-raised md-primary" @click="$router.push('/phase1new')">Start phase 1</md-button>
        <md-button v-if="!$data.terms" class="md-raised md-primary" disabled>Start phase 1</md-button>
        <br>
        </div>

       </md-card-content>
      </md-card>
    </div>
    <div align=right>v2.0.1</div>
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

