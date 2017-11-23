<template>
  <div id="frontpage"> 
    <div width="100%" style="margin-top: 0%">
      <md-card> 
        <div v-if="$root.models.accounts == null">Unable to connect to an Ethereum node.</div>
        <div v-if="$root.models.accounts != null && $root.models.accounts.length == 0">Unable to locate any accounts. If you're using metamask, please unlock (click MetaMask icon</div>
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
        <div v-if="$data.account != '' && $data.multisigs_found != null && $data.multisigs_found == false">
            You have not started the contribution process with this address.
            <md-input-container>
                <label>What is your full name?</label>
                <md-input v-model="fullname" required></md-input>
            </md-input-container>
            <md-input-container>
                <label>What e-mail can we contact you on? (We will contact you from @zipperglobal.com e-mails)</label>
                <md-input v-model="email" required></md-input>
            </md-input-container>
            <md-input-container>
                <label>Please specify all the countries that you are resident of, citizen of or currently located in.</label>
                <md-input v-model="countries" required></md-input>
            </md-input-container>
            <md-input-container>
             	<label>Provide in this field any additional comments that help us process your contribution better</label>
                <md-textarea></md-textarea>
            </md-input-container> 
                
             <md-checkbox class="md-warn">I confirm I'm not a resident of any of these countries: Afghanistan, Bosnia and Herzegovina, Central African Republic, China, Cuba, Democratic Republic of the Congo, Democratic People’s Republic of Korea, Eritrea, Ethiopia, Guinea-Bissau, Iran, Iraq, Libya, Lebanon, New Zealand, Somalia, South Sudan, Sudan, Syria, Sri Lanka, Tunisia, Vanuatu, and Yemen.<br></md-checkbox>
             <md-checkbox class="md-warn">I accept that creating a Contribution Wallet will cost me approximately 0.0005 ETH in blockchain processing costs.</md-checkbox>
             <md-checkbox class="md-warn">I accept that any Ether or other blockchain rights (such as tokens) sent to or stored within the Contribution Wallet is only transferable by approval of the transaction by both yourself and Zipper Global Ltd.</md-checkbox>
             <md-checkbox class="md-warn">I accept that if I lose access to my private key to the Ethereum address {{ $data.account }} I will be unable to access the contents of the Contribution Wallet and neither will Zipper Global Ltd.</md-checkbox>
             <md-button class="md-raised md-primary">Submit my information to Zipper and create a Contribution Wallet</md-button><br>
        </div>
        <div v-if="$data.account != '' && $data.multisigs_found != null && $data.multisigs.length > 0">
            <div v-for="item in $data.multisigs">
               Multisig {{ item.returnValues._multisig }} Balance {{ item.accountBalance < 0 ? 'loading' : item.accountBalance }}
 
                             
            </div>
        </div>
        <!-- 
       
        <div>Pick an account. Use this address in any communications with
        us.</div>
        <div>The 5 ETH offer.</div>
        <div>This will beyond the contribution cost roughly 0.0005 ETH in
        blockchain processing fees. It may take up to a few minutes to
        complete each step. You can always return to this page to see
        current status. (FIXME)</div>
        <div>How much (in ETH) do you want to contribute to this
        project<br>
        What e-mail can we contact you on?<br>
        Please specify any of countries that you are a resident, citizen of
        or currently located in that may affect our ability to process your
        contribution.<br>
        Provide in this field any additional comments to help us process your contribution
        better.<br>
        Click here to begin the contribution, you may be queried by your
        Ethereum wallet to accept the transaction (roughly 0.00XXX ETH).<br> 
        You'll possibly be requested to submit "KYC" information in our
        following communications with you, through this website in order to
        have your contribution processed.<br>
        We have deployed the contribution multisig with you and Zipper as
        owners. It requires both owners to perform any transactions. You can verify the
        transaction and source code of the multisig here.<br>
        Click here if everything seems proper and send<br>
        Done! See transaction, multisig here<br>
        We'll be in touch on your e-mail, please whitelist contribution@zipperglobal.com
        in your spam-filters. We have sent two e-mails already now to inform
        you of the completion of both transactions. You will not be asked to
        send more money.<br>
        If you encounter any problems, or have doubts, always return to
        https://contribution.zipperglobal.com and click 'Contact' to get
        assistance.<br>
        Next step: Please upload your KYC information here.<br>
        Next step: Please provide shipping information for the Sony Xperia with Zipper
        pre-installed.<br>
        Next step: Convert your contribution into ZIP.<br>
       </div>  -->
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
    multisigs_found: null
  }),
  methods: {
    refreshAccounts: function () {
      window.WEB3.eth.getAccounts().then((result) => {
        this.$root.models.accounts = result
        setTimeout(() => {
          this.refreshAccounts()
          this.reloadMultisigBalance()
        }, 10000)
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
    }
  },
  beforeMount () {
    this.refreshAccounts()
  }
}
</script>

<style>
</style>

