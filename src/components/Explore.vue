<template>
  <div id="explore"> 
      <md-layout> 
       <md-layout md-flex="20" v-for="(item, index) in $root.models.startups" :key="item.title">  
      <md-card style="width: 99%; margin-bottom: 1%">
      <md-card-content>
<span class="primarycolor">{{ item.title }}</span><br>
<br>
<i>{{ item.subtitle }}</i>
<br><br>
{{ item.longdescription }}
      </md-card-content>
        <md-card-actions>
    <md-button class="md-raised md-accent" @click="$router.push('/project/' + index)" style="color: black">Read more</md-button>
  </md-card-actions>
      </md-card>  
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
export default {
  name: 'explore'
}
</script>

<style>
</style>
