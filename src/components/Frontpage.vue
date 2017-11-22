<template>
  <div id="frontpage"> 
    <div align=center style="margin-top: 0%">
      <md-card> 
        <div v-if="$root.models.accounts == null">Unable to connect to an Ethereum node.</div>
        <div v-if="$root.models.accounts != null && $root.models.accounts.length == 0">Unable to locate any accounts. If you're using metamask, please unlock (click MetaMask icon</div>
        <div>Looking for a Web3 provider..</div>
        <div>Using MetaMask.</div>
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
       </div> 
      </md-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'frontpage',
  methods: {
    refreshAccounts: function () {
      window.WEB3.eth.getAccounts().then((result) => {
        this.$root.models.accounts = result
        setTimeout(() => {
          this.refreshAccounts()
        }, 1000)
      }).catch((err) => {
        console.log(err)
        this.$root.models.accounts = null
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

