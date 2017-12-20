<template>
  <div id="phase1"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
            <md-input-container>
                <label>Password for decrypting</label>
                <md-input v-model="password" required type="password"></md-input>
            </md-input-container>

            <md-input-container>
            <label>Please load your Ethereum Wallet</label>
            <md-file v-model="wallet" @selected="loadWallet($event)" />
            </md-input-container>

          Paper wallet address: {{ $data.cw != null ? $data.cw.address : 'not loaded' }}<br>
          TX id in progress: <a v-bind:href="'https://etherscan.io/tx/' + $data.ongoingTx" target="_blank">{{ $data.ongoingTx }}</a>.

          <md-input-container>
                <label>Transaction ID</label>
                <md-input v-model="txid" required></md-input>
          </md-input-container>
          
          <md-button class="md-raised md-primary" @click="confirmTx">Confirm transaction ID</md-button>

          <md-input-container>
                <label>Destination address</label>
                <md-input v-model="dest" required></md-input>
          </md-input-container>
          <md-input-container>
                <label>Value (in ETH)</label>
                <md-input v-model="value" required></md-input>
          </md-input-container>

          <md-input-container>
                <label>Data (hex)</label>
                <md-input v-model="data" required></md-input>
          </md-input-container>


          <md-button class="md-raised md-primary" @click="submitTransaction">Submit transaction</md-button>

          <md-input-container>
                <label>New owner address</label>
                <md-input v-model="newOwner" required></md-input>
          </md-input-container>

          <md-button class="md-raised md-primary" @click="addNewOwner">Create new owner tx</md-button>

          <md-input-container>
                <label>New sig requirement</label>
                <md-input v-model="newRequirement" required></md-input>
          </md-input-container>

          <md-button class="md-raised md-primary" @click="changeRequirement">Create new requirement tx</md-button>

      </md-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'multisig',
  data: () => ({
    multisigbalance: 0.0,
    dest: '',
    txid: '',
    value: '',
    wallet: '',
    cw: null,
    password: '',
    data: '0x',
    safeLow: 10.0,
    safeLowWait: 1.8,
    multisigcontract: null,
    newOwner: '0x',
    newRequirement: '1',
    ongoingTx: ''
  }),
  methods: {
    addNewOwner: function () {
      this.$data.dest = '0x3f0A24A07b2D729a02640Deb1D27cD00Da72B799'
      this.$data.value = '0'
      this.$data.data = this.$data.multisigcontract.methods.addOwner(this.$data.newOwner).encodeABI()
    },
    changeRequirement: function () {
      this.$data.dest = '0x3f0A24A07b2D729a02640Deb1D27cD00Da72B799'
      this.$data.value = '0'
      this.$data.data = this.$data.multisigcontract.methods.changeRequirement(this.$data.newRequirement).encodeABI()
    },
    submitTransaction: function () {
      let obj = this
      this.$data.multisigcontract.methods.submitTransaction(this.$data.dest, window.WEB3.utils.toWei(this.$data.value, 'ether'), this.$data.data).send({from: this.$data.cw.address, gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei'), gas: 300000})
      .on('transactionHash', function (hash) {
        obj.$data.ongoingTx = hash
      })
    },
    updateSafeLow () {
      var xmlhttp = new XMLHttpRequest()
      var url = 'https://api.contribution.zipperglobal.com/submit/safelow'
      let obj = this
      xmlhttp.open('POST', url)
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          console.log(xmlhttp.responseText)
          var ret = JSON.parse(xmlhttp.responseText).safeLow
          obj.$data.safeLow = ret
          console.log('Corrected safeLow to ' + ret)
        }
      }
      xmlhttp.send('{}')
    },
    confirmTx: function () {
      let obj = this
      this.$data.multisigcontract.methods.confirmTransaction(this.$data.txid).send({from: this.$data.cw.address, gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei'), gas: 200000})
      .on('transactionHash', function (hash) {
        obj.$data.ongoingTx = hash
      })
    },
    loadWallet: function (e) {
      const file = e[0]
      let obj = this
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const binaryString = e.target.result
          console.log(binaryString)
          var parsed = JSON.parse(binaryString)
          if (parsed.Crypto != null) {
            parsed.crypto = parsed.Crypto
          }
          obj.$data.cw = window.WEB3.eth.accounts.decrypt(parsed, obj.$data.password)
          window.WEB3.eth.accounts.wallet.add(obj.$data.cw)
          if (window.WEB3.utils.isAddress(obj.$data.cw.address)) {
          } else {
            alert('Unable to load key file')
          }
        }
        reader.readAsBinaryString(file)
      }
    }
  },
  beforeMount () {
    var multisigabi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"isConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmationCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactions","outputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"},{"name":"executed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"uint256"},{"name":"to","type":"uint256"},{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionIds","outputs":[{"name":"_transactionIds","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmations","outputs":[{"name":"_confirmations","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"uint256"}],"name":"changeRequirement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_OWNER_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"required","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"newOwner","type":"address"}],"name":"replaceOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Revocation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Submission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Execution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerAddition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerRemoval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"required","type":"uint256"}],"name":"RequirementChange","type":"event"}]')
    let obj = this
    this.$data.multisigcontract = new window.WEB3.eth.Contract(multisigabi, '0x3f0A24A07b2D729a02640Deb1D27cD00Da72B799')
    window.WEB3.eth.getBalance('0x3f0A24A07b2D729a02640Deb1D27cD00Da72B799').then((result) => {
      obj.$data.multisigbalance = window.WEB3.utils.fromWei(result, 'ether')
    })
    this.updateSafeLow()
  }
}
</script>

<style>
</style>

