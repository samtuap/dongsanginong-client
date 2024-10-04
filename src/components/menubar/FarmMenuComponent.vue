<template>
    <v-container style="max-width: 950px;">
        <!-- Header Text -->
        <v-row justify="center" style="margin-bottom: 10px;">
            <h2>애옹이네</h2>
        </v-row>

        <!-- Image Banner -->
        <v-row justify="center">
            <v-img :src="this.bannerImage" alt="Farm Image" class="banner-image" height="400px" width="1000px" contain></v-img>
        </v-row>
        <br>
        <v-row justify="center" class="mt-5 menubar" style="line-height: 15px;">
            <v-col cols="3" class="text-center">
                <span
                @click="this.$router.push(`/farm/${farmId}`)"
                class="nav-link"
                :class="{ 'selected-menu': this.currentMenu === 1 }"
                >농장 소개</span>
            </v-col>
            <v-col cols="3" class="text-center">
                <span
                @click="this.$router.push(`/farm/${farmId}/packages`)"
                class="nav-link"
                :class="{ 'selected-menu': this.currentMenu === 2 }"
                >패키지 보기</span>
            </v-col>
            <v-col cols="3" class="text-center">
                <span
                @click="this.$router.push(`/farm/${farmId}/notice/list`)"
                class="nav-link"
                :class="{ 'selected-menu': this.currentMenu === 3 }"
                >농장 공지</span>
            </v-col>
            <v-col cols="3" class="text-center">
                <span
                @click="this.$router.push(`/farm/${farmId}/reviews`)"
                class="nav-link"
                :class="{ 'selected-menu': this.currentMenu === 4 }"
                >상품 후기</span>
            </v-col>
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
            bannerImage: ""
        }
    },
    async created() {
        const route = useRoute();
        this.farmId = route.params.farmId;

        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth/detail/${this.farmId}`);
            console.log(response);
            this.bannerImage = response.data.bannerImageUrl;
            console.log(this.bannerImage);
        } catch(e) {
            console.log(e);
        }
        
    }
}
</script>
<style>
.nav-link {
    opacity: 0.7;
}
.nav-link:hover {
    opacity: 1;
    transition: 0.3s ease; }

.menubar {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    margin-bottom: 30px;
    margin-top: 30px;
    height: 40px;
}


.selected-menu {
    opacity: 1;
}
</style>