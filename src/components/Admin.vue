<template>
  <div id="admin"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 0; margin-right: 0%">
       <md-card-content> 
          <div v-if="$data.multisigs_found != null && $data.multisigs.length > 0">  
             Total so far: {{ $data.multisigTotal }} ETH

             <table width=100%>
             <tr v-for="(item, key) in $data.multisigs"><td>{{ item.sender }}</td><td>{{ item.address }}</td><td>{{ item.accountBalance }}</td><td><md-button @click="transferToZipper(item.address, item.accountBalance)">Request transfer to Zipper multisig</md-button></td></tr>
             </table>
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
    safeLow: 1.0,
    multisigTotal: Number(0.0),
    multisigfactory: null,
    multisigs_found: null,
    multisigs: []
  }),
  methods: {
    refreshMultisigBalance: function () {
      this.$data.multisigTotal = Number(0.0)
      for (var i = 0; i < this.$data.multisigs.length; i++) {
        let j = i
        window.WEB3.eth.getBalance(this.$data.multisigs[j].address).then((result) => {
          this.$data.multisigs[j].accountBalance = window.WEB3.utils.fromWei(result, 'ether')
          this.$data.multisigTotal += Number(this.$data.multisigs[j].accountBalance)
        })
      }
    },
    transferToZipper: function (msig, amount) {
      var withdrawalrightabi = JSON.parse('[{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"_destination","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newRealZipper","type":"address"}],"name":"changeRealZipper","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_realzipper","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')
      var withdrawalright = new window.WEB3.eth.Contract(withdrawalrightabi, '0x428e6456fDEb6edc17e67E8e5A5678bf04c219Ee')

      withdrawalright.methods.submitTransaction(msig, '0x21EF24FFB2116F44E7918A80CEA4f52a2EA72B17', window.WEB3.utils.toWei(amount, 'ether'), '0x').send({from: '0x21EF24FFB2116F44E7918A80CEA4f52a2EA72B17', gasPrice: window.WEB3.utils.toWei(this.$data.safeLow.toString(), 'gwei'), gas: 200000})
      .on('transactionHash', function (hash) {
        console.log('txhash ' + hash)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
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
      this.$data.multisigs_found = null
      this.$data.multisigs = []
      this.$data.multisigTotal = Number(0.0)
      this.$data.multisigfactory.getPastEvents('MultisigCreated', {fromBlock: 0}).then((result) => {
        this.$data.multisigs_found = result.length > 0
        console.log(result)
        for (var i = 0; i < result.length; i++) {
          this.$data.multisigs.push({sender: result[i].returnValues._sender, address: result[i].returnValues._multisig, accountBalance: -1, contract: new window.WEB3.eth.Contract(multisigabi, result[i].returnValues._multisig), waitingMSig: []})
          let j = i
          window.WEB3.eth.getBalance(this.$data.multisigs[i].address).then((result) => {
            this.$data.multisigs[j].accountBalance = window.WEB3.utils.fromWei(result, 'ether')
            this.$data.multisigTotal += Number(this.$data.multisigs[j].accountBalance)
          })
        }
        setTimeout(() => {
          this.refreshMultisigBalance()
        }, 10000)
      })
    }
  },
  beforeMount () {
    this.checkMultisigs()
  }
}
</script>

<style>
</style>

