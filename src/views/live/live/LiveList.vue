<template>
    <v-container>
        <!-- 즐겨찾기 농장 중 진행중인 라이브 : seller에게는 나타나지 않음 -->
        <v-card style="border-radius: 15px; padding: 20px; max-width: 1200px; width: 100%; border-bottom: 1px solid #D4D4D4;" 
        rounded="0" flat v-if="!isSeller">
            <v-card-title>✨ Favorites</v-card-title>
            <v-card-text style="color: gray;">스크랩 된 농장의 라이브 목록입니다.</v-card-text>
            <div style="display: flex; justify-content: center; align-items:center;">
                <v-btn icon="mdi-chevron-left" variant="plain" @click="prev"></v-btn>
                <v-window v-model="onboarding" style="width: 1080px;">
                    <v-window-item v-for="n in windowCount" :key="`window-${n}`" :value="n">
                        <v-row class="d-flex justify-center">
                        <v-col v-for="live in paginatedLives(n)" :key="live.id" cols="12" md="3" class="d-flex justify-center">
                            <v-card variant="text" style="width:235px; height:360px;">
                            <!-- <v-card-text style="text-align: center;"><span style="border-bottom: 2px solid #D4D4D4;"><strong>{{ live.farmName }}</strong></span></v-card-text> -->
                            <v-img
                                class="live-image"
                                width="235"
                                height="300px"
                                :src="live.liveImage"
                                alt="Farm 썸네일"
                                cover
                            />
                            <v-card-text style="text-align: center;">
                                <span v-if="live.title.length > 10">[ {{ live.farmName }} ] {{ live.title.substring(0, 10) }}...</span>
                                <span v-else>[ {{ live.farmName }} ] {{ live.title }}</span>
                            </v-card-text>
                            </v-card>
                        </v-col>
                        </v-row>
                    </v-window-item>
                </v-window>
                <v-btn icon="mdi-chevron-right" variant="plain" @click="next"></v-btn>

            </div>
            <!-- <br> -->
            <v-card-actions style="justify-content: center;">
                <v-item-group v-model="onboarding" class="text-center" mandatory>
                    <v-item v-for="n in windowCount" :key="`btn-${n}`" v-slot="{ isSelected, toggle }" :value="n">
                        <v-btn :color="isSelected ? 'yellow' : 'deep_green'" icon="mdi-circle-small"
                            @click="toggle"></v-btn>
                    </v-item>
                </v-item-group>
            </v-card-actions>
        </v-card>
        
        <!-- 진행 중인 라이브 목록 -->
        <v-container style="width: 100%; text-align: center;">
            <h3>라이브 목록</h3>
            <v-btn v-if="isSeller" class="start-btn">라이브 시작</v-btn>

            <v-container class="d-flex custom-card-container">
                <v-row style="justify-content: center;">
                    <v-card v-for="live in liveList" :key="live.id" class="farm-card" md="2" variant="text" style="width:200px; height:360; margin: 10px; margin-bottom: 15px;">
                        <!-- <v-card-text style="text-align: center;"><span style="border-bottom: 2px solid #D4D4D4;"><strong>{{ live.farmName }}</strong></span></v-card-text> -->
                        <v-img
                        class="farm-image"
                        width="200px"
                        height="300px"
                        :src="live.liveImage"
                            alt="Farm 썸네일" cover />
                        <v-card-text>
                            <span v-if="live.title.length > 10">[ {{ live.farmName }} ] {{ live.title.substring(0, 10) }}... </span>
                            <span v-else>[ {{ live.farmName }} ] {{live.title}}</span>
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-container>
        </v-container>

    </v-container>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            isSeller: false,
            favoritesLiveList: [], 
            onboarding: 1,
            windowCount: 3,
            liveList: [],
        };
    },
    async created() {
        // 즐찾 뿌리기
        const role = localStorage.getItem('role');
        if (role === 'SELLER') {
            this.isSeller = true;
        } else {
            this.isSeller = false;
            
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/favorites/farm/live/list`, {
                    headers: {
                        myId: localStorage.getItem('memberId')
                    }
                });

                this.favoritesLiveList = response.data;
                this.windowCount = Math.ceil(this.favoritesLiveList.length / 4);
            } catch (e) {
                console.log(e.message);
            }
        }

        // 라이브 목록 뿌리기 
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/live/active`);
            this.liveList = response.data;
        } catch(e) {
            console.log(e);
        }
    },
    methods: {
        paginatedLives(page) {
            const livePerPage = 4; 
            const start = (page - 1) * livePerPage;
            const end = start + livePerPage;
            return this.favoritesLiveList.slice(start, end); 
        },
        next() {
            this.onboarding = this.onboarding + 1 > this.windowCount ? 1 : this.onboarding + 1;
        },
        prev() {
            this.onboarding = this.onboarding - 1 <= 0 ? this.windowCount : this.onboarding - 1;
        },
    }
}
</script>

<style scoped>
.start-btn {
    background-color: #BCC07B; 
    border-radius: 50px;
    float: right;
    margin-right: 30px;
    font-weight: 700;
}
</style>