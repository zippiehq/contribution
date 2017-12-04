<template>
  <div id="kyc"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
        <div align=center>

         <h1>Welcome back to finalize your Zipper pre-sale contribution</h1>

        <div v-if="$data.protocol == 'https:'">
         This site only works with MetaMask. If you use a local Ethereum node, please switch to <a href="http://contribution.zipperglobal.com/">http</a>.<br>
        </div>

         To finalize your contribution to the Zipper project, please proceed with the last two steps:<br><br>
         1. Submit your identifying information (KYC/'Know Your Customer') - this is a regulatory requirement imposed on us.<br>
         2. Confirm your contribution amount and give permission for Zipper to transfer funds from your Contribution Wallet to Zipper Project Wallet<br><br>

         <div v-if="$root.models.accounts == null">Unable to connect to an Ethereum node, or we're still connecting. Please install an Ethereum client such as <a href="https://parity.io" target="_blank">Parity</a> or if you use Chrome browser, <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">the MetaMask browser extension</a> and <a href="/">reload this page</a></div>

         <div v-if="$root.models.accounts != null && $root.models.accounts.length == 0" style="background: pink">Unable to locate any Ethereum accounts.<br><br>If you're using MetaMask, please unlock your MetaMask account by clicking the MetaMask icon in your browser..<br>This error may also disappear in a few seconds if your Ethereum node responds.<br><br><a href="https://zipperglobal.com/contact/" target="_blank">Contact us</a> if you have any problems.</div>

         <div v-if="$root.models.accounts != null && $root.models.accounts.length > 0">
           <md-input-container>
             <label for="account">Click to pick your Ethereum account</label> 
             <md-select name="account" id="account" v-model="account" @selected="accountSelected">
               <md-option v-for="(item, key) in $root.models.accounts" v-bind:value="item">{{ item }}</md-option>
             </md-select>
           </md-input-container>
         </div>
        </div>
       </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'kyc',
  data: () => ({
    account: '',
    protocol: location.protocol
  }),
  methods: {
    accountSelected: function (value) {
      this.$router.push('/kyc-account/' + value + '/0')
    },
    refreshAccounts: function () {
      window.WEB3.eth.getAccounts().then((result) => {
        this.$root.models.accounts = result
        setTimeout(() => {
          this.refreshAccounts()
        }, 2000)
      })
    }
  },
  beforeMount () {
    this.refreshAccounts()
  }

}
</script>

<style>
</style>

