<template>
    <v-container class="custom-container">
        <!-- top 10 시작 -->
        <v-card style="border-radius: 15px; padding: 20px; max-width: 1200px; width: 100%;" rounded="0" flat>
            <v-card-title style="font-size: 20px; margin-bottom: 30px;"> <span style="font-weight: bold;">🏆 BEST 10 </span>
                <span style="font-size: 15px; color: grey;"> 즐겨찾기 수가 많은 농장들입니다. </span>
            </v-card-title>
                <BestFarmMovingSlide />
        </v-card>
        <!-- top 10 끝 -->

        <br>
        <div class="hr-style"></div>
        <br>
        
        <!-- 농장 리스트 -->
        <v-container style="width: 100%;">
            <v-card-title style="font-size: 20px;"> <span style="font-weight: bold;">🏡 농장 둘러보기 </span>
            </v-card-title>

            <v-row style="margin-top: 20px; padding-right: 1.8%;">
                <v-col cols="6"></v-col>
                <v-col cols="2">
                    <div class="select-wrapper">
                        <select v-model="sortOption" class="sort-select" @change="onSearch">
                            <option value="" disabled selected>정렬 기준</option>
                            <option v-for="option in sortOptions" :key="option" :value="option">{{ option }}</option>
                        </select>
                        <svg-icon type="mdi" :path="mdiMenuDown" class="dropdown-icon"></svg-icon>
                    </div>
                </v-col>
                <v-col cols="4">
                    <form class="searchbar" @submit.prevent="onSearch">
                        <input 
                            style="width: 100%; margin-left: 15px;" 
                            placeholder="검색어를 입력하세요."
                            v-model="searchQuery" 
                            @input="onSearch"
                        />
                        <button type="submit">
                            <img style="margin-right: 15px; margin-top: 8px"
                                src="https://d3cpiew7rze14b.cloudfront.net/assets/svg/Search-icon-24x-24_qnmx4o57C.svg"
                                alt="검색">
                        </button>
                    </form>
                </v-col>
            </v-row>
            
            <v-row>
                <div v-for="(farm, index) in farmList" :key="index" class="farm-card-outer">
                    <div class="farm-info">
                        <v-row>
                            <v-col cols="1">
                                <!-- 사진 영역 -->
                                <div class="farm-image-frame">
                                    <v-img :src="farm.imageUrl" class="farm-image-circle"
                                    @click="this.$router.push(`/farm/${farm.id}/packages`)" cover />
                                </div>
                            </v-col>

                            <v-col style="justify-content: start;">
                                <v-row>
                                    <!-- 제목 영역 -->
                                    <div class="farm-description">
                                        <p style="font-size: 15px; font-weight: 600; font-size: 16px;">{{ farm.farmName }}</p>
                                    </div>
                                    <!-- 즐겨찾기 영역 -->
                                    <div style="line-height: 70px; display: flex; justify-content: center; align-items: center;">
                                        <div v-if="likes.get(farm.id) == 2" class="heart-emoji">
                                            <svg-icon type="mdi" :path="mdiHeart" class="icon-colored"></svg-icon>
                                        </div>

                                        <v-chip class="like-chip" size="small" variant="outlined"
                                            :class="{ 'selected-like-chip': likes.get(farm.id) == 1 || likes.get(farm.id) == 2 }"
                                            @click="clickLike(farm.id)">
                                            <svg-icon type="mdi"
                                                :path="likes.get(farm.id) == 1 || likes.get(farm.id) == 2 ? mdiHeart : mdiHeartOutline"
                                                :class="likes.get(farm.id) == 1 || likes.get(farm.id) == 2 ? 'icon-colored' : 'icon-trans'"></svg-icon>
                                                <span style="font-weight: bold; font-size: 14px; padding-top: 2px">{{ likeCount.get(farm.id) }}</span>
                                        </v-chip>
                                    </div>
                                </v-row>
                                <v-row>
                                    <div class="order-count-box">
                                        <v-chip class="order-count-chip" size="small">
                                            판매 {{ farm.orderCount }}개
                                        </v-chip>
                                    </div>
                                </v-row>
                            </v-col>
                        </v-row>
                    </div>

                    <div class="package-info">
                        <div style="margin-top: 10px; display: flex; border-radius: 10px;" class="package-images-box">
                            <div v-for="(product, index) in farm.packages" :key="index" class="product-image-frame">
                                <img :src="product.imageUrl" class="package-img"
                                    @click="this.$router.push(`/product/${product.packageId}`)" />
                            </div>
                        </div>
                    </div>
                </div>
            </v-row>
        </v-container>

        <!-- 농장 리스트 끝 -->

        <v-dialog v-model="this.loginModal" max-width="300px">
            <v-card class="modal"
                style="align-items: center; text-align: center; height: 160px; padding-bottom: 20px; overflow-y: hidden;">
                <v-card-text>
                    로그인이 필요한 서비스입니다.<br>
                    로그인 하시겠습니까?
                </v-card-text>
                <v-row>
                    <v-btn @click="this.$router.push('/member/sign-in')" class="submit-btn"
                        style="background-color: #BCC07B;">로그인하기</v-btn>
                    <v-btn @click="this.loginModal = false" class="submit-btn"
                        style="background-color: #e0e0e0;">close</v-btn>
                </v-row>

            </v-card>
        </v-dialog>


        <v-dialog v-model="this.sellerModal" max-width="300px">
            <v-card class="modal"
                style="align-items: center; text-align: center; height: 160px; padding-bottom: 20px; overflow-y: hidden;">
                <v-card-text>
                    판매자 회원은 다른 농장을<br>즐겨찾기할 수 없습니다.
                </v-card-text>
                <v-row>
                    <v-btn @click="this.sellerModal = false" class="submit-btn"
                        style="background-color: #e0e0e0;">close</v-btn>
                </v-row>

            </v-card>
        </v-dialog>

    </v-container>
