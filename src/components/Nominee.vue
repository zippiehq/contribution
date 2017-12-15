<template>
  <div id="nominee" width="100%">
     <div v-if="$route.params.step == 0">
            Nominee form generator<br>
            <md-input-container>
                <label>Holder</label>
                <md-input v-model="holder" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>Holder's ID number (type as 'ID number XXXXXXX')</label>
                <md-input v-model="holder_info" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>Holder's address + country</label>
                <md-input v-model="holder_address" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>Owner</label>
                <md-input v-model="owner" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>Owner's ID number (type as 'ID number XXXXXXX')</label>
                <md-input v-model="owner_info" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>Owner's address + country</label>
                <md-input v-model="owner_address" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>ETH amount</label>
                <md-input v-model="ethAmount" required></md-input>
            </md-input-container>
            <md-button @click="save" class="md-raised md-primary">Create form (print it)</md-button>
      </div>
  <div v-if="$route.params.step == 1">

  <div align=center>  
            

  <b>DECLARATION OF TRUST</b><br>
  (document ID {{ $data.ref }})
  </div>
  <br><br>
  I, {{ $data.holder }} ({{ $data.holder_info }}) of {{ $data.holder_address }} do solemnly and sincerely declare that:<br>
  <br>
  1. When I (hereafter Holder) have received {{ $data.ethAmount }} ETH (Amount) from Owner into my Ethereum Account, address {{ $data.ethAddress }}, on the Ethereum Foundation network (as commonly defined as such as of 15/12/2017), I will participate in the Zipper Project Presale at https://zipperglobal.com/presale and contribute the Amount (Contribution).<br>
  2. Any rights gained by this Contribution, such as Ethereum ERC20 tokens, do not belong to me but belong to {{ $data.owner }} (hereinafter referred to as the Owner) ({{ $data.owner_info }}) of {{ $data.owner_address }}.<br>
  3. I will hold such rights or said Ethereum ERC20 tokens as a nominee for the Owner.<br>
  4. I further hold said ERC20 tokens and all dividends, rights and interest accruing to or to accrue upon the same or any of them <b>Upon Trust</b> for the Owner.<br>
  5. I shall not transfer, pay or deal with the said Amount, Ethereum ERC20 Tokens or the dividends, rights and interest accruable or payable to the Holder in respect of the same except upon explicit instructions in writing or in such manner as the Owner shall from time to time direct the Holder to do so.<br>
  6. This declaration shall be governed by and construed in accordance with the laws of Hong Kong and the parties irrevocably submit to the exclusive jurisdiction of the courts of Hong Kong.<br>
  <br>
  Dated this<br>
  Signed by the Holder
  <br><br>
  _______________________________________________________________<br>

  {{ $data.holder }}<br><br>
  In the presence of<br><br>
  _______________________________________________________________<br><br>
  _______________________________________________________________<br><br>
  _______________________________________________________________<br><br>
  Signed by the Owner<br>
  <br>
  _______________________________________________________________<br>
  {{ $data.owner }}<br>
  <br>
  In the presence of<br><br>
  _______________________________________________________________<br><br>
  _______________________________________________________________<br><br>
  _______________________________________________________________<br><br>
  <br><br>
  </div>
  </div>
</template>

<script>

export default {
  name: 'nominee',
  data: () => ({
    holder: 'HODLER',
    holder_info: 'HOLDER_ID',
    holder_address: 'HOLDER_ADDRESS',
    ethAmount: 200.00,
    owner: 'OWNER',
    owner_info: 'OWNER_INFO',
    owner_address: 'OWNER_ADDRESS',
    ethAddress: '0x21EF24FFB2116F44E7918A80CEA4f52a2EA72B17'
  }),
  methods: {
    save: function () {
      var xmlhttp = new XMLHttpRequest()
      var url = 'https://api.contribution.zipperglobal.com/submit/wallet'
      let obj = this
      xmlhttp.open('POST', url)
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          console.log(xmlhttp.responseText)
          var ret = JSON.parse(xmlhttp.responseText)
          if (ret.status === 'old') {
            obj.$data.ethAddress = ret.address
          } else {
            obj.$data.ethAddress = ret.address
            obj.$router.push('/nominee/1')

            // var blob = new Blob([JSON.stringify(window.WEB3.eth.accounts.encrypt(obj.$data.cw.privateKey, obj.$route.params.account))], {type: 'application/json'})
            // window.SAVEAS.saveAs(blob, 'Zipper_Contribution_Wallet-' + obj.$data.cw.address + '-' + obj.$route.params.account + '.json')
          }
        }
      }
      this.$data.ref = Date.now().toString()
      xmlhttp.send(JSON.stringify({'address': 'TRUST-' + this.$data.ref}))
    }
  },
  beforeMount () {
  }
}
</script>

<style>
</style>

