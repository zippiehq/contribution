<template>
  <div id="kycaccount"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
       <div v-if="$route.params.step == 2" align=center>
       <h1>Step 3/3</h1>
       <h2>Success!</h2>
       <br>
       Your KYC information and contribution request has been successfully submitted to Zipper. <a v-bind:href="'https://etherscan.io/tx/' + $data.tx" target="_blank">View transaction.</a>
       <br><br>
       <b>You do not need to take any further actions.<br>When we're ready, we will confirm your contribution by
       email.</b><br>
       If there are issues with your information or transaction, don’t worry, we will contact you.<br><br>

       <md-button class="md-raised md-primary" @click="goToZipper()">Go to zipperglobal.com</md-button>

       </div>
       <div v-if="$route.params.step == 0">

       <h1>Step 1/3</h1>
       
       Please submit your identifying information. If you have any problems whatsoever, please <a href="https://zipperglobal.com/contact/">contact us.</a><br>       

       We need some additional information in order to process your contribution for regulatory purposes. We'll be in touch if we have difficulties processing your information.<br>
           <md-input-container>
                <label>Street address</label>
                <md-input v-model="address" required></md-input>
            </md-input-container>
           <md-input-container>
                <label>ZIP/Postal code</label>
                <md-input v-model="postal" required></md-input>
            </md-input-container>
           <md-input-container>
                <label>City</label>
                <md-input v-model="city" required></md-input>
            </md-input-container>
           <md-input-container>
                <label>Country</label>
                <md-input v-model="country" required></md-input>
            </md-input-container>

            <md-input-container>
            <label>A photo or scan of your identification paper (national ID or Passport, PDF/JPG/PNG format preferred)</label>
            <md-file v-model="idscan" @selected="setFile($event, 'idscan_data')" />
            </md-input-container>
 
            <md-input-container>
             <label>A selfie of you holding that particular identification paper (JPG/PNG format preferred)</label>
             <md-file v-model="selfie" @selected="setFile($event, 'selfie_data')" />
            </md-input-container>
            <md-checkbox v-model="kycaccept"></md-checkbox>I accept that Zipper may use and retain this information for processing my contribution for regulatory purposes<br>
            <md-button v-if="this.$data.kycaccept && this.$data.address.length > 0 & this.$data.postal.length > 0 && this.$data.city.length > 0 && this.$data.country.length > 0 && this.$data.selfie_data.length > 0 && this.$data.idscan_data.length > 0" class="md-primary md-raised" @click="submit">Submit my identifying information and go to next step</md-button>
            <md-button disabled v-if="!(this.$data.kycaccept && this.$data.address.length > 0 & this.$data.postal.length > 0 && this.$data.city.length > 0 && this.$data.country.length > 0 && this.$data.selfie_data.length > 0 && this.$data.idscan_data.length > 0)" class="md-primary md-raised" @click="submit">Submit my identifying information and go to next step</md-button>
         </div>
         <div v-if="$route.params.step == 1" align=center>
         <h1>Step 2/3</h1>
         Next, please confirm your contribution.<br><br>By confirming, you permit Zipper to transfer the full contribution amount in your contribution wallet into its <a href="https://etherscan.io/address/0x21EF24FFB2116F44E7918A80CEA4f52a2EA72B17" target="_blank">Ethereum accounts</a> and you will no longer be able to withdraw it.<br><br>
                 
         <div v-if="$data.multisigs_found == null">
            <img src="static/img/ajax-loader.gif"><br>
            Locating your contribution wallet..
         </div>
         
         <div v-if="$data.multisigs_found != null && $data.multisigs.length > 0 && $data.tx.length == 0">
            <div v-for="(item, key) in $data.multisigs">
                Your contribution amount: <b>{{ item.accountBalance }} ETH</b><br><br>
                
                Permitting Zipper to transfer will incur a transaction cost of roughly {{ $data.txCost }} ETH and take 2-5 minutes to complete.<br>Current balance of your Ethereum account: {{ $data.accountBalance }} ETH<br><br>
                <md-button v-if="$data.ongoingTx == false" class="md-raised md-primary" @click="allowTx(item.contract, item.accountBalance)">Permit Zipper to transfer {{ item.accountBalance }} ETH from my contribution wallet</md-button><br>
                <md-button v-if="$data.ongoingTx == true" class="md-raised md-primary">Requesting to sign transaction..</md-button><br>
                Pressing this will likely pop-up a request from your Ethereum node or MetaMask extension to accept and sign this transaction. 
           </div>
         </div>

         <div v-if="$data.multisigs_found != null && $data.multisigs.length > 0 && $data.tx.length > 0" style="border-color: black; border-style: solid">
               <img src="static/img/ajax-loader.gif"><br>
               Permit transaction in progress, do not close this window<br><a v-bind:href="'https://etherscan.io/tx/' + $data.tx" target="_blank">View transaction</a><br><br>You do not need to wait for this transaction; it may be quite slow due to Ethereum network conditions. We'll contact you with confirmation eventually.<br>
         </div>

         </div>
       </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'kycaccount',
  data: () => ({
    selfie: null,
    selfie_data: '',
    idscan: null,
    idscan_data: '',
    safeLow: 7.0,
    country: '',
    city: '',
    postal: '',
    address: '',
    kycaccept: false,
    multisigfactory: null,
    multisigs: [],
    multisigs_found: null,
    ongoingTx: false,
    txCost: false,
    tx: '',
    accountBalance: -1
  }),
  methods: {
    updateBalance: function () {
      window.WEB3.eth.getBalance(this.$route.params.account).then((result) => {
        this.$data.accountBalance = window.WEB3.utils.fromWei(result, 'ether')
        setTimeout(() => {
          this.updateBalance()
        }, 2000)
      })
    },
    allowTx: function (multisigcontract, howmuch) {
      var obj = this
      multisigcontract.methods.submitTransaction('0x21EF24FFB2116F44E7918A80CEA4f52a2EA72B17', window.WEB3.utils.toWei(howmuch, 'ether'), '0x').send({from: this.$route.params.account, gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei'), gas: 300000})
      .on('transactionHash', function (hash) {
        obj.$data.ongoingTx = false
        obj.$data.tx = hash
        console.log('txhash ' + hash)

        var xmlhttp = new XMLHttpRequest()
        var url = 'https://api.contribution.zipperglobal.com/submit/confirmtx'
        xmlhttp.open('POST', url)
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          }
        }
        xmlhttp.send(JSON.stringify({account: obj.$route.params.account,
          howmuch: howmuch,
          tx: hash}))
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 5) {
          obj.$router.push('/kyc-account/' + obj.$route.params.account + '/2')
        }
        console.log('confirmation ' + confirmationNumber + ' receipt ' + receipt)
      })
      .on('error', function (error) {
        obj.$data.ongoingTx = false
        console.log(error)
      })
    },
    setFile: function (e, pic) {
      const file = e[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const binaryString = e.target.result
          this.$data[pic] = btoa(binaryString)
          console.log(this.$data[pic])
        }
        reader.readAsBinaryString(file)
      }
    },
    submit: function () {
      var xmlhttp = new XMLHttpRequest()
      var url = 'https://api.contribution.zipperglobal.com/submit/kyc'
      let obj = this
      xmlhttp.open('POST', url)
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          obj.$router.push('/kyc-account/' + obj.$route.params.account + '/1')
        }
      }
      xmlhttp.send(JSON.stringify({account: this.$route.params.account,
        address: this.$data.address,
        postal: this.$data.postal,
        city: this.$data.city,
        country: this.$data.country,
        kycaccept: this.$data.kycaccept,
        idscan_data: this.$data.idscan_data,
        selfie_data: this.$data.selfie_data}))
    },
    refreshMultisigBalance: function () {
      for (var i = 0; i < this.$data.multisigs.length; i++) {
        let j = i
        window.WEB3.eth.getBalance(this.$data.multisigs[i].address).then((result) => {
          this.$data.multisigs[j].accountBalance = window.WEB3.utils.fromWei(result, 'ether')
        })
      }
    },
    checkMultisigs: function () {
      if (this.$data.multisigfactory == null) {
        var multisigfactoryabi = JSON.parse('[{"constant":false,"inputs":[{"name":"_newZipper","type":"address"}],"name":"changeZipper","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"createMultisig","outputs":[{"name":"_multisig","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_zipper","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_multisig","type":"address"},{"indexed":true,"name":"_sender","type":"address"},{"indexed":true,"name":"_zipper","type":"address"}],"name":"MultisigCreated","type":"event"}]')
        this.$data.multisigfactory = new window.WEB3.eth.Contract(multisigfactoryabi, '0xe2E36080d4952ae9E90a9Bb87eC2C9a1e7781976')
      }
      var multisigabi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"isConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmationCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactions","outputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"},{"name":"executed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"uint256"},{"name":"to","type":"uint256"},{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionIds","outputs":[{"name":"_transactionIds","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmations","outputs":[{"name":"_confirmations","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"uint256"}],"name":"changeRequirement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_OWNER_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"required","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"newOwner","type":"address"}],"name":"replaceOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Revocation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Submission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Execution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerAddition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerRemoval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"required","type":"uint256"}],"name":"RequirementChange","type":"event"}]')
      this.$data.multisigs_found = null
      this.$data.multisigs = []
      this.$data.multisigfactory.getPastEvents('MultisigCreated', {fromBlock: 0, filter: { _sender: this.$route.params.account }}).then((result) => {
        this.$data.multisigs_found = result.length > 0
        for (var i = 0; i < result.length; i++) {
          this.$data.multisigs.push({address: result[i].returnValues._multisig, accountBalance: -1, contract: new window.WEB3.eth.Contract(multisigabi, result[i].returnValues._multisig), waitingMSig: []})
          let j = i

          window.WEB3.eth.getBalance(this.$data.multisigs[i].address).then((result) => {
            this.$data.multisigs[j].accountBalance = window.WEB3.utils.fromWei(result, 'ether')
          })
        }
        setTimeout(() => {
          this.refreshMultisigBalance()
        }, 2000)
      })
    },
    goToZipper: function () {
      location.href = 'https://zipperglobal.com'
    }
  },
  beforeMount () {
    this.updateBalance()
    this.checkMultisigs()
    this.$data.txCost = Number(window.WEB3.utils.fromWei(window.WEB3.utils.toWei((this.$data.safeLow * 200000).toString(), 'gwei'), 'ether')).toFixed(5)
  }
}
</script>

<style>
</style>

