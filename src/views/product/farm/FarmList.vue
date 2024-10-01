<template>
    <v-container class="custom-container">
        <v-row>
            <v-col cols="6"></v-col>
            <v-col cols="2">
                <v-select
                v-model="sortOption"
                :items="sortOptions"
                solo
                density="compact"
                variant="solo"
                label="정렬 기준"
                class="sort-select">
                </v-select>
            </v-col>
            <v-col cols="4">
                <v-text-field :loading="loading" v-model="searchQuery" label="검색어를 입력하세요." class="search-bar"
                @click:append="onSearch" append-inner-icon="mdi-magnify" density="compact" variant="solo"
                single-line @click:append-inner="onClick">
                </v-text-field>
            </v-col>

        </v-row>
        <!-- top 10 시작 -->
        <h3>Best 10</h3>
        <p style="color: gray;">가장 많이 스크랩된 농장입니다.</p>
        <v-card style="border-radius: 15px; padding: 20px; max-width: 1200px; width: 100%;" rounded="0" flat>
            <v-window v-model="onboarding" style="width: 1080px;">
                <!-- v-model="onboarding": 현재 활성화된 슬라이드의 인덱스를 바인딩 -->
                <v-window-item v-for="n in windowCount" :key="`window-${n}`" :value="n">
                    <v-row class="d-flex justify-center">
                        <v-col v-for="(farm, index) in paginatedFarms(n)" :key="index" cols="12" md="2"
                            class="d-flex justify-center">
                            <v-card variant="text" style="width:190px; height:230px;">
                                <v-img class="justify-space-between" width="190px" height="180px" :src="farm.imageUrl"
                                    alt="Farm 썸네일" cover />
                                <v-card-text>{{ farm.farmName }}, {{ farm.favoriteCount }}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-window-item>
            </v-window>
            <v-card-actions class="justify-space-between">
                <v-btn icon="mdi-chevron-left" variant="plain" @click="prev"></v-btn>
                <v-item-group v-model="onboarding" class="text-center" mandatory>
                    <v-item v-for="n in windowCount" :key="`btn-${n}`" v-slot="{ isSelected, toggle }" :value="n">
                        <v-btn :color="isSelected ? 'yellow' : 'deep_green'" icon="mdi-circle-small"
                            @click="toggle"></v-btn>
                    </v-item>
                </v-item-group>
                <v-btn icon="mdi-chevron-right" variant="plain" @click="next"></v-btn>
            </v-card-actions>
        </v-card>
        <!-- top 10 끝 -->

        <!-- 농장 리스트 -->
        <v-container style="width: 100%; border-top: 1px solid #D4D4D4; text-align: center;">
            <h3>농장 둘러보기</h3>
            <v-container class="d-flex justify-center ">
                <v-row>
                    <v-col v-for="(farm, index) in farmList" :key="index">
                        <v-card class="farm-card" variant="text" style="width:190px; height:230px;">
                            <v-img class="justify-space-between" width="190px" height="180px" :src="farm.imageUrl"
                                alt="Farm 썸네일" cover />
                            <v-card-text>{{ farm.farmName }}, {{ farm.favoriteCount }}</v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

            </v-container>
        </v-container>

        <!-- 농장 리스트 끝 -->


    </v-container>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            topFarmList: [],
            onboarding: 1,
            windowCount: 2,
            farmList: [],
            currentPage: 0,
            pageSize: 20,
            searchQuery: "",
            sortOptions: [
                "최신순", "즐겨찾기 많은 순", "판매량 순"
            ],
            sortOption: "최신순"
        }

    },
    async created() {
        const params = {
            "page": 0,
            "size": 10,
            "sort": "favoriteCount,desc"
        }
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/list`, { params });
        this.topFarmList = response.data.content;


        const listParams = {
            "page": this.currentPage,
            "size": this.pageSize,
            "sort": "id,desc"
        }
        const farmListResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/list`, { 'params': listParams });
        this.farmList = farmListResponse.data.content;

    },
    methods: {
        next() {
            this.onboarding =
                this.onboarding + 1 > this.windowCount ? 1 : this.onboarding + 1;
        },
        prev() {
            this.onboarding =
                this.onboarding - 1 <= 0 ? this.windowCount : this.onboarding - 1;
        },
        paginatedFarms(page) {
            // 페이지에 따라 프로젝트를 반환하도록 수정
            const farmsPerPage = 5;
            const start = (page - 1) * farmsPerPage;
            const end = start + farmsPerPage;
            console.log(this.topFarmList.slice(start, end));
            return this.topFarmList.slice(start, end);
        },

    }
}
</script>
<style scoped>
.custom-container {
    max-width: 1200px !important;
    /* 원하는 최대 폭 */
    margin: 0 auto !important;
    /* 중앙 정렬 */
    width: 100% !important;
    /* 컨테이너의 폭을 100%로 설정 */
}

.search-bar {
    width: 100%;
}

.sort-select {
    width: 100%;
    margin-right: 2px;
}
</style>