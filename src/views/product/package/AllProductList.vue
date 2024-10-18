<template>
    <v-container class="custom-container">
        <!-- Top 10 패키지 시작 -->
        <v-card style="border-radius: 15px; padding: 20px; padding-bottom: 0px; max-width: 1200px; width: 100%;" rounded="0" flat>
            <v-card-title style="font-size: 20px;"> <span style="font-weight: bold;">🏆 BEST 10 </span>
                <span style="font-size: 15px; color: grey;"> 지금 가장 인기있는 패키지를 만나보세요 ! </span>
            </v-card-title>
            <br />
            <div style="display: flex; justify-content: center; align-items:center;">
                <v-btn icon="mdi-chevron-left" variant="plain" @click="prev" style="margin-bottom: 15%;"></v-btn>
                <v-window v-model="onboarding" style="width: 1080px;">
                    <!-- v-model="onboarding": 현재 활성화된 슬라이드의 인덱스를 바인딩 -->
                    <v-window-item v-for="n in windowCount" :key="`window-${n}`" :value="n">
                        <v-row class="d-flex justify-center">
                            <v-col v-for="(pkg, index) in paginatedPackages(n)" :key="index" cols="12" md="3"
                                class="d-flex justify-center">
                                <v-card variant="text" style="width:260px; height:500px; margin: 10px; margin-bottom: 15px;" :rounded="false">
                                    <v-img class="package-image" :src="pkg.imageUrl" alt="Package 썸네일" cover
                                        @click="this.$router.push(`/product/${pkg.id}`)" :rounded="false"/>
                                    <v-chip class="d-inline-block"
                                        style="position: absolute; top: 10px; left: 10px; padding: 5px 10px; border-radius: 8px; background-color: rgba(128, 128, 128, 0.9); color: white;">
                                        {{ pkg.deliveryCycle }}일 주기 배송🚚
                                    </v-chip>
                                    <v-btn
                                        style="width: 100%; margin-top:10px; border: 0.5px solid gray; box-shadow: none;"
                                        @click="addToWishList(pkg)"
                                        v-if="member"
                                    >
                                    <div v-if="wishAnimation.get(pkg.id)" class="heart-emoji">
                                        <svg-icon type="mdi" :path="mdiHeart" class="icon-colored"></svg-icon>
                                    </div>
                                        <svg-icon
                                            type="mdi"
                                            :path="wishlistItems[pkg.id] ? mdiHeart : mdiHeartOutline"
                                            :style="{ marginRight: '2px', color: wishlistItems[pkg.id] ? 'red' : 'black' }"
                                            class="heart-icon"
                                        ></svg-icon>
                                        <span style="font-size: 14px;">{{ wishlistItems[pkg.id] ? '위시리스트 취소' : '위시리스트 담기' }}</span>
                                    </v-btn>
                                    <v-card-text style="padding-left: 0px;">
                                        <span style="" v-if="pkg.packageName.length > 10"> {{
                                            pkg.packageName.substring(0, 10)
                                        }}... </span>
                                        <span style="font-size:medium; font-weight: 400;" v-else> {{ pkg.packageName
                                            }}</span>
                                        <br />
                                        <span style="color:darkgreen; font-size:medium;"> {{
                                            formatPrice(pkg.price) }} </span>
                                        <br />
                                        <span style="color:#999; font-size: small;"> 1회 제공 금액 {{
                                            formatPrice(getPerCyclePrice(pkg.price, pkg.deliveryCycle)) }} </span>
                                        <br />
                                        <span style="color:#999; font-size: small;">
                                            🧾 누적 주문 {{ pkg.orderCount }}
                                        </span>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-window-item>
                </v-window>
                <v-btn icon="mdi-chevron-right" variant="plain" @click="next" style="margin-bottom: 15%;"></v-btn>
            </div>
            <v-card-actions style="justify-content: center;">
                <v-item-group v-model="onboarding" class="text-center" mandatory>
                    <v-item-group v-model="onboarding" class="text-center" mandatory>
                        <v-item v-for="n in windowCount" :key="`btn-${n}`" v-slot="{ isSelected, toggle }" :value="n">
                            <v-btn :color="isSelected ? 'yellow' : 'deep_green'" icon="mdi-circle-small"
                                @click="toggle"></v-btn>
                        </v-item>
                    </v-item-group>
                    
                </v-item-group>
            </v-card-actions>            
        </v-card>
        <!-- Top 10 패키지 끝 -->

        <br>
        <div class="hr-style"></div>
        <br>

        <!-- 패키지 리스트 -->
        <v-container style="width: 100%; text-align: start;">

            <v-card-title style="font-size: 20px;"> <span style="font-weight: bold;">🥦 패키지 살펴보기 </span>
            </v-card-title>

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
                    style="width:260px; height:500px; margin: 10px; margin-bottom: 15px;" :rounded="false">
                        <v-img class="package-image" :src="pkg.imageUrl" alt="Package 썸네일" cover
                            @click="this.$router.push(`/product/${pkg.id}`)" />
                        <v-chip class="d-inline-block"
                            style="position: absolute; top: 10px; left: 10px; padding: 5px 10px; border-radius: 8px; background-color: rgba(128, 128, 128, 0.9); color: white;">
                            {{ pkg.deliveryCycle }}일 주기 배송🚚
                        </v-chip>
                        <v-btn
                            style="width: 100%; margin-top:10px; border: 0.5px solid gray; box-shadow: none;"
                            @click="addToWishList(pkg)"
                            v-if="member"
                        >
                        <div v-if="wishAnimation.get(pkg.id)" class="heart-emoji">
                            <svg-icon type="mdi" :path="mdiHeart" class="icon-colored"></svg-icon>
                        </div>
                            <svg-icon
                                type="mdi"
                                :path="wishlistItems[pkg.id] ? mdiHeart : mdiHeartOutline"
                                :style="{ marginRight: '2px', color: wishlistItems[pkg.id] ? 'red' : 'black' }"
                                class="heart-icon"
                            ></svg-icon>
                            <span style="font-size: 14px;">{{ wishlistItems[pkg.id] ? '위시리스트 취소' : '위시리스트 담기' }}</span>
                        </v-btn>
                        <v-card-text style="padding-left: 0px;">
                            <span style="font-size:medium; font-weight: 400;" v-if="pkg.packageName.length > 10"> {{
                                pkg.packageName.substring(0, 10)
                            }}... </span>
                            <span style="font-size:medium; font-weight: 400;" v-else> {{ pkg.packageName }}</span>
                            <br />
                            <span style="color:darkgreen; font-size:medium;"> {{
                                formatPrice(pkg.price) }} </span>
                            <br />
                            <span style="color:#999; font-size: small;"> 1회 제공 금액 {{
                                formatPrice(getPerCyclePrice(pkg.price, pkg.deliveryCycle)) }} </span>
                            <br />
                            <span style="color:#999; font-size: small;">
                                🧾 누적 주문 {{ pkg.orderCount }}
                            </span>
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
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHeartPlusOutline } from '@mdi/js';
import { mdiHeartOutline, mdiHeart } from '@mdi/js';

