<template>
    <v-container class="custom-container">
        <!-- top 10 시작 -->
        <v-card style="border-radius: 15px; padding: 20px; max-width: 1200px; width: 100%;" rounded="0" flat>
            <v-card-title>Best 10</v-card-title>
            <v-card-text style="color: gray;">가장 많이 스크랩된 농장입니다.</v-card-text>
            <div style="display: flex; justify-content: center; align-items:center;">
                <v-btn icon="mdi-chevron-left" variant="plain" @click="prev"></v-btn>
                <v-window v-model="onboarding" style="width: 1080px;">
                    <v-window-item v-for="n in windowCount" :key="`window-${n}`" :value="n"
                        style="align-items: center;">
                        <v-row class="d-flex" style="align-items: center; padding-top: 20px;">
                            <div v-for="(farm, index) in paginatedFarms(n)" :key="index" style="margin-left: 50px;"
                                class="card-outer">
                                <div style="padding-bottom: 30px;">
                                    <v-img class="favorite-farm-img" style="width:190px; height:190px;"
                                        @click="this.$router.push(`/farm/${farm.id}`)" :src="farm.imageUrl"
                                        alt="Farm 썸네일" cover />
                                </div>

                                <div style="display: flex; width: 190px; height: 30px;">
                                    <div class="grade" :class="{ 'top-grade': (4 * (n - 1) + index + 1) <= 3 }">{{ 4 *
                                        (n - 1) +
                                        index + 1 }}</div>
                                    <div style="width: 120px;">
                                        <p v-if="farm.farmName.length < 8" style="font-size: 14px; font-weight: 500;">
                                            {{ farm.farmName }}</p>
                                        <p v-else style="font-size: 14px; font-weight: 500;"> {{
                                            farm.farmName.substring(0, 8) }}... </p>
                                    </div>


                                    <v-chip class="like-chip" size="small" color="deep_orange"
                                        :class="{ 'selected-like-chip': this.likes.get(farm.id) == 1 || this.likes.get(farm.id) == 2 }"
                                        @click="clickLike(farm.id)">
                                        💛 {{ likeCount.get(farm.id) }}
                                    </v-chip>

                                    <div v-if="likes.get(farm.id) == 2" class="heart-emoji">💛</div>
                                </div>

                            </div>
                        </v-row>
                    </v-window-item>
                </v-window>
                <v-btn icon="mdi-chevron-right" variant="plain" @click="next"></v-btn>
            </div>
            <v-card-actions style="justify-content: center;">
                <v-item-group v-model="onboarding" class="text-center" mandatory>
                    <v-item v-for="n in windowCount" :key="`btn-${n}`" v-slot="{ isSelected, toggle }" :value="n">
                        <v-btn :color="isSelected ? 'yellow' : 'deep_green'" icon="mdi-circle-small"
                            @click="toggle"></v-btn>
                    </v-item>
                </v-item-group>
            </v-card-actions>
        </v-card>
        <!-- top 10 끝 -->

        <!-- 농장 리스트 -->
        <v-container style="width: 100%; border-top: 1px solid #D4D4D4; text-align: center;">
            <h3>농장 둘러보기</h3>

            <v-row style="margin-top: 20px;">
                <v-col cols="6"></v-col>
                <v-col cols="2">
                    <v-select v-model="sortOption" :items="sortOptions" solo density="compact" variant="solo"
                        label="정렬 기준" class="sort-select">
                    </v-select>
                </v-col>
                <v-col cols="4">
                    <v-text-field :loading="loading" v-model="searchQuery" label="검색어를 입력하세요." class="search-bar"
                        append-inner-icon="mdi-magnify" append-inner-icon-class="search-icon" density="compact"
                        variant="solo" single-line @click:append-inner="onSearch">
                    </v-text-field>
                </v-col>

            </v-row>
            <v-row>
                <div v-for="(farm, index) in farmList" :key="index" class="farm-card-outer">

                    <div class="farm-info">
                        <!-- 사진 영역 -->
                        <div class="farm-image-frame">
                            <v-img :src="farm.imageUrl" class="farm-image-circle"
                                @click="this.$router.push(`/farm/${farm.id}`)" cover />
                        </div>
                        <!-- 제목 영역 -->
                        <div class="farm-description">
                            <p style="font-size: 15px; font-weight: 600; font-size: 16px;">{{ farm.farmName }}</p>
                        </div>

                        <!-- 즐겨찾기 영역 -->
                        <div class="order-count-box">
                            <v-chip class="order-count-chip" size="small">
                                판매 {{ farm.orderCount }}개
                            </v-chip>
                        </div>

                        <div style="line-height: 70px;">
                            <v-chip class="like-chip" size="small" color="deep_orange"
                                :class="{ 'selected-like-chip': likes.get(farm.id) == 1 || likes.get(farm.id) == 2 }"
                                @click="clickLike(farm.id)">
                                💛 {{ likeCount.get(farm.id) }}
                            </v-chip>

                            <!-- 하트 이모지 애니메이션 -->
                            <div v-if="likes[(4 * (n - 1) + index)] == 2" class="heart-emoji">💛</div>
                        </div>
                    </div>

                    <div class="package-info">

                        <div style="margin-top: 10px; display: flex; border-radius: 10px;"
                                class="package-images-box">
                            <div v-for="(product, index) in farm.packages" :key="index" class="product-image-frame">
                                <img :src="product.imageUrl" class="package-img" />
                            </div>
                        </div>
                    </div>
                </div>
            </v-row>
        </v-container>

        <!-- 농장 리스트 끝 -->

        <v-dialog v-model="this.loginModal" max-width="300px">
            <v-card class="modal" style="align-items: center; text-align: center; height: 160px; padding-bottom: 20px; overflow-y: hidden;">
                <v-card-text>
                    로그인이 필요한 서비스입니다.<br>
                    로그인 하시겠습니까?
                </v-card-text>
                <v-row>
                    <v-btn @click="this.$router.push('/member/sign-in')" class="submit-btn" style="background-color: #BCC07B;">로그인하기</v-btn>
                    <v-btn @click="this.loginModal = false" class="submit-btn" style="background-color: #e0e0e0;">close</v-btn>
                </v-row>

            </v-card>
        </v-dialog>


        <v-dialog v-model="this.sellerModal" max-width="300px">
            <v-card class="modal" style="align-items: center; text-align: center; height: 160px; padding-bottom: 20px; overflow-y: hidden;">
                <v-card-text>
                    판매자 회원은 다른 농장을<br>즐겨찾기할 수 없습니다. 😢
                </v-card-text>
                <v-row>
                    <v-btn @click="this.sellerModal = false" class="submit-btn" style="background-color: #e0e0e0;">close</v-btn>
                </v-row>

            </v-card>
        </v-dialog>

    </v-container>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            topFarmList: [],
            onboarding: 1,
            windowCount: 0,
            farmList: [],
            currentPage: 0,
            pageSize: 5,
            searchQuery: "",
            sortOptions: [
                "최신순", "즐겨찾기 많은 순", "판매량 순"
            ],
            sortOption: "최신순",
            sortOptionMap: new Map(),
            isLoading: false,
            isLastPage: false,
            likes: new Map(), // 0: 안눌려있는 상태, 1: 눌려있는 상태, 2: 눌리고 있는 상태(애니메이션처리)
            likeCount: new Map(),
            loginModal: false,
            sellerModal: false
        }

    },
    async created() {
        const params = {
            "page": 0,
            "size": this.pageSize,
            "sort": "favoriteCount,desc"
        }
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth`, { params });
        this.topFarmList = response.data.content;

        this.windowCount = parseInt(this.topFarmList.length / 4) + 1;

        for (let i = 0; i < this.topFarmList.length; ++i) {
            if (this.topFarmList[i].isLiked === true) {
                this.likes.set(this.topFarmList[i].id, 1);
            } else {
                this.likes.set(this.topFarmList[i].id, 0);
            }

            this.likeCount.set(this.topFarmList[i].id, this.topFarmList[i].favoriteCount);
        }


        const listParams = {
            "page": this.currentPage,
            "size": this.pageSize,
            "sort": "id,desc"
        }
        const farmListResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth`, { 'params': listParams });
        this.farmList = farmListResponse.data.content;

        // 상품 끼워넣기
        for (let i = 0; i < this.farmList.length; i++) {

            const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/for-sale/${this.farmList[i].id}`);

            console.log(res);
            const packages = res.data.slice(0, 5);

            this.farmList[i] = { ...this.farmList[i], "packages": packages };
        }


        for (let i = 0; i < this.farmList.length; ++i) {
            if (this.farmList[i].isLiked === true) {
                this.likes.set(this.farmList[i].id, 1);
            } else {
                this.likes.set(this.farmList[i].id, 0);
            }

            this.likeCount.set(this.farmList[i].id, this.farmList[i].favoriteCount);
        }


        // sortOptionMap 만들기
        this.sortOptionMap.set("최신순", "id,desc");
        this.sortOptionMap.set("즐겨찾기 많은 순", "favoriteCount,desc");
        this.sortOptionMap.set("판매량 순", "orderCount,desc");

        // 페이지네이션을 위한 이벤트 리스너 추가
        window.addEventListener('scroll', this.scrollPagination); // 스크롤을 움직였을 때
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.onSearch();
            }
        }); // 엔터를 눌렀을 때
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
            const farmsPerPage = 4;
            const start = (page - 1) * farmsPerPage;
            const end = start + farmsPerPage;
            return this.topFarmList.slice(start, end);
        },
        async onSearch() {
            this.currentPage = 0;

            const params = {
                page: this.currentPage,
                size: this.pageSize,
                sort: this.sortOptionMap.get(this.sortOption),
                farmName: this.searchQuery
            }

            const farmListResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth/search`, { params });
            this.farmList = farmListResponse.data.content;


            // 좋아요 수 세팅
            for (let i = 0; i < this.farmList.length; ++i) {
                if (this.farmList[i].isLiked === true) {
                    this.likes.set(this.farmList[i].id, 1);
                } else {
                    this.likes.set(this.farmList[i].id, 0);
                }

                this.likeCount.set(this.farmList[i].id, this.farmList[i].favoriteCount);
            }


            // 상품 끼워넣기
            for (let i = 0; i < this.farmList.length; i++) {
                const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/for-sale/${this.farmList[i].id}`);

                console.log(res);
                const packages = res.data.slice(0, 5);

                this.farmList[i] = { ...this.farmList[i], "packages": packages };
            }
        },
        async loadFarm() {
            try {

                if (this.isLoading || this.isLastPage) return;

                this.isLoading = true;
                this.currentPage++;
                let params = {
                    page: this.currentPage,
                    size: this.pageSize,
                    sort: this.sortOptionMap.get(this.sortOption),
                    farmName: this.searchQuery
                }

                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth/search`, { params });
                // 서버에서 주지 않은 데이터를 추가한 것이다.
                const additionalData = response.data.content;


                // 좋아요 수 세팅
                for (let i = 0; i < additionalData.length; ++i) {
                    if (additionalData[i].isLiked === true) {
                        this.likes.set(additionalData[i].id, 1);
                    } else {
                        this.likes.set(additionalData[i].id, 0);
                    }

                    this.likeCount.set(additionalData[i].id, additionalData[i].favoriteCount);
                }

                this.farmList = [...this.farmList, ...additionalData]; // 0번 페이지 + 1번 페이지 + ...
                this.isLastPage = response.data.last; // 라스트 여부
                if (this.isLastPage) {
                    this.isLastPage = true;
                }

                // 상품 끼워넣기
                for (let i = 0; i < this.farmList.length; i++) {
                    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/for-sale/${this.farmList[i].id}`);

                    console.log(res);
                    const packages = res.data.slice(0, 10);

                    this.farmList[i] = { ...this.farmList[i], "packages": packages };
                }

                this.isLoading = false; // 로딩 끝!
            } catch (e) {
                console.log(e);
            }

            console.log(this.currentPage);
        },
        scrollPagination() {
            const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

            if (isBottom && !this.isLastPage && !this.isLoading) {
                this.loadFarm();
            }
        },
        clickLike(farmId) {
            try {
                if (this.likes.get(farmId) != 0 && this.likes.get(farmId) != 1) {
                    return;
                }

                if(localStorage.getItem('role') == 'SELLER') {
                    this.sellerModal = true;
                    return;
                }

                if(localStorage.getItem('memberId') == undefined) {
                    this.loginModal = true;
                    return;
                }


                axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/favorites/farm/${farmId}`);

                let ret;

                if (this.likes.get(farmId) == 0) {
                    this.likes.set(farmId, 2);
                    this.likeCount.set(farmId, this.likeCount.get(farmId) + 1);
                    ret = 1;
                } else if (this.likes.get(farmId) == 1) {
                    this.likes.set(farmId, 3);
                    this.likeCount.set(farmId, this.likeCount.get(farmId) - 1);
                    ret = 0;
                }

                setTimeout(() => {
                    this.likes.set(farmId, ret); // 1초 후에 liked 상태 정적인 상태로 변경
                }, 1000);  // 1초 동안 하트 표시

            } catch (e) {
                console.log(e);

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

.farm-image {
    transition: color 0.7s ease;
}

.farm-image:hover {
    opacity: 0.85;
    cursor: pointer;
    transition: 0.7s ease;
}

.custom-card-container {
    display: flex;
    justify-content: left;
}

.card-outer {
    border: 1px #D4D4D4 solid;
    border-radius: 10px;
    padding: 5px;
    margin-bottom: 20px;
    transition: 0.5s ease;

}

.farm-card-outer {
    border-bottom: 1px #D4D4D4 solid;
    padding: 5px;
    margin-bottom: 20px;
    transition: 0.5s ease;
    width: 100%;
    height: 300px;
}

.card-outer:hover {
    box-shadow: 10px 10px #5D5D5D, 0 25px 40px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    transition: 0.7s ease;
}

.grade {
    width: 20px;
    height: 20px;
    min-width: 20px;
    text-align: center;
    line-height: 20px;
    background-color: #D8D8D8;
    margin-right: 7px;
    border-radius: 4px;
    color: #424242;
}

.top-grade {
    background-color: #FFE2A6;
    font-weight: bold;
    font-size: large;
    color: #DF7401;
}

.farm-info {
    display: flex;
}


.farm-image-circle {
    border-radius: 200px;
    width: 70px;
    height: 70px;
    border: solid 0.5px #D4D4D4;
    background-position: center;
    background-size: cover;
    /* 기본적으로 이미지를 꽉 채움 */
    transition: background-size 0.5s ease;
    /* 배율 변경 시 부드러운 트랜지션 효과 */
}

.farm-image-circle:hover {
    background-size: 120%;
    cursor: pointer;
    transition: background-size 0.5s ease;

}

.farm-description {
    margin-left: 20px;
    line-height: 70px;
}

.package-img {
    height: 200px;
    width: auto;
    border-radius: 5px;
}

.package-img:hover {
    cursor: pointer;
}

.favorite-farm-img {
    height: 150px;
    width: 150px;
    object-fit: cover;
    border-radius: 5px;
}

.favorite-farm-img:hover {
    cursor: pointer;
}

.package-images-box {
    height: 300px;
    width: 100%;
    margin-top: 10px;
    display: flex;
    border-radius: 10px;
    overflow-x: scroll;
    transition: all 0.3s ease;
    /* 부드러운 트랜지션 효과 */
}

.product-image-frame {
    height: 200px;
    width: auto;
    border-radius: 5px;
    margin-right: 6px;
    /* 영역을 넘어가는 부분을 잘라냄 */
    transition: transform 0.3s ease;
    border-radius: 5px;
    /* 이미지 확대 시 부드러운 트랜지션 */
}


.product-image-frame img {
    height: 100%;
    width: auto;
    border-radius: 5px;
    transition: transform 0.3s ease;
    /* 이미지 확대 시 부드러운 트랜지션 */
}

.product-image-frame:hover img {
    transform: scale(1.03);
    border-radius: 5px;
    /* 이미지 확대 */
}


.package-images-box {
    padding: 3px;
    -ms-overflow-style: none;
}

.package-images-box::-webkit-scrollbar {
    display: none;
}

.order-count-box {
    line-height: 70px;
    width: auto
}

.order-count-chip {
    color: rgb(220, 225, 153, 0.5);
    color: rgb(122, 124, 84);
    width: auto;
    margin-left: 10px;
    margin-right: 10px;
    font-size: small;
    border-radius: 3px;
}

.like-chip {
    border-radius: 3px;
}

.selected-like-chip {
    background-color: #FFE2A6;
}

.heart-emoji {
    position: absolute;
    transform: translateX(10px);
    /* 중앙 정렬을 위한 트랜스폼 */
    font-size: 24px;
    opacity: 0;
    /* 애니메이션 전에는 보이지 않도록 설정 */
    animation: popUp 1s ease-in-out forwards;
    /* 애니메이션 정의 */
    margin-left: 35px;
}


@keyframes popUp {
    0% {
        opacity: 0;
        transform: translate(-50%, 0) scale(0);
        /* 처음에는 원래 위치에서 scale 0으로 시작 */
    }

    50% {
        opacity: 1;
        transform: translate(-50%, -50px) scale(1.5);
        /* 위로 이동하면서 크기 확대 */
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -100px) scale(0);
        /* 더 위로 이동하면서 크기 축소 */
    }
}
</style>
