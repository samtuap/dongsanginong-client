<template>
  <v-app>
    <!-- 헤더 적용 -->
    <MainHeader /> 
    
    <v-main>
      <div class="about">
      <br><br>
      <h1 style="text-align: center">test page🐈 </h1>
    </div>
    </v-main>
  </v-app>
</template>

<script>
import MainHeader from './MainHeader.vue';

export default {
  components: {
    MainHeader, 
  },
};
</script>
