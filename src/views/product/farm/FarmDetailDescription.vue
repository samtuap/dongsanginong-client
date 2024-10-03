<template>
    <!-- Main Container -->
    <v-container class="text-center">
      <!-- Header Text -->
      <v-row justify="center" class="my-5">
        <h1>애옹이네</h1>
      </v-row>
      
      <!-- Image Banner -->
      <v-row justify="center">
        <v-img
          src="https://via.placeholder.com/1000x400.png"
          alt="Farm Image"
          class="banner-image"
          height="400px"
          width="1000px"
          contain
        ></v-img>
      </v-row>
      
      <!-- Navigation Links -->
       <FarmMenuComponent />

    </v-container>
  </template>
  
  <script>
import FarmMenuComponent from '@/components/menubar/FarmMenuComponent.vue';

  export default {
    components: {
      FarmMenuComponent
    },
    data() {
      return {};
    }
  };
  </script>
  
  <style scoped>
  .banner-image {
    border-radius: 12px;
  }
  
  .nav-link {
    font-weight: bold;
    font-size: 18px;
  }
  </style>
  