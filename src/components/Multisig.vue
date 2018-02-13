<template>
  <div id="phase1"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 0; margin-right: 0%">
            <md-input-container>
                <label>Password for decrypting</label>
                <md-input v-model="password" required type="password"></md-input>
            </md-input-container>

            <md-input-container>
            <label>Please load your Ethereum Wallet</label>
            <md-file v-model="wallet" @selected="loadWallet($event)" />
            </md-input-container>
            Paper wallet address: <b>{{ $data.cw != null ? $data.cw.address : 'not loaded' }}</b><br><br>

            <md-input-container>
                <label>Choose multisig to act on</label>
                <md-select name="msig" v-model="multisig" required @selected="setupMultisig">
                    <md-option v-for="(item, key) in $data.multisigs" v-bind:value="item">{{ item }}</md-option>
                </md-select>
            </md-input-container>           
          Multisig balance: {{ $data.multisigbalance }}<br>

          
          <br>
          TX id in progress: <a v-bind:href="'https://etherscan.io/tx/' + $data.ongoingTx" target="_blank">{{ $data.ongoingTx }}</a>
          <br>
          <h1>Unconfirmed transactions</h1> 
          <table width="100%">
          <tr v-for="(item, key) in sortedTransactions" v-if="item.executed == false"> 
                 <td>{{ item.transactionId }}</td>
                 <td>{{ item.destination }}</td>
                 <td>{{ item.eth }}</td>
                 <td>{{ item.data }}</td>
                 <td>{{ item.confirmed }}</td>
          </tr>
          </table>

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
          <h1>All transactions</h1>
          <table width="100%">
          <tr v-for="(item, key) in sortedTransactions"> 
                 <td>{{ item.transactionId }}</td>
                 <td>{{ item.destination }}</td>
                 <td>{{ item.eth }}</td>
                 <td>{{ item.data }}</td>
                 <td>{{ item.confirmed }}</td>
                 <td>{{ item.executed }}</td>
          </tr>
          </table>
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
    multisig: '',
    multisigs: ['0x3f0A24A07b2D729a02640Deb1D27cD00Da72B799', '0x5bd4B6AB074EDE76BaA2Aec49DCF9EdB89A90dcf', '0xb9C36fE4f27164FcA364cb855F5a751913CC8E51', '0x41e3bCaa7D7662dd768c1510014DE7D5058183DC'],
    transactions: [],
    newOwner: '0x',
    friendlyName: {
      '0x21EF24FFB2116F44E7918A80CEA4f52a2EA72B17': 'Presale 0x21',
      '0xAB9624Cc8334E80af1a2c20D522c4047e417BF37': 'Carsten #2',
      '0x7dCdBB40fcAEb3e5DcC2a22CCd12Eb07155AD963': 'Antti #1',
      '0x1833614a246d78e637dAB86b88181419d7e0C5d4': 'Pasi',
      '0x134dfecE9DCb6a4FCb92537C3B22124cd13f8e0A': 'ICO alert',
      '0x049Bd1adbD79B83598cbA76FBE36CCFC092A9240': 'Coinhills'
    },
    newRequirement: '1',
    ongoingTx: ''
  }),
  computed: {
    sortedTransactions: function () {
      return this.$data.transactions.sort(function (a, b) {
        if (a.transactionId < b.transactionId) {
          return -1
        } else if (a.transactionId > b.transactionId) {
          return 1
        }
        return 0
      })
    }
  },
  methods: {
    addNewOwner: function () {
      this.$data.dest = this.$data.multisig
      this.$data.value = '0'
      this.$data.data = this.$data.multisigcontract.methods.addOwner(this.$data.newOwner).encodeABI()
    },
    changeRequirement: function () {
      this.$data.dest = this.$data.multisig
      this.$data.value = '0'
      this.$data.data = this.$data.multisigcontract.methods.changeRequirement(this.$data.newRequirement).encodeABI()
    },
    submitTransaction: function () {
      let obj = this
      if (!window.WEB3.utils.isAddress(this.$data.dest)) {
        alert('Invalid address')
      } else {
        this.$data.multisigcontract.methods.submitTransaction(this.$data.dest, window.WEB3.utils.toWei(this.$data.value, 'ether'), this.$data.data).send({from: this.$data.cw.address, gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei'), gas: 300000})
        .on('transactionHash', function (hash) {
          obj.$data.ongoingTx = hash
        })
      }
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
          obj.setupMultisig(obj.$data.multisig)
          if (window.WEB3.utils.isAddress(obj.$data.cw.address)) {
          } else {
            alert('Unable to load key file')
          }
        }
        reader.readAsBinaryString(file)
      }
    },
    setupMultisig (multisig) {
      var multisigabi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"isConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmationCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactions","outputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"},{"name":"executed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"uint256"},{"name":"to","type":"uint256"},{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionIds","outputs":[{"name":"_transactionIds","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmations","outputs":[{"name":"_confirmations","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"uint256"}],"name":"changeRequirement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_OWNER_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"required","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"newOwner","type":"address"}],"name":"replaceOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Revocation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Submission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Execution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerAddition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerRemoval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"required","type":"uint256"}],"name":"RequirementChange","type":"event"}]')
      let obj = this
      this.$data.multisig = multisig
      this.$data.multisigcontract = new window.WEB3.eth.Contract(multisigabi, multisig)
      window.WEB3.eth.getBalance(multisig).then((result) => {
        obj.$data.multisigbalance = window.WEB3.utils.fromWei(result, 'ether')
      })
      this.$data.transactions = []
      if (this.$data.cw == null) {
        return
      }
      this.$data.multisigcontract.methods.transactionCount().call({ from: this.$data.cw.address }).then(function (txCount) {
        for (var k = 0; k < txCount; k++) {
          let k1 = k
          obj.$data.multisigcontract.methods.transactions(k).call({ from: obj.$data.cw.address }).then(function (txes) {
            if (txes.destination === obj.$data.multisig) {
              txes.destination = 'Multisig itself (careful)'
            } else if (obj.$data.friendlyName[txes.destination] != null) {
              txes.destination = obj.$data.friendlyName[txes.destination]
            }
            txes.confirmed = null
            txes.eth = window.WEB3.utils.fromWei(txes.value, 'ether')
            txes.transactionId = k1
            console.log(txes)
            obj.$data.transactions.push(txes)
            let k2 = k1
            obj.$data.multisigcontract.methods.confirmations(k1, obj.$data.cw.address).call({ from: obj.$data.cw.address }).then(function (confirmed) {
              obj.$data.transactions[k2].confirmed = confirmed
              console.log(k2 + ' confirmed ' + confirmed)
            })
          })
        }
      })
    }
  },
  beforeMount () {
    this.setupMultisig('0x3f0A24A07b2D729a02640Deb1D27cD00Da72B799')
    this.updateSafeLow()
  }
}
</script>

<style>
</style>

