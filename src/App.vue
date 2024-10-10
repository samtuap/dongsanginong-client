<template>
  <v-app>
    <v-main>
      <MainHeader/>
      <router-view/>
      <MainFooter />
    </v-main>
  </v-app>
</template>

<script>
import MainHeader from './components/header/MainHeader.vue';
import MainFooter from './components/footer/MainFooter.vue';

export default {
  name: 'App',
  components: {
    MainHeader, 
    MainFooter
  },
  data: () => ({
    //
  }),
}
</script>

