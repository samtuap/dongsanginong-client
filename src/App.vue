<template>
  <v-app>
    <v-main>
      <MainHeader/>
      <div class="font-style">
        <router-view/>
      </div>
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

<style scoped>
/* 나눔 스퀘어라운드 */
@font-face {
    font-family: 'NanumSquareRound';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/NanumSquareRound.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
/* 수트 */
@font-face {
    font-family: 'SUIT-Regular';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}
/* 나눔 바른 고딕 */
@font-face {
 font-family: 'NanumBarunGothic';
 font-style: normal;
 font-weight: 400;
 src: url('//fastly.jsdelivr.net/font-nanumlight/1.0/NanumBarunGothicWeb.eot');
 src: url('//fastly.jsdelivr.net/font-nanumlight/1.0/NanumBarunGothicWeb.eot?#iefix') format('embedded-opentype'), url('//fastly.jsdelivr.net/font-nanumlight/1.0/NanumBarunGothicWeb.woff') format('woff'), url('//fastly.jsdelivr.net/font-nanumlight/1.0/NanumBarunGothicWeb.ttf') format('truetype');
}
.font-style {
  font-family: 'NanumBarunGothic';
}
</style>

