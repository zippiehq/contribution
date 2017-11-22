<template>
  <div id="signup">
    <md-dialog md-open-from="#custom" md-close-to="#custom" ref="signupdialog">
  <md-dialog-title>Sign up to Zipper - step {{ signupstep + 1 }}/5</md-dialog-title>

  <md-dialog-content>
  <div style="width: 1000px">	
  <div v-if="signupstep == 0">
   <h1 class="md-primary primarycolor">Please give us a few more details to create your Zipper platform identity (scroll down as well)</h1>
  <md-input-container md-inline style="width: 20%">
    <label>First name</label>
    <md-input></md-input>
  </md-input-container>

  <md-input-container md-inline style="width: 20%">
    <label>Last name</label>
    <md-input></md-input>
  </md-input-container>

   <md-input-container md-inline>
    <label>E-mail</label>
    <md-input></md-input>
  </md-input-container>

   <md-input-container md-inline>
    <label>Handle to be used on the platform</label>
    <md-input></md-input>
  </md-input-container>
  
  <md-input-container md-inline>
    <label>Password</label>
    <md-input type=password></md-input>
  </md-input-container>
  <md-input-container>
  <label>Attach a PDF/JPG/PNG with your identification document (passport or national ID)</label>
  <md-file v-model="single"></md-file>
  </md-input-container>

  <md-input-container md-inline>
    <label>The citizenships you hold & the country you are signing up from, if not listed already.</label>
    <md-textarea></md-textarea>
  </md-input-container>  

  </div>
  <div v-if="signupstep == 1">
  <h1 class="md-title primarycolor">Investment club membership agreement</h1>
  <li>You become a investment club member of the Zipper Investment Club Ltd. (Gibraltar). You will not be a shareholder or a partner of this company.</li>
  <li>You can invest any amount of money into the Zipper Investment Club.</li>
  <li>The invested amount becomes an asset of the club.</li>
  <li>However, the club gives you a budget of the money you've invested for you to control, represented as token coins that you can transfer within the platform.</li>
  <li>Subject to the rules of the club and up to the limit of your budget,  you may conduct actions (at your full liability) in the name of the club as a special agent.</li>
  <li>These actions can be doing investments, selling tokens or deciding to withdraw the budget to your own account, etc.</li>
  <li>Any sales or returns made of the investments you’ve done will be added to your budget.</li>
  <li>You accept that 1% of gains made by the investment club of investments are paid as a license fee for the Zipper platform software.</li>
  <li>You accept that your rights under this agreement are not transferable.</li>
  <li>You accept that Zipper Investment Club will process your identity for KYC purposes.</li> 
  <li>You accept that anti-money laundering (AML) checks of your investment into the club will be made which may cause them to be confiscated or frozen by authorities.</li>
  <li>You accept that this membership is not a security under the laws of the country you're residing in – you only profit on your own actions.</li>
  <li>You accept that any disputes between you and the club will be handled through online arbitration and the agreement is under the laws of Gibraltar</li>

  <md-checkbox id="my-test1" name="my-test1" v-model="checkbox3">I agree to these conditions (not really, it's a DEMO)</md-checkbox><br> 

  </div>
    
  <div v-if="signupstep == 2">
  <h1 class="md-title primarycolor">Top up your Zipper Platform Ethereum Account</h1>
  You will be doing a bunch of operations using the Ethereum blockchain, so this is a good moment to top up the Ethereum account that you'll use on this platform.<br>
  <br>
  This is also the account you will be using to do your investments into the club, so add enough for both operations and investment. <br>
  <br>
  This account can be recovered by providing your e-mail on the platform's support site, click an authentication link sent to your e-mail and a video call to confirm your identity. If you lose your password you lose access to the platform through this avenue.<br>
  <br>
  You should also <a href="#">click here to print a paper wallet for the platform account</a> if you have a printer nearby.
  <br>
  <br>
  Please send some Ether to the following address: (DEMO: Don't actually do this, just click next)<br>
  <br>
  <b>0xF36bd4F18fC24856ae0ffcAe2F391992534bfF8b</b><br>
  <br>  
  Waiting for balance to be above 0 ETH..

  </div>
  <div v-if="signupstep == 3">
<h1 class="md-primary primarycolor">Perform initial investment</h1>

You can now lock up your investment for processing by the Zipper Investment Club. The investment club has 7 days to accept your investment and sign their side of the agreement. After that has passed and investment hasn't been accepted, you can take back your money. Costs of using the Ethereum blockchain can not be refunded.

  <md-input-container md-inline>
    <label>Amount of investment into the investment club in ETH</label>
    <md-input></md-input>
  </md-input-container>  


  </div>

  <div v-if="signupstep == 4">
<h1 class="md-primary primarycolor">Thank you for signing up to Zipper.</h1>

We will check your information and send you a confirmation email within the next hour.<br>

After confirmation & investment has been accepte, you are ready to make your first investments in the Zipper Investment Club<br>
  </div>
 </div>
 </md-dialog-content>

  <md-dialog-actions>
    <md-button class="md-primary" @click="closeDialog('signupdialog')" v-if="signupstep < 4">Cancel</md-button>
    <md-button class="md-primary" @click="signupstep -= 1" v-if="signupstep < 4 && signupstep >= 1">Previous</md-button>
    <md-button class="md-primary md-accent" @click="signupstep += 1" v-if="signupstep < 4">Next</md-button>
    <md-button class="md-primary" @click="$emit('login'); closeDialog('signupdialog');" v-if="signupstep == 4">OK</md-button>
  </md-dialog-actions>
</md-dialog>

  </div>
</template>

<script>
export default {
  name: 'signup',
  data: function () {
    return {
      signupstep: 0,
      radio1: 0
    }
  },
  methods: {
    openDialog (ref) {
      this.$refs[ref].open()
    },
    closeDialog (ref) {
      this.$refs[ref].close()
    }
  }
}

</script>

<style>
</style>
