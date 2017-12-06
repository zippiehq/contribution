<template>
  <div id="phase1"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
        <div align=center>
         <h1>Step 1/4</h1>
         <div v-if="$root.models.accounts == null">Unable to connect to an Ethereum node, or we're still connecting.<br>
         <md-input-container>
            <label>If you are using an online Ethereum wallet such as MyEtherWallet, please paste your Ethereum account address here (NOT YOUR PRIVATE KEY).</label>
            <md-input v-model="address" required></md-input>
         </md-input-container>
         <md-button class="md-primary md-raised" @click="proceed()">Proceed to next step</md-button>
        </div>

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
  name: 'phase1new',
  data: () => ({
    account: '',
    address: ''
  }),
  methods: {
    proceed: function (value) {
      if (!window.WEB3.utils.isAddress(this.$data.address)) {
        alert('Cannot proceed, invalid address')
      } else {
        window.WEB3.setProvider(new window.WEB3IMPORT.providers.HttpProvider('https://contribution.zipperglobal.com/eth'))
        this.$router.push('/phase1new-account/' + window.WEB3.utils.toChecksumAddress(this.$data.address) + '/0')
        this.$root.models.remoteweb3 = true
      }
    },
    accountSelected: function (value) {
      this.$router.push('/phase1new-account/' + value + '/0')
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

