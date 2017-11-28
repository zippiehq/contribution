<template>
  <div id="phase1"> 
    <div width="100%" style="margin-top: 0%">
      <md-card>
       <md-card-content> 
        <div align=center v-if="$route.params.step == 1">
        <h1>Step 4/4</h1>
        Your funds were transferred to your Contribution wallet. <a v-bind:href="'https://etherscan.io/tx/' + $data.txtopup" target="_blank">View transaction</a><br>
<br>
        <div v-if="$data.multisigs_found != null && $data.multisigs.length > 0">
            <div v-for="(item, key) in $data.multisigs">
               You now have a <a v-bind:href="'https://etherscan.io/address/' + item.address" target="_blank">Contribution Wallet</a> with {{ item.accountBalance }} ETH in it.<br><br>
            </div>
        </div>             

You do not need to take any further actions for now.<br><br>
When we are ready, we will invite you via email to finalize your contribution: to submit your KYC documents and confirm your contribution transaction.<br><br>
If you want to transfer more funds to your Contribution Wallet, you can start the Phase 1 again from the Contribution main page. <br><br>
        <md-button class="md-raised md-primary" @click="goToZipper()">Go to zipperglobal.com</md-button>

        </div>
        <div align=center v-if="$route.params.step == 0">
         <h1 v-if="$data.multisigs_found == null || $data.multisigs_found == false">Step 2/4</h1>
         <h1 v-if="$data.multisigs_found != null && $data.multisigs_found == true">Step 3/4</h1>
         Selected account: <b>{{ $route.params.account }}</b><br>
         <div v-if="$data.accountBalance >= 0">{{ $data.accountBalance }} ETH currently in this account.</div><br>

         <md-button class="md-raised md-primary" @click="$router.push('/phase1')">Select another account</md-button><br><br>

         <div v-if="$data.multisigs_found == null">
            <img src="static/img/ajax-loader.gif"><br>
            Querying if you have already started the contribution process with this Ethereum address ...
         </div>

         <div align=left v-if="$route.params.account != '' && $data.txhash == null && $data.multisigs_found != null && $data.multisigs_found == false">
            <br>
            You have not yet started the contribution process with this Ethereum address.<br>
            <md-input-container>
                <label>What is your full name? (as in your identification document)</label>
                <md-input v-model="fullname" required></md-input>
            </md-input-container>
            <md-input-container>
                <label>What e-mail can we contact you on? (We will contact you from @zipperglobal.com-mails). This is important to be correct for us to follow up on your contribution.</label>
                <md-input v-model="email" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>Please specify the country you're a resident of</label>
                <md-select name="residentcountry" v-model="residentcountry">
                  <md-option v-for="(item, key) in $root.models.countries" v-bind:value="item.name">{{ item.name }}</md-option>
                </md-select>
            </md-input-container>
            <md-input-container>
                <label>Please specify the country you're a citizen of. If multiple, note this in additional comments.</label>
                <md-select name="citzencountry" v-model="citizencountry">
                  <md-option v-for="(item, key) in $root.models.countries" v-bind:value="item.name">{{ item.name }}</md-option>
                </md-select>
           </md-input-container>
            <md-input-container>
             	<label>Provide in this field any additional comments that help us process your contribution better</label>
                <md-textarea v-model="additional"></md-textarea>
            </md-input-container> 

             <md-checkbox class="md-warn" v-model="resident">I confirm I'm not a resident of any of these countries: Afghanistan, Bosnia and Herzegovina, Central African Republic, China, Cuba, Democratic Republic of the Congo, Democratic People’s Republic of Korea, Eritrea, Ethiopia, Guinea-Bissau, Iran, Iraq, Libya, Lebanon, New Zealand, Somalia, South Sudan, Sudan, Syria, Sri Lanka, Tunisia, Vanuatu, and Yemen.</md-checkbox>
             <md-checkbox class="md-warn" v-model="costs">I accept that creating a Contribution Wallet will cost me approximately {{ $data.cwCost }} ETH in blockchain processing costs.</md-checkbox>
             <md-checkbox class="md-warn" v-model="mutual">I accept that any Ether or other blockchain rights (such as tokens) sent to or stored within the Contribution Wallet is only transferable by approval of the transaction by both yourself and Zipper Global Ltd.</md-checkbox>
             <md-checkbox class="md-warn" v-model="loss">I accept that if I lose access to my private key of the Ethereum address {{ $route.params.account }} I will be unable to access the contents of the Contribution Wallet and neither will Zipper Global Ltd.</md-checkbox>
             <div v-if="this.$data.resident && this.$data.costs && this.$data.mutual && this.$data.loss && this.$data.residentcountry.length > 0 && this.$data.citizencountry.length > 0 && this.$data.email.length > 0 && this.$data.fullname.length > 0">
               <md-button class="md-raised md-primary" @click="createWallet()" >Submit my information to Zipper and create a Contribution Wallet</md-button><br> 
               Pressing this will likely pop-up a request from your Ethereum node or Browser plugin to accept and sign this transaction. Only click once; unless you've rejected the request in your Ethereum environment.
             </div>
             <div v-if="!(this.$data.resident && this.$data.costs && this.$data.mutual && this.$data.loss && this.$data.residentcountry.length > 0 && this.$data.citizencountry.length > 0 && this.$data.email.length > 0 && this.$data.fullname.length > 0)">
               <md-button class="md-raised md-primary" disabled>Submit my information to Zipper and create a Contribution Wallet</md-button><br> 
             </div>
        </div>
        <div v-if="$data.multisigs_found != null && $data.multisigs.length > 0 && $data.txtopup == null">
            <div v-for="(item, key) in $data.multisigs">
               You now have a <a v-bind:href="'https://etherscan.io/address/' + item.address" target="_blank">Contribution Wallet</a> with {{ item.accountBalance }} ETH in it.<br>
               <br>

               Next, transfer funds from your ETH wallet to your Contribution Wallet.
                              
               <md-input-container>
                  <label>Please enter amount of ETH to send to this Contribution Wallet</label>
                  <md-input v-model="topup[item.address]" required></md-input>
               </md-input-container>

               Remember that any Ether or other blockchain rights (such as tokens) sent to or stored within the Contribution Wallet is only transferable by approval of the transaction by both yourself and Zipper Global Ltd.
               Sending funds will incur a transaction cost of roughly {{ $data.txCost }} ETH and take 2-5 minutes to complete. <br>
               <br><br>
               <md-button class="md-raised md-primary" @click="sendFunds(Number($data.topup[item.address]), item.address, $route.params.account)" v-if="$data.txtopup == null && $data.topup[item.address] != null && $data.topup[item.address] > 0">Send {{ Number($data.topup[item.address]) }} ETH to this Contribution Wallet</md-button>
            </div>
        </div>

         <div v-if="$data.multisigs_found != null && $data.multisigs.length > 0 && $data.txtopup != null" style="border-color: black; border-style: solid">
               <img src="static/img/ajax-loader.gif"><br>
               Top-up transaction in progress, do not close this window<br><a v-bind:href="'https://etherscan.io/tx/' + $data.txtopup" target="_blank">View transaction {{ $data.txtopup }}</a><br><br>Please wait..
               </div>
        
        <div v-if="$data.txhash != null" style="border: color: black; border-style: solid">
           <img src="static/img/ajax-loader.gif"><br>
           Contribution Wallet creation transaction is in progress. Transaction hash is <a v-bind:href="'https://etherscan.io/tx/' + $data.txhash" target="_blank">{{ $data.txhash }}</a>. It can take up to 2-5 minutes to confirm, depending on network conditions. Please wait... This page will update automatically.
        </div>


        </div>
        <!--
        <div v-if="$route.params.account != '' && $data.multisigs_found == null"> 
            Querying if you have already started the contribution process with this address.
        </div>
        <div v-if="$route.params.account != '' && $data.txhash == null && $data.multisigs_found != null && $data.multisigs_found == false">
            <br>
            You have not started the contribution process with this address.
            <md-input-container>
                <label>What is your full name?</label>
                <md-input v-model="fullname" required></md-input>
            </md-input-container>
            <md-input-container>
                <label>What e-mail can we contact you on? (We will contact you from @zipperglobal.com-mails). This is important to be correct for us to follow up on your contribution.</label>
                <md-input v-model="email" required></md-input>
            </md-input-container>
            <md-input-container>
                <label>Please specify all the countries that you are resident of, citizen of or currently located in.</label>
                <md-input v-model="countries" required></md-input>
            </md-input-container>
            <md-input-container>
             	<label>Provide in this field any additional comments that help us process your contribution better</label>
                <md-textarea v-model="additional"></md-textarea>
            </md-input-container> 
             <md-checkbox class="md-warn" v-model="resident">I confirm I'm not a resident of any of these countries: Afghanistan, Bosnia and Herzegovina, Central African Republic, China, Cuba, Democratic Republic of the Congo, Democratic People’s Republic of Korea, Eritrea, Ethiopia, Guinea-Bissau, Iran, Iraq, Libya, Lebanon, New Zealand, Somalia, South Sudan, Sudan, Syria, Sri Lanka, Tunisia, Vanuatu, and Yemen.</md-checkbox>
             <md-checkbox class="md-warn" v-model="costs">I accept that creating a Contribution Wallet will cost me approximately {{ $data.cwCost }} ETH in blockchain processing costs.</md-checkbox>
             <md-checkbox class="md-warn" v-model="mutual">I accept that any Ether or other blockchain rights (such as tokens) sent to or stored within the Contribution Wallet is only transferable by approval of the transaction by both yourself and Zipper Global Ltd.</md-checkbox>
             <md-checkbox class="md-warn" v-model="loss">I accept that if I lose access to my private key of the Ethereum address {{ $route.params.account }} I will be unable to access the contents of the Contribution Wallet and neither will Zipper Global Ltd.</md-checkbox>
             <div v-if="this.$data.resident && this.$data.costs && this.$data.mutual && this.$data.loss && this.$data.terms && this.$data.countries.length > 0 && this.$data.email.length > 0 && this.$data.fullname.length > 0">
               <md-button class="md-raised md-primary" @click="createWallet()" >Submit my information to Zipper and create a Contribution Wallet</md-button><br> 
               Pressing this will likely pop-up a request from your Ethereum node or Browser plugin to accept and sign this transaction. Only click once; unless you've rejected the request in your Ethereum environment.
             </div>
             <div v-if="!(this.$data.resident && this.$data.costs && this.$data.mutual && this.$data.loss && this.$data.terms && this.$data.countries.length > 0 && this.$data.email.length > 0 && this.$data.fullname.length > 0)">
               <md-button class="md-raised md-primary" disabled>Submit my information to Zipper and create a Contribution Wallet</md-button><br> 
             </div>
        </div>
        <div v-if="$data.txhash != null">
           <br>
           Contribution Wallet creation transaction is in progress. Transaction hash is <a v-bind:href="'https://etherscan.io/tx/' + $data.txhash" target="_blank">{{ $data.txhash }}</a>. It can take up to 2-5 minutes to confirm, depending on network conditions. Please wait... This page will update automatically.
        </div>
        -->
       </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'phase1account',
  data: () => ({
    account: '',
    accountBalance: -1,
    multisigfactory: null,
    multisigs: [],
    multisigs_found: null,
    safeLow: 1.0,
    safeLowWait: 1.8,
    cwCost: -1,
    txCost: -1,
    fullname: '',
    email: '',
    residentcountry: '',
    citizencountry: '',
    additional: '',
    resident: false,
    costs: false,
    mutual: false,
    loss: false,
    txhash: null,
    topup: {},
    txtopup: null
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
    refreshMultisigBalance: function () {
      for (var i = 0; i < this.$data.multisigs.length; i++) {
        var j = i
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
      this.$data.multisigs_found = null
      this.$data.multisigfactory.getPastEvents('MultisigCreated', {fromBlock: 0, filter: { _sender: this.$route.params.account }}).then((result) => {
        this.$data.multisigs_found = result.length > 0
        for (var i = 0; i < result.length; i++) {
          this.$data.multisigs.push({address: result[i].returnValues._multisig, accountBalance: -1})
          var j = i
          window.WEB3.eth.getBalance(this.$data.multisigs[i].address).then((result) => {
            this.$data.multisigs[j].accountBalance = window.WEB3.utils.fromWei(result, 'ether')
          })
        }
        setTimeout(() => {
          this.refreshMultisigBalance()
        }, 2000)
      })
    },
    createWallet: function () {
      var xmlhttp = new XMLHttpRequest()
      var url = 'http://contribution.zipperglobal.com/submit'
      var obj = this
      xmlhttp.open('POST', url)
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
        }
      }
      xmlhttp.send(JSON.stringify({account: this.$route.params.account,
        fullname: this.$data.fullname,
        email: this.$data.email,
        countries: [this.$data.residentcountry, this.$data.citizencountry],
        additional: this.$data.additional,
        bools: [this.$data.resident, this.$data.costs, this.$data.mutual, this.$data.loss]}))

      this.$data.multisigfactory.methods.createMultisig().send({from: this.$route.params.account, gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei'), gas: 1254611})
      .on('transactionHash', function (hash) {
        console.log('txhash ' + hash)
        obj.$data.txhash = hash
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 5) {
          obj.$data.txhash = null
          obj.checkMultisigs()
          obj.updateBalance()
        }
        console.log('confirmation ' + confirmationNumber + ' receipt ' + receipt)
      })
      .on('error', console.error)
    },
    sendFunds: function (amount, destination, origin) {
      var obj = this
      window.WEB3.eth.sendTransaction({from: origin, to: destination, value: window.WEB3.utils.toWei(amount.toString(), 'ether'), gas: 100000, gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei')})
      .on('transactionHash', function (hash) {
        console.log('sendFunds tx ' + hash)
        obj.$data.txtopup = hash
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        obj.updateBalance()
        obj.$router.push('/phase1-account/' + obj.$route.params.account + '/1')
      })
    },
    goToZipper: function () {
      location.href = 'https://zipperglobal.com'
    }
  },
  beforeMount () {
    this.updateBalance()
    this.checkMultisigs()
    this.$data.cwCost = window.WEB3.utils.fromWei(window.WEB3.utils.toWei((this.$data.safeLow * 1254611).toString(), 'gwei'), 'ether')
    this.$data.txCost = window.WEB3.utils.fromWei(window.WEB3.utils.toWei((this.$data.safeLow * 100000).toString(), 'gwei'), 'ether')
  }
}
</script>

<style>
</style>

