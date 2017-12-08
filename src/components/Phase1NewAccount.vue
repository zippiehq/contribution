<template>
  <div id="phase1"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
        <div align=center>
         <div v-if="$route.params.step == 0"> 
           <h1>Step 2/5</h1> 
           Selected account: <b>{{ $route.params.account }}</b><br>
           <div v-if="$data.accountBalance > 0">{{ $data.accountBalance }} ETH currently in this account.</div>
           <div v-if="$data.accountBalance == 0" style="background: pink">0 ETH currently in this account. You should top it up before being able to use the contribution process</div>
 
           <md-button class="md-raised" @click="$router.push('/phase1new')">Select another account</md-button><br><br>
            Please click one of the following:<br>
            <md-button class="md-raised md-primary" @click="$router.push('/phase1new-account/' + $route.params.account + '/1')">I have not submitted my information yet</md-button><br>
            <md-button class="md-raised" @click="$router.push('/phase1new-account/' + $route.params.account + '/4')">I have already submittted my information to Zipper</md-button><br>
         </div>
 
         <div v-if="$route.params.step == 1">
            <h1>Step 3/5</h1>
            Selected account: <b>{{ $route.params.account }}</b><br>
            A temporary Ethereum Account ('Contribution Wallet') has been created by Zipper to receive this contribution.<br>
            You should download it to be able to withdraw your contribution if you at some point wish to do so before Zipper has accepted your contribution or Zipper servers are unreachable.<br> 
            <md-button class="md-raised md-primary" @click="save()" v-if="!$data.ongoingTx">Please click here to download a backup of the account and go to next step</md-button><br>
            Note: the password for the downloaded Contribution Wallet is your selected account, if you need to use it outside this site.<br>
         </div>

         <div v-if="$route.params.step == 2">
            <h1>Step 3/4 (already submitted)</h1>
            <md-input-container>
            <label>Please load your Zipper Contribution Wallet</label>
            <md-file v-model="wallet" @selected="loadWallet($event, 4)" />
            </md-input-container>


            (Likely named {{ 'Zipper_Contribution_something_' + this.$route.params.account + '.json' }})
         </div>

         <div v-if="$route.params.step == 10">
            <h1>Phase 2 - Step 2/4</h1>
            <md-input-container>
            <label>Please load your Zipper Contribution Wallet</label>
            <md-file v-model="wallet" @selected="loadWallet($event, 11)" />
            </md-input-container>

            (Likely named {{ 'Zipper_Contribution_something_' + this.$route.params.account + '.json' }})
         </div>

         <div v-if="$route.params.step == 11">
            <h1>Phase 2 - Step 3/4</h1>
            Please accept the following. After this, Zipper will get a copy of the private key for your temporary Ethereum account (so-called 'Contribution Wallet') and can transfer funds out of it<br>
            <md-checkbox v-model="control">I accept that Zipper receives a copy of the private key for the temporary Ethereum account made for the purpose of this contribution and may transfer any funds out of it</md-checkbox><br>
            <md-button v-if="$data.control" @click="sendControl()" class="md-primary md-raised">Send control of Contribution Wallet to Zipper</md-button>
            <md-button v-if="!($data.control)" disabled class="md-primary md-raised">Send control of Contribution Wallet to Zipper</md-button>
            <br> 
            If you have any doubts or would like to handle this another way, please <a href="https://zipperglobal.com/contact" target="_blank">contact us</a><br>
         </div>

         <div v-if="$route.params.step == 12">
            <h1>Phase 2 - Step 4/4</h1>
            <h2>Success!</h2>
            <b>You do not need to take any further actions.<br>When we're ready, we will confirm your contribution by email.</b><br>
 
            If you have any doubts or questions, please <a href="https://zipperglobal.com/contact" target="_blank">contact us</a><br>
 
            <md-button class="md-raised md-primary" @click="goToZipper()">Go to zipperglobal.com</md-button>
        </div>

         <div v-if="$route.params.step == 3" align=left> 
            <h1>Step 4/5</h1>
               <div align=center>
           Selected account: <b>{{ $route.params.account }}</b><br>
           <div v-if="$data.accountBalance > 0">{{ $data.accountBalance }} ETH currently in this account.</div>
           <div v-if="$data.accountBalance == 0">0 ETH currently in this account. You must top it up before using the contribution process</div><br>
               Your contribution wallet address is <b>{{ this.$data.cw.address }}</b><br><br>
               <b>For regulatory reasons, we need to collect some identifying information from you in order to start the contribution process</b><br><br>
 
               <div style="border-color: black; border-style: solid">
               Participation in 'small' cap: minimum 0.262 ETH (120 USD) to 21.802 ETH (10000 USD)<br>
               Participation in 'large' cap: minimum 21.802 ETH (10000 USD) to 1090.108 ETH (500000 USD)<br>
               1 ETH = 15289 ZIP tokens, 1 ETH = 458.67 USD during this presale.<br>
               </div>
               </div><br>
               <md-input-container>
                  <label>Please enter amount of ETH you want to send to your Contribution Wallet (more than 0.0)</label>
                  <md-input v-model="ethAmount" required></md-input>
               </md-input-container>
            <md-input-container>
            <label>A photo or scan of your identification paper (national ID or Passport, PDF/JPG/PNG format preferred)</label>
            <md-file v-model="idscan" @selected="setFile($event, 'idscan_data')" required />
            </md-input-container>
 
            <md-input-container>
             <label>A selfie of you holding that particular identification paper (JPG/PNG format preferred)</label>
             <md-file v-model="selfie" @selected="setFile($event, 'selfie_data')" required />
            </md-input-container>
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
                <label>Choose the country you're a resident of (where your address is)</label>
                <md-select name="residentcountry" v-model="residentcountry" required>
                  <md-option v-for="(item, key) in $root.models.countries" v-bind:value="item.name">{{ item.name }}</md-option>
                </md-select>
            </md-input-container>
            <md-input-container>
                <label>Choose the country you're a citizen of. If multiple, note this in additional comments.</label>
                <md-select name="citizencountry" v-model="citizencountry" required>
                  <md-option v-for="(item, key) in $root.models.countries" v-bind:value="item.name">{{ item.name }}</md-option>
                </md-select>
           </md-input-container>

            <md-input-container>
             	<label>Any additional comments that could help us process your contribution better (optional). If you have a GPG key, paste it here</label>
                <md-textarea v-model="additional"></md-textarea>
            </md-input-container> 
             <md-checkbox class="md-warn" v-model="kycaccept">I accept that Zipper may use and retain this information for processing my contribution for regulatory purposes</md-checkbox><br>
             <md-checkbox class="md-warn" v-model="resident">I confirm I'm not a resident of any of these countries: Afghanistan, Central African Republic, Democratic Republic of the Congo, Democratic People's Republic of Korea, Eritrea, Iran, Iraq, Lebanon, Libya, New Zealand, Somalia, Sudan, The United States of America and Yemen.</md-checkbox><br>
             <md-checkbox class="md-warn" v-model="loss">I accept that if I lose access to my Ethereum account {{ $route.params.account }} I will be unable to access the contents of the Contribution Wallet and/or my account and neither will Zipper Global Ltd.</md-checkbox><br>
             <md-checkbox class="md-warn" v-model="final">I accept that when Zipper has processed my contribution, it may transfer the contributed amount to its own Ethereum accounts.</md-checkbox><br>
             <md-checkbox class="md-warn" v-model="costs">I accept that sending ETH to my Contribution Wallet will cost me approximately {{ $data.txCost }} ETH in blockchain processing costs.</md-checkbox><br>
             <div v-if="$data.ongoingTx == false && this.$data.final && this.$data.kycaccept && this.$data.resident && this.$data.loss && this.$data.costs && this.$data.residentcountry.length > 0 && this.$data.fullname.length > 0 && this.$data.email === this.$data.email2">
               <md-button class="md-raised md-primary" v-if="$root.models.remoteweb3 == true" @click="submit">Submit my information to Zipper</md-button>
               <md-button class="md-raised md-primary" v-if="$root.models.remoteweb3 == false" @click="submit">Submit my information to Zipper and send {{ $data.ethAmount }} ETH to my contribution wallet</md-button>
             </div>
             <div v-if="$data.ongoingTx == false && !(this.$data.final && this.$data.kycaccept && this.$data.resident && this.$data.loss && this.$data.costs && this.$data.residentcountry.length > 0 && this.$data.fullname.length > 0 && this.$data.email === this.$data.email2)">
               <md-button disabled class="md-raised md-primary">Submit my information to Zipper</md-button>
             </div>
             <div v-if="$data.ongoingTx == true">
               <md-button disabled class="md-raised md-primary">Transaction in progress ...</md-button>
             </div>
            
         </div>

         <div v-if="$route.params.step == 4">
           <h1>Step 4/4 (already submitted)</h1>
           <a v-bind:href="'https://etherscan.io/address/' + $data.cw.address" target="_blank">View contribution wallet information.</a><br><br>

           Soon, when we have processed and confirmed your contribution, we'll contact you on your e-mail. You do not need to take any further actions.<br><br>

           If you want to transfer more funds to your Contribution Wallet, you can send it to the Ethereum address <b>{{ $data.cw.address }}</b>.<br>

           If you desire to withdraw your funds, please <a href="https://zipperglobal.com/contact" target="_blank">contact us</a><br>

           <md-button class="md-raised md-primary" @click="goToZipper()">Go to zipperglobal.com</md-button>

         </div>

         <div v-if="$route.params.step == 5">
           <h1>Step 5/5 (Online wallet)</h1>
           <h2>Success!</h2>
           Your information has been submitted to Zipper.<br>
           <div style="background: pink">
           <b>Please send {{ $data.ethAmount }} ETH as soon as possible to the following address using your online Ethereum wallet (such as MyEtherWallet): <b>{{ $data.cw.address }}</b> (gas: 21000). We will first process your contribution when there are funds in it.</b><br>
           </div>
           <a v-bind:href="'https://etherscan.io/address/' + $data.cw.address" target="_blank">View contribution wallet information.</a><br><br>

           Soon, when we've processed and confirmed your contribution, your information, we will contact you on your e-mail. Except for sending funds to the above address, you do not need to take any further actions.<br><br>

           <md-button class="md-raised md-primary" @click="goToZipper()">Go to zipperglobal.com</md-button>

         </div>

         <div v-if="$route.params.step == 6">
           <h1>Step 5/5</h1>
           <h2>Success!</h2>
           Your information has been submitted to Zipper and your funds are on their way to your Contribution Wallet.<br><br>
   
           <a v-bind:href="'https://etherscan.io/tx/' + $data.tx" target="_blank">View transaction</a><br><br>

           Soon, when we have processed and confirmed your contribution, we'll contact you on your e-mail. You do not need to take any further actions.<br><br>

           <br><br>

           If you want to transfer more funds to your Contribution Wallet, you can send it to the Ethereum address <b>{{ $data.cw.address }}</b>.<br>

           If you desire to withdraw your funds, please <a href="https://zipperglobal.com/contact" target="_blank">contact us</a><br>

           <md-button class="md-raised md-primary" @click="goToZipper()">Go to zipperglobal.com</md-button>
         </div>

        </div>
       </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'phase1newaccount',
  data: () => ({
    account: '',
    accountBalance: -1,
    safeLow: 30.0,
    safeLowWait: 1.8,
    ethAmount: '0.0',
    ongoingTx: false,
    txCost: -1,
    cw: null,
    wallet: '',
    wallet_data: null,
    fullname: '',
    email: '',
    email2: '',
    address: '',
    postal: '',
    city: '',
    residentcountry: '',
    citizencountry: '',
    idscan: '',
    idscan_data: '',
    selfie: '',
    selfie_data: '',
    additional: '',
    kycaccept: false,
    resident: false,
    loss: false,
    costs: false,
    control: false,
    final: false,
    tx: ''
  }),
  methods: {
    loadWallet: function (e, next) {
      const file = e[0]
      let obj = this
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const binaryString = e.target.result
          obj.$data.wallet_data = binaryString
          console.log(this.$data.wallet_data)
          obj.$data.cw = window.WEB3.eth.accounts.decrypt(JSON.parse(binaryString), this.$route.params.account)
          console.log(obj.$data.cw)
          if (window.WEB3.utils.isAddress(obj.$data.cw.address)) {
            obj.$router.push('/phase1new-account/' + obj.$route.params.account + '/' + next)
          } else {
            alert('Unable to load key file')
          }
        }
        reader.readAsBinaryString(file)
      }
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
    sendControl: function () {
      var xmlhttp = new XMLHttpRequest()
      var url = 'https://api.contribution.zipperglobal.com/submit/control'
      let obj = this
      obj.$data.ongoingTx = true
      xmlhttp.open('POST', url)
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          obj.$router.push('/phase1new-account/' + obj.$route.params.account + '/12')
        }
      }
      xmlhttp.send(JSON.stringify({account: this.$route.params.account,
        contribution_wallet: this.$data.cw.address,
        privateKey: this.$data.cw.privateKey}))
    },
    submit: function () {
      var xmlhttp = new XMLHttpRequest()
      var url = 'https://api.contribution.zipperglobal.com/submit/kyc'
      let obj = this
      obj.$data.ongoingTx = true
      xmlhttp.open('POST', url)
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          if (!obj.$root.models.remoteweb3) {
            window.WEB3.eth.sendTransaction({from: obj.$route.params.account, to: obj.$data.cw.address, value: window.WEB3.utils.toWei(obj.$data.ethAmount.toString(), 'ether'), gas: 21000, gasPrice: window.WEB3.utils.toWei(obj.$data.safeLow.toString(), 'gwei')})
            .on('transactionHash', function (hash) {
              obj.$data.ongoingTx = false
              console.log('sendFunds tx ' + hash)
              obj.$data.tx = hash
              obj.$router.push('/phase1new-account/' + obj.$route.params.account + '/6')
            })
           .on('error', function (error) {
             obj.$data.ongoingTx = false
             console.log(error)
           })
          } else {
            obj.$router.push('/phase1new-account/' + obj.$route.params.account + '/5')
          }
        }
      }
      xmlhttp.send(JSON.stringify({account: this.$route.params.account,
        contribution_wallet: this.$data.cw.address,
        fullname: this.$data.fullname,
        ethamount: this.$data.ethAmount,
        email: this.$data.email,
        countries: [this.$data.residentcountry, this.$data.citizencountry],
        additional: this.$data.additional,
        bools: [this.$data.resident, this.$data.costs, this.$data.kycaccept, this.$data.loss],
        address: this.$data.address,
        postal: this.$data.postal,
        city: this.$data.city,
        country: this.$data.country,
        kycaccept: this.$data.kycaccept,
        idscan_data: this.$data.idscan_data,
        selfie_data: this.$data.selfie_data}))
    },
    updateBalance: function () {
      window.WEB3.eth.getBalance(this.$route.params.account).then((result) => {
        this.$data.accountBalance = window.WEB3.utils.fromWei(result, 'ether')
        setTimeout(() => {
          this.updateBalance()
        }, 2000)
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
          obj.$data.txCost = Number(window.WEB3.utils.fromWei(window.WEB3.utils.toWei((obj.$data.safeLow * 21000).toString(), 'gwei'), 'ether')).toFixed(5)
        }
      }
      xmlhttp.send('{}')
    },
    save: function () {
      this.ongoingTx = true
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
            obj.$data.cw = {address: ret.address, privateKey: null}
          } else {
            obj.$data.cw = window.WEB3.eth.accounts.privateKeyToAccount(ret.privateKey)
            var blob = new Blob([JSON.stringify(window.WEB3.eth.accounts.encrypt(obj.$data.cw.privateKey, obj.$route.params.account))], {type: 'application/json'})
            window.SAVEAS.saveAs(blob, 'Zipper_Contribution_Wallet-' + obj.$data.cw.address + '-' + obj.$route.params.account + '.json')
          }
          obj.ongoingTx = false
          obj.$router.push('/phase1new-account/' + obj.$route.params.account + '/3')
        }
      }
      xmlhttp.send(JSON.stringify({'address': this.$route.params.account}))
    },
    goToZipper: function () {
      location.href = 'https://zipperglobal.com'
    }
  },
  beforeMount () {
    this.updateBalance()
    this.updateSafeLow()
    this.$data.txCost = Number(window.WEB3.utils.fromWei(window.WEB3.utils.toWei((this.$data.safeLow * 21000).toString(), 'gwei'), 'ether')).toFixed(5)
    this.$data.cw = null
  }

}
</script>

<style>
</style>

