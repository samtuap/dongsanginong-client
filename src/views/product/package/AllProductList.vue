<template>
    <v-container class="custom-container">
        <!-- Top 10 패키지 시작 -->
        <v-card style="border-radius: 15px; padding: 20px; max-width: 1200px; width: 100%;" rounded="0" flat>
            <v-card-title>Best 10</v-card-title>
            <v-card-text style="color: gray;">가장 많이 판매된 패키지입니다.</v-card-text>
            <div style="display: flex; justify-content: center; align-items:center;">
                <v-btn icon="mdi-chevron-left" variant="plain" @click="prev"></v-btn>
                <v-window v-model="onboarding" style="width: 1080px;">
                    <!-- v-model="onboarding": 현재 활성화된 슬라이드의 인덱스를 바인딩 -->
                    <v-window-item v-for="n in windowCount" :key="`window-${n}`" :value="n">
                        <v-row class="d-flex justify-center">
                            <v-col v-for="(pkg, index) in paginatedPackages(n)" :key="index" cols="12" md="3"
                                class="d-flex justify-center">
                                <v-card variant="text" style="width:190px; height:230px;">
                                    <v-img class="package-image" width="190px" height="180px" :src="pkg.imageUrl"
                                        alt="Package 썸네일" cover @click="this.$router.push(`/product/${pkg.id}`)" />
                                    <v-card-text>
                                        <span v-if="pkg.packageName.length > 10"> {{ pkg.packageName.substring(0, 10)
                                            }}... </span>
                                        <span v-else> {{ pkg.packageName }}</span>
                                        <v-chip size="small" color="deep_orange">
                                            💛 {{ pkg.orderCount }}
                                        </v-chip>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-window-item>
                </v-window>
                <v-btn icon="mdi-chevron-right" variant="plain" @click="next"></v-btn>
            </div>
            <v-card-actions style="margin: auto; justify-content: center;">
                <v-item-group v-model="onboarding" class="text-center" mandatory>
                    <v-item v-for="n in windowCount" :key="`btn-${n}`" v-slot="{ isSelected, toggle }" :value="n">
                        <v-btn :color="isSelected ? 'yellow' : 'deep_green'" icon="mdi-circle-small"
                            @click="toggle"></v-btn>
                    </v-item>
                </v-item-group>
            </v-card-actions>
        </v-card>
        <!-- Top 10 패키지 끝 -->

        <!-- 패키지 리스트 -->
        <v-container style="width: 100%; border-top: 1px solid #D4D4D4; text-align: center;">
            <h3>패키지 둘러보기</h3>

            <v-row style="margin-top: 20px;">
                <v-col cols="6"></v-col>
                <v-col cols="2">
                    <v-select v-model="sortOption" :items="sortOptions" solo density="compact" variant="solo"
                        label="정렬 기준" class="sort-select">
                    </v-select>
                </v-col>
                <v-col cols="4">
                    <v-text-field :loading="isLoading" v-model="searchQuery" label="검색어를 입력하세요." class="search-bar"
                        append-inner-icon="mdi-magnify" append-inner-icon-class="search-icon" density="compact"
                        variant="solo" single-line @click:append-inner="onSearch">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-container class="d-flex custom-card-container">
                <v-row>
                    <v-card v-for="(pkg, index) in packageList" :key="index" class="package-card" md="2" variant="text"
                        style="width:190px; height:230px; margin: 10px; margin-bottom: 15px;">
                        <v-img class="package-image" width="190px" height="180px" :src="pkg.imageUrl" alt="Package 썸네일"
                            cover @click="this.$router.push(`/product/${pkg.id}`)" />
                        <v-card-text>
                            <span v-if="pkg.packageName.length > 10"> {{ pkg.packageName.substring(0, 10) }}... </span>
                            <span v-else> {{ pkg.packageName }}</span>
                            <v-chip size="small" color="deep_orange">
                                💛 {{ pkg.orderCount }}
                            </v-chip>
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-container>
        </v-container>
        <!-- 패키지 리스트 끝 -->
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            topPackageList: [],
            onboarding: 1,
            windowCount: 3,
            packageList: [],
            currentPage: 0,
            pageSize: 10,
            searchQuery: "",
            sortOptions: [
                "최신순", "판매량 순"
            ],
            sortOption: "최신순",
            sortOptionMap: new Map(),
            isLoading: false,
            isLastPage: false,
        }
    },
    async created() {
        // Top 10 패키지 가져오기
        const topPackagesResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/top10`);
        this.topPackageList = topPackagesResponse.data;

        // 전체 패키지 리스트 가져오기
        let params = {
            page: this.currentPage,
            size: this.pageSize,
            sort: this.sortOptionMap.get(this.sortOption),
            packageName: this.searchQuery
        }
        const packageListResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth`, { params });
        this.packageList = packageListResponse.data.content;

        // sortOptionMap 설정
        this.sortOptionMap.set("최신순", "id,desc");
        this.sortOptionMap.set("판매량 순", "orderCount,desc");

        // 페이지네이션을 위한 이벤트 리스너 추가
        window.addEventListener('scroll', this.scrollPagination); // 스크롤 이벤트
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.onSearch();
            }
        }); // 엔터 키 이벤트
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
        paginatedPackages(page) {
            // 페이지에 따라 패키지를 반환
            const packagesPerPage = 4;
            const start = (page - 1) * packagesPerPage;
            const end = start + packagesPerPage;
            return this.topPackageList.slice(start, end);
        },
        async onSearch() {
            this.currentPage = 0;
            this.pageSize = 10;
            const params = {
                page: this.currentPage,
                size: this.pageSize,
                sort: this.sortOptionMap.get(this.sortOption),
                packageName: this.searchQuery
            }
            console.log(params)
            this.isLoading = true;
            try {
                const farmListResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/search`, { params });
                this.packageList = farmListResponse.data.content;
                this.isLastPage = farmListResponse.data.last;
            } catch (error) {
                console.error(error);
            }
            this.isLoading = false;
        },
        async loadPackage() {
            try {
                if (this.isLoading || this.isLastPage) return;
                this.isLoading = true;
                this.currentPage++;
                let params = {
                    page: this.currentPage,
                    size: this.pageSize,
                    sort: this.sortOptionMap.get(this.sortOption),
                    packageName: this.searchQuery
                }
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth`, { params });
                const additionalData = response.data.content;
                this.packageList = [...this.packageList, ...additionalData];
                this.isLastPage = response.data.last;
                this.isLoading = false;
            } catch (e) {
                console.log(e);
                this.isLoading = false;
            }
            console.log(this.currentPage);
        },
        scrollPagination() {
            const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
            if (isBottom && !this.isLastPage && !this.isLoading) {
                this.loadPackage();
            }
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

/* Target the appended icon specifically */
.search-icon {
    transition: color 0.3s ease;
}

/* Apply hover effect */
.search-icon:hover {
    cursor: pointer;
    transition: color 0.3s ease;
}

.package-image {
    transition: color 0.7s ease;
}

.package-image:hover {
    opacity: 0.85;
    cursor: pointer;
    transition: 0.7s ease;
}

.custom-card-container {
    display: flex;
    justify-content: left;
}
</style>