export default {
    name: "my-component",
    components: {
        SvgIcon
    },
    data() {
        return {
            path: mdiHeartPlusOutline,
            topPackageList: [],
            onboarding: 1,
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

            wishlistItems: [],
            mdiHeartOutline: mdiHeartOutline,
            mdiHeart: mdiHeart,

            member: localStorage.getItem("memberId"),

            wishAnimation: new Map(),
        }
    },
    computed: {
        windowCount() {
            return Math.ceil(this.topPackageList.length / 4); // 페이지당 4개의 패키지가 표시된다고 가정
        }
    },
    async created() {
        // Top 10 패키지 가져오기
        try {
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
            console.log(this.packageList)
            // sortOptionMap 설정
            this.sortOptionMap.set("최신순", "id,desc");
            this.sortOptionMap.set("판매량 순", "orderCount,desc");
        } catch(e) {
            console.log(e);
        }


        // 페이지네이션을 위한 이벤트 리스너 추가
        window.addEventListener('scroll', this.scrollPagination); // 스크롤 이벤트
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.onSearch();
            }
        }); // 엔터 키 이벤트
    },
    async mounted() {
        await this.fetchWishlistItems();
    },
    methods: {
        async fetchWishlistItems() {
            try {
                const memberId = localStorage.getItem('memberId');
                if (memberId) {
                    const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/wishlist`);
                    console.log(">>>>>>>>response : ", response.data);
                    
                    const wishlistProductIds = response.data.map(product => product.id);
                    wishlistProductIds.forEach(id => {
                        this.wishlistItems[id] = true;
                    });
                }
            } catch (error) {
                console.error('위시리스트 정보를 가져오는데 실패했습니다:', error);
            }
        },
        formatPrice(value) {
            if (value == null) {
                return "0원";
            }
            return parseInt(value).toLocaleString('ko-KR') + ' 원'; // 한국어 화폐 양식으로 변환
        },
        getPerCyclePrice(price, deliveryCycle) {
            if (price == null || deliveryCycle == null || deliveryCycle == 0) {
                return 0; // 값이 없거나 deliveryCycle이 0일 경우 0 반환
            }
            // 10단위 반올림 처리
            const perCyclePrice = Math.round(price / (28 / deliveryCycle) / 10) * 10;
            return perCyclePrice;
        },
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
                const packageListResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/search`, { params });
                this.packageList = packageListResponse.data.content;
                this.isLastPage = packageListResponse.data.last;
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
        async addToWishList(packageProduct) {
            try {
                const memberId = localStorage.getItem('memberId');
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/wishlist/product/${packageProduct.id}`, {
                    headers: {
                        myId: memberId,
                    }
                });
                this.wishlistItems[packageProduct.id] = !this.wishlistItems[packageProduct.id];
                if (this.wishlistItems[packageProduct.id]) {
                // 애니메이션 시작
                this.wishAnimation.set(packageProduct.id, true);
                setTimeout(() => {
                    this.wishAnimation.set(packageProduct.id, false);
                }, 1000); // 애니메이션 지속 시간 조절 가능
            }
            } catch(e) {
                console.log(e.message);
            }
        }
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
    object-fit: cover;
    transition: transform 0.3s ease;
    /* border-radius: 10px; */
    width: 260px;
    height: 320px;
}

.package-image:hover {
    transform: scale(1.05);
    cursor: pointer;
}

.custom-card-container {
    display: flex;
    justify-content: left;
}

.heart-icon {
    width: 17px;
    height: 17px;
}

.hr-style {
    border-bottom: 3px solid #efefef; border-radius: 3px;
}

.icon-colored{
    color: red;
}

.heart-emoji {
    position: absolute;
    top: -20px; /* 필요에 따라 위치 조정 */
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    opacity: 0;
    animation: popUp 1s ease-in-out forwards;
}

@keyframes popUp {
    0% {
        opacity: 0;
        transform: translate(-50%, 0) scale(0);
    }
    50% {
        opacity: 1;
        transform: translate(-50%, -50px) scale(1.5);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -100px) scale(0);
    }
}
</style>
