<template>
    <v-container style="max-width: 95%;">
        <!-- Image Banner -->
        <v-row justify="center">
            <v-img :src="this.bannerImage" alt="Farm Image" class="banner-image" style="margin-top: 10px; height:400px; width:100%;" contain></v-img>
        </v-row>
        <!-- 프로필 이미지 및 농장명 -->
         <v-row>
            <div id="session-header" style="position: relative;">
            <v-row class="farm-info">
              <div class="farm-image-frame">
                <v-img :src="profileImageUrl" class="farm-image-circle" cover />
              </div>
              <div class="farm-text" style="margin-top: -100px; margin-left: 120px; text-align: start;">
                <span class="farm-name" style="margin-left: 10px;">{{ this.farmName }}</span><br>
                <span style="font-size: 14px; color: grey; margin-left: 10px;"> 스크랩 수 {{ this.favoriteCount }}</span><br>
                <span style="font-size: 14px; color: grey; margin-left: 10px;"> {{ this.farmIntro }}</span>
              </div>
            </v-row>
          </div>
         </v-row>

        <v-row justify="center" class="mt-5 menubar" style="line-height: 15px;">
            <v-col cols="3" class="text-center">
                <span
                @click="this.$router.push(`/farm/${farmId}/packages`)"
                class="nav-link"
                :class="{ 'selected-menu': this.currentMenu === 1 }"
                style="cursor: pointer; margin-right: 66%;"
                >패키지 보기</span>
            </v-col>
            <v-col cols="3" class="text-center">
                <span
                @click="this.$router.push(`/farm/${farmId}/notice/list`)"
                class="nav-link"
                :class="{ 'selected-menu': this.currentMenu === 2 }"
                style="cursor: pointer;"
                >농장 공지</span>
            </v-col>
            <v-col cols="3" class="text-center">
                <span
                @click="this.$router.push(`/farm/${farmId}/reviews`)"
                class="nav-link"
                :class="{ 'selected-menu': this.currentMenu === 3 }"
                style="cursor: pointer; margin-left: 60%;"
                >상품 후기</span>
            </v-col>
        </v-row>

        <v-row justify="center" class="menu-border">
            <div
                v-if="currentMenu"
                :style="{ left: (currentMenu - 1) * 33.33 + '%', width: '33.33%' }"
                class="menu-highlight"
            ></div>
        </v-row>
    </v-container>
</template>
<script>
import axios from 'axios';
import { useRoute } from 'vue-router';


export default {
    props: ['currentMenu'],
    data() {
        return {
            farmId: 0,
            bannerImage: "",
            farmName: "",
            favoriteCount: "",
            profileImageUrl: "",
            farmIntro: "",
        }
    },
    async created() {
        const route = useRoute();
        this.farmId = route.params.farmId;

        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth/detail/${this.farmId}`);
            console.log(response);
            this.bannerImage = response.data.bannerImageUrl;
            this.farmName = response.data.farmName;
            this.favoriteCount = response.data.favoriteCount;
            this.profileImageUrl = response.data.profileImageUrl;
            this.farmIntro = response.data.farmIntro;

            console.log(this.bannerImage);
        } catch(e) {
            console.log(e);
        }
        
    }
}
</script>
<style scoped>
.nav-link {
    opacity: 0.7;
}
.nav-link:hover {
  opacity: 1;
  padding: 3px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 50px;
}

.menubar {
  font-family: "Noto Sans JP", sans-serif;
  /* margin-top: 30px; */
  height: 40px;
  font-size: 14px;
  color: #3b3b3b;
  position: relative; 
}

.selected-menu {
  opacity: 1;
  padding: 3px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 50px;
  font-weight: bold;
  color: #488c54;
}

.menu-border {
  position: relative;
  height: 1px;
  width: 100%;
  background: #e0e0e0;
}

.menu-highlight {
  position: absolute;
  height: 1px;
  background-color: #488c54;
  transition: left 0.3s ease, width 0.3s ease;
  z-index: 2; 
}
.farm-image-circle {
    border-radius: 200px;
    width: 200px;
    height: 200px;
    border: solid 0.5px #D4D4D4;
    background-position: center;
    background-size: cover;
    transition: background-size 0.5s ease;
    bottom: 85px;
    left: 120px; 
}
.farm-info {
  display: flex;
  align-items: center;
  margin-bottom: -60px;
}
.farm-image-frame {
  margin-right: 10px;
}
.farm-name {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}
</style>