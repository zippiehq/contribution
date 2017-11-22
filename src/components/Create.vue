<template>
  <div id="create"> 
      <md-card>
      <md-card-content>  
        <h1>Create project</h1>
        <form novalidate @submit.stop.prevent="submit">
          This description can later on be changed by a project token holder majority backed submission to the project trust
          <md-input-container>
           <label>Short title of project</label>
           <md-input v-model="shortTitle"></md-input>
          </md-input-container>

          <md-input-container>
           <label>Sub-title (in form of a What if?)</label>
           <md-input v-model="subTitle"></md-input>
          </md-input-container>

          <md-input-container>
           <label>Long description</label>
           <md-textarea v-model="longDescription"></md-textarea>
          </md-input-container>

          By creating this project on the Zipper platform you agree that the copyright of this description is transferred to Zipper Global Ltd. which will settle it into a project trust established in Gibraltar<br>

          <md-button class="md-raised md-accent" @click="$root.models.startups.push({title: shortTitle, subtitle: subTitle, longdescription: longDescription}); $router.push('/explore')">Create project</md-button>         
        </form>

      </md-card-content>
      </md-card> 


  </div>
</template>

<script>
export default {
  name: 'create',
  data () {
    return {
      shortTitle: '',
      subTitle: '',
      longDescription: ''
    }
  }
}
</script>

<style>
</style>

