<template>
  <div id="phase1"> 
    <div width="100%" style="margin-top: 0%">
      <md-card style="margin-left: 10%; margin-right: 10%">
       <md-card-content> 
        <div align=center>
            <h1>KYC for Zipper Token Sale</h1>

            <md-input-container>
                <label>E-mail (We will contact you from @zipperglobal.com-mails)</label>
                <md-input v-model="email" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>Repeat your e-mail</label>
                <md-input v-model="email2" required></md-input>
            </md-input-container>

            <md-input-container>
            <label>A photo or scan of your identification document (national ID or Passport, PDF/JPG/PNG format ONLY)</label>
            <md-file v-model="idscan" @selected="setFile($event, 'idscan_data')" required />
            </md-input-container>
 
            <md-input-container>
             <label>A selfie of you holding that particular identification document (JPG/PNG format ONLY). Your face MUST be visible on the picture</label>
             <md-file v-model="selfie" @selected="setFile($event, 'selfie_data')" required />
            </md-input-container>
            <md-input-container>
                <label>First name</label>
                <md-input v-model="firstname" required></md-input>
            </md-input-container>
            <md-input-container>
                <label>Last name</label>
                <md-input v-model="lastname" required></md-input>
            </md-input-container>
           <md-input-container>
                <label>Date of birth in DD/MM/YYYY format</label>
                <md-input v-model="dob" required></md-input>
           </md-input-container>
           <md-input-container>
                <label>Street name</label>
                <md-input v-model="street" required></md-input>
            </md-input-container>
           <md-input-container>
                <label>Building number</label>
                <md-input v-model="buildingnumber" required></md-input>
            </md-input-container>
           <md-input-container>
                <label>Apartment number (use N/A if not applicable)</label>
                <md-input v-model="apartmentnumber" required></md-input>
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
             	<label>Any additional comments that could help us process your contribution better (optional).</label>
                <md-textarea v-model="additional"></md-textarea>
            </md-input-container> 
          </div>
          <div>
             <md-checkbox class="md-warn" v-model="terms">I agree to the Zipper token sale Terms & Conditions and terms received as part of Private Sale discussion</md-checkbox><br>
             <md-checkbox class="md-warn" v-model="kycaccept">I accept that Zipper may use and retain this information for processing my contribution for regulatory purposes</md-checkbox><br>
             <md-checkbox class="md-warn" v-model="resident">I confirm I'm not a resident of any of these countries: Afghanistan, Central African Republic, Democratic Republic of the Congo, Democratic People's Republic of Korea, Eritrea, Iran, Iraq, Lebanon, Libya, New Zealand, Somalia, Sudan, The United States of America and Yemen.</md-checkbox><br>
             <md-button class="md-raised md-primary" v-if="!$data.ongoingTx" @click="submit">Submit my information to Zipper</md-button>
             <md-button class="md-raised md-primary" v-if="$data.ongoingTx" @click="submit" disabled>Submitting..</md-button>
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
    ongoingTx: false,
    txCost: -1,
    firstname: '',
    lastname: '',
    dob: '',
    street: '',
    buildingnumber: '',
    apartmentnumber: 'N/A',
    email: '', //
    email2: '', //
    postal: '',
    city: '',
    residentcountry: '',
    citizencountry: '',
    idscan: '', //
    idscan_data: '', //
    selfie: '', //
    selfie_data: '', //
    additional: '',
    kycaccept: false,
    terms: false,
    resident: false,
    loss: false,
    costs: false,
    control: false,
    final: false,
    tx: ''
  }),
  methods: {
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
    submit: function () {
      if (this.$data.email === '' || (this.$data.email !== this.$data.email2)) {
        alert('Please make sure your e-mail is correct and same in both fields')
        return
      }
      if (!(this.$data.terms && this.$data.kycaccept && this.$data.resident)) {
        alert('Please accept all the checkboxes')
        return
      }
      var xmlhttp = new XMLHttpRequest()
      var url = 'https://api.contribution.zipperglobal.com/submit/kyc2'
      let obj = this
      obj.$data.ongoingTx = true
      xmlhttp.open('POST', url)
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          alert('Information submitted')
          obj.$data.ongoingTx = false
        }
      }
      xmlhttp.send(JSON.stringify({
        email: this.$data.email,
        idscan_data: this.$data.idscan_data,
        selfie_data: this.$data.selfie_data,
        firstname: this.$data.firstname,
        lastname: this.$data.lastname,
        dob: this.$data.dob,
        street: this.$data.street,
        buildingnumber: this.$data.buildingnumber,
        apartmentnumber: this.$data.apartmentnumber,
        postal: this.$data.postal,
        city: this.$data.city,
        residentcountry: this.$data.residentcountry,
        citizencountry: this.$data.citizencountry,
        additional: this.$data.additional
      }))
    }
  },
  beforeMount () {
  }
}
</script>

<style>
</style>

