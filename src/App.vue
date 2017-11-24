<template>
	<div id="app" class="myapp">
		<md-whiteframe md-tag="md-toolbar" md-elevation="1" md-theme="light-blue" class="md-dense">
			<div class="md-toolbar-container">
				<md-button class="md-icon-button" @click="$router.push('/')">
					<md-icon md-src="static/img/zipper_logo_square_transparent_30x30.png"></md-icon>
				</md-button>
				<span style="flex: 1">
					<span style="display:inline-block;"><md-button v-bind:class="$route.name == 'Terms' ? 'md-accent' : ''" @click="$router.push('/terms')">Terms</md-button></span>
					<span style="display:inline-block;"><md-button v-bind:class="$route.name == 'FAQ' ? 'md-accent' : ''" @click="$router.push('/faq')">FAQ</md-button></span>
				</span>
				<span style="display:inline-block;"><md-button v-bind:class="$route.name == 'Contact' ? 'md-accent' : ''" @click="$router.push('/contact')">Contact</md-button></span>
			</div>
		</md-whiteframe>
		</md-whiteframe>

                <div style="width: 98%; margin-top: 1%; margin-left: 1%; margin-right: 1%">
                   <router-view></router-view>
                </div>
	</div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.myapp {
  font-family: "Open Sans";
}

.primarycolor {
  color: #00838F
}

.greycolor {
  color: #9E9E9E
}

h1 {
  font-size: 22px;
}
h2 { 
  font-size: 20px;
}
h3 {
  font-size: 15px;
}
h4 { 
  font-size: 14px;
}
</style>
