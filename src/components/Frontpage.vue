<template>
  <div id="frontpage"> 
    <div width="100%" style="margin-top: 0%">
      <md-card>
       <md-card-content> 
        <div>
        <h1>Welcome to Zipper Contribution Page</h1>
        In order to contribute to the Zipper project, you will need to set up a
        <a href="https://etherscan.io/address/0xe2e36080d4952ae9e90a9bb87ec2c9a1e7781976#code" target="_blank">Contribution Wallet</a> and transfer some funds into it. A contribution wallet is an account that requires two parties, you and Zipper Global Ltd., to agree in order to transfer anything
from. When funds have been transferred, when we're ready, we'll contact you on your e-mail to re-visit this site, to further process your contribution. Until your contribution is fully processed, no offer, sale, or any form of transaction between you and Zipper Global Ltd. has been entered into.
        </div>
        <br>
        <div v-if="$root.models.accounts == null">Unable to connect to an Ethereum node, or we're still connecting. Please install an Ethereum client such as <a href="https://parity.io">Parity</a> or if you use Chrome browser, <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">the MetaMask browser extension</a>
        and <a href="/">reload this page</a></div>
        <div v-if="$root.models.accounts != null && $root.models.accounts.length == 0">Unable to locate any accounts. If you're using metamask, please unlock (click MetaMask icon). This may also disappear in a few seconds as your Ethereum node responds</div>
        <div v-if="$root.models.accounts != null && $root.models.accounts.length > 0">
           <md-input-container>
             <label for="account">Click to pick your Ethereum account</label> 
             <md-select name="account" id="account" v-model="account" @selected="accountChanged">
               <md-option v-for="item in $root.models.accounts" v-bind:value="item">{{ item }}</md-option>
             </md-select>
           </md-input-container>
        </div>
        <div v-if="$data.account != ''">
            {{ $data.accountBalance }} ETH currently in this account.
        </div>
        <div v-if="$data.account != '' && $data.multisigs_found == null"> 
            Querying if you have already started the contribution process with this address.
        </div>
        <div v-if="$data.account != '' && $data.txhash == null && $data.multisigs_found != null && $data.multisigs_found == false">
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
             <md-checkbox class="md-warn" v-model="loss">I accept that if I lose access to my private key of the Ethereum address {{ $data.account }} I will be unable to access the contents of the Contribution Wallet and neither will Zipper Global Ltd.</md-checkbox>
             <md-checkbox class="md-warn" v-model="terms">I agree to the <a href="/#terms" target="_blank">Zipper Contribution Terms</a></md-checkbox><br>
             <div v-if="this.$data.resident && this.$data.costs && this.$data.mutual && this.$data.loss && this.$data.terms && this.$data.countries.length > 0 && this.$data.email.length > 0 && this.$data.fullname.length > 0">
               <md-button class="md-raised md-primary" @click="createWallet()" >Submit my information to Zipper and create a Contribution Wallet</md-button><br> 
               Pressing this will likely pop-up a request from your Ethereum node or Browser plugin to accept and sign this transaction. Only click once; unless you've rejected the request in your Ethereum environment.
             </div>
             <div v-if="!(this.$data.resident && this.$data.costs && this.$data.mutual && this.$data.loss && this.$data.terms && this.$data.countries.length > 0 && this.$data.email.length > 0 && this.$data.fullname.length > 0)">
               <md-button class="md-raised md-primary" disabled>Submit my information to Zipper and create a Contribution Wallet</md-button><br> 
             </div>
        </div>
        <div v-if="$data.account != '' && $data.multisigs_found != null && $data.multisigs.length > 0">
            <div v-for="item in $data.multisigs">
               <h2>Contribution Wallet {{ item.returnValues._multisig }}</h2>
               <div v-if="item.accountBalance > 0">Current balance in wallet: {{ item.accountBalance }}. We will be on touch on your e-mail about your contribution when we're ready. You do not need to take any further actions.</div>
               <div v-if="item.accountBalance == 0">Wallet is currently empty. Please top up the Contribution Wallet. When we're ready, we'll be in touch after this wallet contains funds.</div>
               <md-input-container>
                  <label>Please enter amount of ETH to send to this Contribution Wallet</label>
                  <md-input v-model="topup[item.returnValues._multisig]" required></md-input>
               </md-input-container>

               Remember that any Ether or other blockchain rights (such as tokens) sent to or stored within the Contribution Wallet is only transferable by approval of the transaction by both yourself and Zipper Global Ltd.
               Sending funds will incur a transaction cost of roughly {{ $data.txCost }} ETH and take 2-5 minutes to complete. <br>
              
               <div v-if="$data.txtopup[item.returnValues._multisig] != null">Top-up transaction in progress (Transaction hash: <a v-bind:href="'https://etherscan.io/tx/' + $data.txtopup[item.returnValues._multisig]" target="_blank">{{ $data.txtopup[item.returnValues._multisig] }}</a>.</div>
               <md-button class="md-raised md-primary" @click="sendFunds(Number($data.topup[item.returnValues._multisig]), item.returnValues._multisig, $data.account)" v-if="$data.topup[item.returnValues._multisig] != null && $data.topup[item.returnValues._multisig] > 0">Send {{ Number($data.topup[item.returnValues._multisig]) }} ETH to this Contribution Wallet</md-button>
            </div>
        </div>
        <div v-if="$data.txhash != null">
           <br>
           Contribution Wallet creation transaction is in progress. Transaction hash is <a v-bind:href="'https://etherscan.io/tx/' + $data.txhash" target="_blank">{{ $data.txhash }}</a>. It can take up to 2-5 minutes to confirm, depending on network conditions. Please wait... This page will update automatically.
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
    account: '',
    accountBalance: -1,
    multisigfactory: null,
    multisigs: [],
    multisigs_found: null,
    safeLow: 0.5,
    safeLowWait: 2.7,
    cwCost: -1,
    txCost: -1,
    fullname: '',
    email: '',
    countries: '',
    additional: '',
    resident: false,
    costs: false,
    mutual: false,
    loss: false,
    terms: false,
    txhash: null,
    topup: {},
    txtopup: {}
  }),
  methods: {
    refreshAccounts: function () {
      window.WEB3.eth.getAccounts().then((result) => {
        this.$root.models.accounts = result
        setTimeout(() => {
          this.refreshAccounts()
          this.reloadMultisigBalance()
        }, 2000)
      })
    },
    reloadMultisigBalance: function () {
      this.$data.multisigs.forEach(function (item) {
        window.WEB3.eth.getBalance(item.returnValues._multisig).then((result) => {
          item.accountBalance = window.WEB3.utils.fromWei(result, 'ether')
        })
      })
    },
    accountChanged: function (value) {
      this.$data.txhash = null
      window.WEB3.eth.getBalance(value).then((result) => {
        this.$data.accountBalance = window.WEB3.utils.fromWei(result, 'ether')
      })
      if (this.$data.multisigfactory == null) {
        var multisigfactoryabi = JSON.parse('[{"constant":false,"inputs":[{"name":"_newZipper","type":"address"}],"name":"changeZipper","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"createMultisig","outputs":[{"name":"_multisig","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_zipper","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_multisig","type":"address"},{"indexed":true,"name":"_sender","type":"address"},{"indexed":true,"name":"_zipper","type":"address"}],"name":"MultisigCreated","type":"event"}]')
        this.$data.multisigfactory = new window.WEB3.eth.Contract(multisigfactoryabi, '0xe2E36080d4952ae9E90a9Bb87eC2C9a1e7781976')
      }
      this.$data.multisigs_found = null
      this.$data.multisigfactory.getPastEvents('MultisigCreated', {fromBlock: 0, filter: { _sender: value }}).then((result) => {
        this.$data.multisigs_found = result.length > 0
        this.$data.multisigs = result
        this.$data.multisigs.forEach(function (item) {
          item.accountBalance = -1
        })
        this.reloadMultisigBalance()
      })
      /* XXX fixme
      var xmlhttp = new XMLHttpRequest()
      var url = 'https://ethgasstation.info/json/ethgasAPI.json'
      var obj = this
      xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          var myArr = JSON.parse(this.responseText)
          obj.$data.safeLow = myArr.safeLow + 0.25
          obj.$data.safeLowWait = myArr.safeLowWait
        }
      }
      xmlhttp.open('GET', url, true)
      xmlhttp.send()
      */
      this.$data.cwCost = window.WEB3.utils.fromWei(window.WEB3.utils.toWei((this.$data.safeLow * 1254611).toString(), 'gwei'), 'ether')
      this.$data.txCost = window.WEB3.utils.fromWei(window.WEB3.utils.toWei((this.$data.safeLow * 100000).toString(), 'gwei'), 'ether')
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
      xmlhttp.send(JSON.stringify({account: this.$data.account,
        fullname: this.$data.fullname,
        email: this.$data.email,
        countries: this.$data.countries,
        additional: this.$data.additional,
        bools: [this.$data.resident, this.$data.costs, this.$data.mutual, this.$data.terms]}))

      this.$data.multisigfactory.methods.createMultisig().send({from: this.$data.account, gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei'), gas: 1254611})
      .on('transactionHash', function (hash) {
        console.log('txhash ' + hash)
        obj.$data.txhash = hash
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 5) {
          obj.accountChanged(obj.$data.account)
        }
        console.log('confirmation ' + confirmationNumber + ' receipt ' + receipt)
      })
      .on('error', console.error)
    },
    sendFunds: function (amount, destination, origin) {
      var obj = this
      window.WEB3.eth.sendTransaction({from: origin, to: destination, value: window.WEB3.utils.toWei(amount.toString(), 'ether'), gas: 100000, gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei')})
      .on('transactionHash', function (hash) {
        obj.$data.txtopup[destination] = hash
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        obj.$data.txtopup[destination] = null
        obj.reloadMultisigBalance()
        obj.accountChanged(obj.$data.account)
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

