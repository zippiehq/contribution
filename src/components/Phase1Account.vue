<template>
  <div id="phase1"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
        <div align=center v-if="$route.params.step == 1">
        <h1>Step 4/4</h1>
        <b>Success!</b>
        Your funds were transferred to your Contribution wallet. <a v-bind:href="'https://etherscan.io/tx/' + $data.txtopup" target="_blank">View transaction</a><br>
<br>
        <div v-if="$data.multisigs_found != null && $data.multisigs.length > 0">
            <div v-for="(item, key) in $data.multisigs">
               You now have a <a v-bind:href="'https://etherscan.io/address/' + item.address" target="_blank">Contribution Wallet</a> with {{ item.accountBalance }} ETH in it.<br><br>
            </div>
        </div>             

<b>You do not need to take any further actions for now.</b><br><br>
Soon, we will invite you via email to finalize your contribution: to submit your KYC documents and confirm your contribution transaction.<br><br>
If you want to transfer more funds to your Contribution Wallet, you can start the Phase 1 again from the Contribution main page. <br><br>
        <md-button class="md-raised md-primary" @click="goToZipper()">Go to zipperglobal.com</md-button>

        </div>
        <div align=center v-if="$route.params.step == 0">
         <h1 v-if="$data.multisigs_found == null || $data.multisigs_found == false">Step 2/4</h1>
         <h1 v-if="$data.multisigs_found != null && $data.multisigs_found == true">Step 3/4</h1>
         Selected account: <b>{{ $route.params.account }}</b><br>
         <div v-if="$data.accountBalance > 0">{{ $data.accountBalance }} ETH currently in this account.</div><br>
         <div v-if="$data.accountBalance == 0">0 ETH currently in this account. You should top it up before being able to use the contribution process</div><br>

         <md-button class="md-raised" @click="$router.push('/phase1')">Select another account</md-button><br><br>

         <div v-if="$data.multisigs_found == null">
            <img src="static/img/ajax-loader.gif"><br>
            Querying if you have already started the contribution process with this Ethereum address ...
         </div>

         <div align=left v-if="$route.params.account != '' && $data.txhash == null && $data.multisigs_found != null && $data.multisigs_found == false">
            <br>
            You have not yet started the contribution process with this Ethereum address.<br>
            <md-input-container>
                <label>Your full name</label>
                <md-input v-model="fullname" required></md-input>
            </md-input-container>
            <md-input-container>
                <label>Your e-mail (We will contact you from @zipperglobal.com-mails). This is important to be correct for us to follow up on your contribution.</label>
                <md-input v-model="email" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>Repeat your e-mail</label>
                <md-input v-model="email2" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>Choose the country you're a resident of</label>
                <md-select name="residentcountry" v-model="residentcountry">
                  <md-option v-for="(item, key) in $root.models.countries" v-bind:value="item.name">{{ item.name }}</md-option>
                </md-select>
            </md-input-container>
            <md-input-container>
                <label>Chose the country you're a citizen of. If multiple, note this in additional comments.</label>
                <md-select name="citzencountry" v-model="citizencountry">
                  <md-option v-for="(item, key) in $root.models.countries" v-bind:value="item.name">{{ item.name }}</md-option>
                </md-select>
           </md-input-container>
            <md-input-container>
             	<label>Any additional comments that help us process your contribution better (optional)</label>
                <md-textarea v-model="additional"></md-textarea>
            </md-input-container> 

             <md-checkbox class="md-warn" v-model="resident">I confirm I'm not a resident of any of these countries: Afghanistan, Central African Republic, Democratic Republic of the Congo, Democratic People's Republic of Korea, Eritrea, Iran, Iraq, Lebanon, Libya, New Zealand, Somalia, Sudan, The United States of America and Yemen.</md-checkbox>
             <md-checkbox class="md-warn" v-model="costs">I accept that creating a Contribution Wallet will cost me approximately {{ $data.cwCost }} ETH in blockchain processing costs.</md-checkbox>
             <md-checkbox class="md-warn" v-model="mutual">I accept that any Ether or other blockchain rights (such as tokens) sent to or stored within the Contribution Wallet is only transferable from it by approval of the transaction by both myself and Zipper Global Ltd.</md-checkbox>
             <md-checkbox class="md-warn" v-model="loss">I accept that if I lose access to my private key of the Ethereum address {{ $route.params.account }} I will be unable to access the contents of the Contribution Wallet and neither will Zipper Global Ltd.</md-checkbox>

             <div v-if="this.$data.resident && this.$data.costs && this.$data.mutual && this.$data.loss && this.$data.resident && this.$data.residentcountry.length > 0 && this.$data.citizencountry.length > 0 && this.$data.email.length > 0 && this.$data.fullname.length > 0 && this.$data.email2.length > 0 && this.$data.email === this.$data.email2">
               <md-button class="md-raised md-primary" @click="createWallet()">Submit my info &amp; create a Contribution Wallet</md-button><br> 
               Pressing this will likely pop-up a request from your Ethereum node or Browser plugin to accept and sign this transaction. Only click once; unless you've rejected the request in your Ethereum environment.
             </div>
             <div v-if="!(this.$data.resident && this.$data.costs && this.$data.mutual && this.$data.loss && this.$data.resident && this.$data.residentcountry.length > 0 && this.$data.citizencountry.length > 0 && this.$data.email.length > 0 && this.$data.fullname.length > 0 && this.$data.email2.length > 0 && this.$data.email === this.$data.email2)">
               <md-button class="md-raised md-primary" disabled>Submit my info &amp; create a Contribution Wallet</md-button><br> 
             </div>
        </div>
        <div v-if="$data.multisigs_found != null && $data.multisigs.length > 0 && $data.txtopup == null">
            <div v-for="(item, key) in $data.multisigs">
               You now have a <a v-bind:href="'https://etherscan.io/address/' + item.address" target="_blank">Contribution Wallet</a> with {{ item.accountBalance }} ETH in it.<br>
               <br>

               <b>Next, transfer funds from your ETH wallet to your Contribution Wallet.</b>
                              
               <md-input-container>
                  <label>Please enter amount of ETH to send to this Contribution Wallet</label>
                  <md-input v-model="topup[item.address]" required></md-input>
               </md-input-container>

               Remember that any Ether or other blockchain rights (such as tokens) sent to or stored within the Contribution Wallet is only transferable by approval of the transaction by both yourself and Zipper Global Ltd.
               Sending funds will incur a transaction cost of roughly {{ $data.txCost }} ETH and take 2-5 minutes to complete. <br>
                  
               <br><br>
               <md-button class="md-raised md-primary" @click="sendFunds(Number($data.topup[item.address]), item.address, $route.params.account)" v-if="$data.txtopup == null && $data.topup[item.address] != null && $data.topup[item.address] > 0">Send {{ Number($data.topup[item.address]) }} ETH to this Contribution Wallet</md-button>

               <md-button class="md-raised" @click="withdrawFunds(item.address, item.accountBalance, $route.params.account)" v-if="item.accountBalance > 0">Request to withdraw all funds from Contribution Wallet</md-button>
               <br>
               <div v-for="(item1, key1) in item.waitingMSig" v-if="item1.confirmed == false && item1.executed == false" style="border-style: solid;  border-color: black">
                 Open request number {{ item1.transactionId }} to transfer {{ item1.eth }} ETH to {{ item1.destination == $route.params.account ? "your account" : item1.destination }}, waiting for confirmation by you. {{ item1.data == null ? "No associated data" : item1.data }}<br>
                 <md-button class="md-raised" @click="confirmTx(item.contract, item1.transactionId, $route.params.account)">Confirm</md-button>
               </div>
            </div>
        </div>

         <div v-if="$data.multisigs_found != null && $data.multisigs.length > 0 && $data.txtopup != null" style="border-color: black; border-style: solid">
               <img src="static/img/ajax-loader.gif"><br>
               Top-up transaction in progress, do not close this window<br><a v-bind:href="'https://etherscan.io/tx/' + $data.txtopup" target="_blank">View transaction</a><br><br>Please wait..
         </div>
        
        <div v-if="$data.txhash != null" style="border: color: black; border-style: solid">
           <img src="static/img/ajax-loader.gif"><br>
           Contribution Wallet creation transaction is in progress. <a v-bind:href="'https://etherscan.io/tx/' + $data.txhash" target="_blank">View transaction</a>. It can take up to 2-5 minutes to confirm, depending on network conditions. Please wait... This page will update automatically.
        </div>

        </div>
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
    email2: '',
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
        let j = i
        window.WEB3.eth.getBalance(this.$data.multisigs[i].address).then((result) => {
          this.$data.multisigs[j].accountBalance = window.WEB3.utils.fromWei(result, 'ether')
        })
      }
    },
    withdrawFunds: function (multisig, howmuch, fromaccount) {
      var withdrawalrightabi = JSON.parse('[{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"_destination","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newRealZipper","type":"address"}],"name":"changeRealZipper","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_realzipper","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')
      var withdrawalright = new window.WEB3.eth.Contract(withdrawalrightabi, '0x428e6456fDEb6edc17e67E8e5A5678bf04c219Ee')
      var obj = this
      withdrawalright.methods.withdraw(multisig, window.WEB3.utils.toWei(howmuch, 'ether')).send({from: fromaccount, gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei'), gas: 200000})
      .on('transactionHash', function (hash) {
        console.log('txhash ' + hash)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 5) {
          obj.checkMultisigs()
        }
        console.log('confirmation ' + confirmationNumber + ' receipt ' + receipt)
      })
      .on('error', console.error)
    },
    confirmTx: function (multisigcontract, txid, fromaccount) {
      var obj = this
      multisigcontract.methods.confirmTransaction(txid.toString()).send({from: fromaccount, gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei'), gas: 200000})
     .on('transactionHash', function (hash) {
       console.log('txhash ' + hash)
     })
     .on('confirmation', function (confirmationNumber, receipt) {
       if (confirmationNumber === 5) {
         obj.checkMultisigs()
       }
       console.log('confirmation ' + confirmationNumber + ' receipt ' + receipt)
     })
     .on('error', console.error)
    },
    checkMultisigs: function () {
      if (this.$data.multisigfactory == null) {
        var multisigfactoryabi = JSON.parse('[{"constant":false,"inputs":[{"name":"_newZipper","type":"address"}],"name":"changeZipper","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"createMultisig","outputs":[{"name":"_multisig","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_zipper","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_multisig","type":"address"},{"indexed":true,"name":"_sender","type":"address"},{"indexed":true,"name":"_zipper","type":"address"}],"name":"MultisigCreated","type":"event"}]')
        this.$data.multisigfactory = new window.WEB3.eth.Contract(multisigfactoryabi, '0xe2E36080d4952ae9E90a9Bb87eC2C9a1e7781976')
      }
      var multisigabi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"isConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmationCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactions","outputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"},{"name":"executed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"uint256"},{"name":"to","type":"uint256"},{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionIds","outputs":[{"name":"_transactionIds","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmations","outputs":[{"name":"_confirmations","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"uint256"}],"name":"changeRequirement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_OWNER_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"required","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"newOwner","type":"address"}],"name":"replaceOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Revocation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Submission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Execution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerAddition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerRemoval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"required","type":"uint256"}],"name":"RequirementChange","type":"event"}]')
      var obj = this
      this.$data.multisigs_found = null
      this.$data.multisigs = []
      this.$data.multisigfactory.getPastEvents('MultisigCreated', {fromBlock: 0, filter: { _sender: this.$route.params.account }}).then((result) => {
        this.$data.multisigs_found = result.length > 0
        for (var i = 0; i < result.length; i++) {
          this.$data.multisigs.push({address: result[i].returnValues._multisig, accountBalance: -1, contract: new window.WEB3.eth.Contract(multisigabi, result[i].returnValues._multisig), waitingMSig: []})
          let j = i
          this.$data.multisigs[j].contract.methods.transactionCount().call({ from: this.$route.account }).then(function (txCount) {
            for (var k = 0; k < txCount; k++) {
              let k1 = k
              obj.$data.multisigs[j].contract.methods.transactions(k).call({ from: obj.$route.account }).then(function (txes) {
                txes.confirmed = null
                txes.eth = window.WEB3.utils.fromWei(txes.value, 'ether')
                txes.transactionId = k1
                console.log(txes)
                obj.$data.multisigs[j].waitingMSig.push(txes)
                obj.$data.multisigs[j].contract.methods.confirmations(k, obj.$route.account).call({ from: obj.$route.account }).then(function (confirmed) {
                  obj.$data.multisigs[j].waitingMSig[k1].confirmed = confirmed
                  console.log(k1 + ' confirmed ' + confirmed)
                })
              })
            }
          })
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
      var url = 'https://api.contribution.zipperglobal.com/submit'
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
        obj.refreshMultisigBalance()
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
    this.$data.cwCost = Number(window.WEB3.utils.fromWei(window.WEB3.utils.toWei((this.$data.safeLow * 1254611).toString(), 'gwei'), 'ether')).toFixed(5)
    this.$data.txCost = Number(window.WEB3.utils.fromWei(window.WEB3.utils.toWei((this.$data.safeLow * 100000).toString(), 'gwei'), 'ether')).toFixed(5)
  }
}
</script>

<style>
</style>

