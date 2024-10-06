<template>
    <!-- <v-container> -->
        <v-carousel
          cycle
          hide-delimiters
          height="380"
          interval="5000"
        > <!--5초마다 슬라이드-->
          <v-carousel-item v-for="(image, index) in images" :key="index" style="overflow: hidden;">
            <img
            :src="image.src"
            :alt="image.alt"
            class="banner-img" />
          </v-carousel-item>
        </v-carousel>
      <!-- </v-container> -->
</template>
<script>
export default {
    data() {
        return {
            images: [],
        }
    },
    created() {
        // 테스트용 임시 데이터
        this.images = [
            { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/test_banner.png", "alt": "배너사진1", "link": "/event1"},
            { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/_+(2).jpeg", "alt": "배너사진2", "link": "/event2"},
            { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/_+(3).jpeg", "alt": "배너사진3" , "link": "/event2"},
            { "src:": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/desktop+wallpaper.jpeg", "alt": "배너사진4", "link": "/event2"},
            { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/desktop+wallpaper.jpeg","alt": "배너사진5", "link": "/event2"}
        ];
    }
}
</script>
<style scoped>
.v-carousel-item {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; /* 넘치는 부분 감추기 */
    background-color: #f5f5f5;
}

.banner-img {
    object-fit: cover;
    width: 100%;   /* 부모의 너비에 맞추기 */
    height: 100%;  /* 부모의 높이에 맞추기 */
}

</style>