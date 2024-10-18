<template>
    <div class="member-page" style="padding-right: 300px;">
    <MemberSidebar />
    <h3 style="margin-right: 65%;">스크랩 농장 / 위시리스트</h3><br>
    <!-- 스크랩 농장 -->
    <div class="fav-farm">
        <v-card style="padding: 7px 3px; max-width: 1200px; width: 100%;" rounded="0" flat>
            <v-card-title style="font-size: 17px; font-weight: 700;">✨ 스크랩한 농장</v-card-title>
            <v-card-text style="color: gray; font-size: 14px;">회원님이 스크랩한 농장입니다.</v-card-text><br>
            <div style="display: flex; justify-content: center; align-items:center;">
                <v-btn icon="mdi-chevron-left" variant="plain" @click="prevFarm" :disabled="farmOnboarding === 1" style="margin-bottom: 35px;"></v-btn>
                <v-window v-model="farmOnboarding" style="width: 1080px;">
                    <v-window-item v-for="n in farmWindowCount" :key="`farm-window-${n}`" :value="n">
                        <v-row class="d-flex justify-center">
                            <v-col v-for="(farm, index) in paginatedFarms(n)" :key="index" cols="12" md="3" class="d-flex justify-center">
                                <v-card variant="text" style="width:200px; height:270px;">
                                    <v-img class="farm-image" width="200px" height="230px" :src="farm.profileImageUrl" alt="Farm 썸네일" cover style="cursor: pointer;" @click="this.$router.push(`/farm/${farm.farmId}/packages`)" />
                                    <v-card-text style="padding: 0; margin-top: 10px; text-align:center;">
                                        <span v-if="farm.farmName.length > 10"> {{ farm.farmName.substring(0, 10) }}...</span>
                                        <span v-else> {{ farm.farmName }}</span>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-window-item>
                </v-window>
                <v-btn icon="mdi-chevron-right" variant="plain" @click="nextFarm" :disabled="!canGoToNextFarm" style="margin-bottom: 35px;"></v-btn>
            </div>
            <br>
        </v-card>
    </div>
    <br>
    <!-- 위시리스트  -->
    <div class="fav-farm">
        <v-card style="padding: 7px 3px; max-width: 1200px; width: 100%;" rounded="0" flat>
            <v-card-title style="font-size: 17px; font-weight: 700;">💛 위시리스트</v-card-title>
            <v-card-text style="color: gray; font-size: 14px;">회원님의 위시리스트 상품입니다.</v-card-text><br>
            <div style="display: flex; justify-content: center; align-items:center;">
                <v-btn icon="mdi-chevron-left" variant="plain" @click="prevWish" :disabled="wishOnboarding === 1" style="margin-bottom: 35px;"></v-btn>
                <v-window v-model="wishOnboarding" style="width: 1080px;">
                    <v-window-item v-for="n in wishWindowCount" :key="`wish-window-${n}`" :value="n">
                        <v-row class="d-flex justify-center">
                            <v-col v-for="(wish, index) in paginatedWish(n)" :key="index" cols="12" md="3" class="d-flex justify-center">
                                <v-card variant="text" style="width:200px; height:270px;">
                                    <v-img class="wish-image" width="200px" height="230px" :src="wish.imageUrls[0]" alt="Farm 썸네일" style="cursor: pointer;" cover @click="this.$router.push(`/product/${wish.id}`)" />
                                    <v-card-text style="padding: 0; margin-top: 10px; text-align:center;">
                                        <span v-if="wish.packageName.length > 10"> {{ wish.packageName.substring(0, 10) }}...</span>
                                        <span v-else> {{ wish.packageName }}</span>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-window-item>
                </v-window>
                <v-btn icon="mdi-chevron-right" variant="plain" @click="nextWish" :disabled="!canGoToNextWish" style="margin-bottom: 35px;"></v-btn>
            </div>
            <br>
        </v-card>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import MemberSidebar from '@/components/sidebar/MemberSidebar.vue';

export default {
    components: {
        MemberSidebar
    },
    data() {
        return {
            favoriteFarmList: [], // 즐겨찾기 농장 리스트
            farmOnboarding: 1,
            farmWindowCount: 3,
            isLoading: false,

            wishList: [],
            wishOnboarding: 1,
            wishWindowCount: 3,
        }
    },
    computed: {
        canGoToNextFarm() {
            const farmsPerPage = 4;
            const totalPages = Math.ceil(this.favoriteFarmList.length / farmsPerPage);
            return this.farmOnboarding < totalPages;
        },
        canGoToNextWish() {
            const wishPerPage = 4;
            const totalPages = Math.ceil(this.wishList.length / wishPerPage);
            return this.wishOnboarding < totalPages;
        },
    },
    async created() {
        await this.fetchFavoriteFarms(); // 즐겨찾기 농장 불러오기
        await this.fetchWishList(); 
    },
    methods: {
        async fetchFavoriteFarms() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/favorite/farm`);
            this.favoriteFarmList = response.data;
        },
        nextFarm() {
            if (this.canGoToNextFarm) {
                this.farmOnboarding += 1;
            }
        },
        prevFarm() {
            if (this.farmOnboarding > 1) {
                this.farmOnboarding -= 1;
            }
        },
        paginatedFarms(page) {
            const farmsPerPage = 4;
            const start = (page - 1) * farmsPerPage;
            const end = start + farmsPerPage;
            return this.favoriteFarmList.slice(start, end);
        },

        // wish
        async fetchWishList() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/wishlist`);
                this.wishList = response.data;
                console.log(">>>>>wish: ", this.wishList);
            } catch(e) {
                console.log(e.message);
            }
        },
        nextWish() {
            if (this.canGoToNextWish) {
                this.wishOnboarding += 1;
            }
        },
        prevWish() {
            if (this.wishOnboarding > 1) {
                this.wishOnboarding -= 1;
            }
        },
        paginatedWish(page) {
            const wishPerPage = 4;
            const start = (page - 1) * wishPerPage;
            const end = start + wishPerPage;
            return this.wishList.slice(start, end);
        },

        
    }
}
</script>

<style scoped>
.toDetail {
    color: #FFAF6E;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
}

.detail-container{
    display: flex;
    justify-content: flex-start;
    gap: 10px;
}
.member-page {
    background-color: #F3F3F3;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    flex-direction: column;
}

.fav-farm {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px 20px;
    width: 905px;
    min-height: 400px;
    margin-left: 20%;
    background-color: white;
}
</style>