</template>
<script>
import BestFarmMovingSlide from '@/components/slide/BestFarmMovingSlide.vue';
import axios from 'axios';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHeartOutline } from '@mdi/js';
import { mdiHeart } from '@mdi/js';
import { mdiMenuDown } from '@mdi/js';

export default {
    name: "my-component",
    components: {
        SvgIcon,
        BestFarmMovingSlide
    },
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
            sellerModal: false,
            mdiHeart: mdiHeart,
            mdiHeartOutline: mdiHeartOutline,
            mdiMenuDown: mdiMenuDown,
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
            const packages = res.data.slice(0, 10);

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

                if (localStorage.getItem('role') == 'SELLER') {
                    this.sellerModal = true;
                    return;
                }

                if (localStorage.getItem('memberId') == undefined) {
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
.icon-colored {
    color: red;
    transform: scale(0.8);
    width: 22px;
    height: 22px;
}

.icon-trans {
    transform: scale(0.8);
}

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
    line-height: 70px;
}



.package-img {
    height: 200px;
    width: 200px;
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



.product-image-frame {
    height: 200px !important;
    width: 200px !important;
    min-width: 200px !important;
    overflow: hidden;
    border-radius: 5px;
    margin-right: 6px;
    transition: transform 0.3s ease;
    border-radius: 5px;
}


.product-image-frame img {
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
    height: 300px;
    width: 100%;
    margin-top: 10px;
    display: flex;
    border-radius: 10px;
    padding: 3px;
    overflow-y: hidden;
    overflow-x: scroll;
    -ms-overflow-style: none;
}

.package-images-box::-webkit-scrollbar {
    display: none;
}

.order-count-box {
    width: auto;
    margin-left: -1%;
    margin-top: -2%;

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
    border: 1px solid white !important;
    border-radius: 3px;
    color: black !important;
    padding-bottom: 2px;
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

.hr-style {
    border-bottom: 3px solid #efefef; border-radius: 3px;
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

.select-wrapper {
    width: 100%;
    position: relative;
    display: inline-block
}

.dropdown-icon {
    position: absolute;
    top: 37%;
    right: -10px;
    transform: translateY(-50%);
    pointer-events: none; /* 클릭 방지 */
}

.searchbar {
    display: flex;
    background-color: rgb(245 245 247);
    border-radius: 4px;
    justify-content: space-between;
    width: 100%;
}

.sort-select {
    background-color: rgb(245 245 247);
    width: 100%;
    margin: 0 2px 10px 15px;
    padding: 8px;
    padding-left: 12px;
    border-radius: 4px;
}

.search-icon {
    transition: color 0.3s ease;
}
</style>
