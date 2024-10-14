<template>
    <v-carousel cycle :show-arrows="false" delimiter-icon="mdi-square" delimiter-color="light_green" height="520"
        interval="5000" hide-delimiter-background> <!--5초마다 슬라이드-->
        <v-carousel-item v-for="(image, index) in images" :key="index" style="overflow: hidden;">
            <img :src="image.src" :alt="image.alt" class="banner-img" />
        </v-carousel-item>
    </v-carousel>

    <!-- 인기 패키지 -->
     <br>
    <v-container>
        <!-- 제목 -->
        <v-col cols="12">
            <div class="text-center" style="font-size: 23px; font-weight: bold;">
                🏆 패키지 실시간 인기 랭킹 🏆
            </div>
            <p class="text-center" style="color: grey; font-size: 16px;">가장 인기있는 상품만 모아보세요!</p>
        </v-col>

        <!-- 상품 슬라이드 -->
         <br>
        <v-window v-model="onboarding" style="width: 1080px; margin: auto;">
            <!-- v-model="onboarding": 현재 활성화된 슬라이드의 인덱스를 바인딩 -->
            <v-window-item v-for="n in packageWindowCount" :key="`window-${n}`" :value="n">
                <div class="d-flex">
                    <div v-for="(packageProduct, index) in paginatedPackages(n)" :key="index" style="margin-left: 50px;"
                        class="card-outer">
                        <div style="padding-bottom: 30px;">
                            <div class="package-img-box">
                                <v-img class="package-img" :src="packageProduct.imageUrl"
                                    @click="this.$router.push(`/package/${packageProduct.id}`)" alt="Farm 썸네일" cover />
                            </div>
                        </div>
                        <div style="display: flex; width: 190px;">
                            <div class="grade" :class="{ 'top-grade': (4 * (n - 1) + index + 1) <= 3 }">{{ 4 * (n - 1) +
                                index + 1 }}</div>
                            <!-- 패키지 이름 -->
                            <p v-if="packageProduct.packageName.length > 50" style="font-size: 13px; font-weight: 500;">
                                {{
                                    packageProduct.packageName.substring(0, 50) }}... </p>
                            <p v-else style="font-size: 15px; font-weight: 500;"> {{ packageProduct.packageName }}</p>
                        </div>

                        <div style="width: 190px;">
                            <p style="font-weight: 500; opacity: 0.5; font-size: small; margin-left: 27px;">{{
                                packageProduct.price }}
                                <span style="color: black; "> 원</span>
                            </p>
                        </div>
                    </div>
                </div>
            </v-window-item>
        </v-window>
        <v-card-actions style="justify-content: center; margin-top: -20px;">
            <v-item-group v-model="onboarding" class="text-center" mandatory>
                <v-item v-for="n in packageWindowCount" :key="`btn-${n}`" v-slot="{ isSelected, toggle }" :value="n">
                    <v-btn :color="isSelected ? 'yellow' : 'deep_green'" icon="mdi-circle-small"
                        @click="toggle"></v-btn>
                </v-item>
            </v-item-group>
        </v-card-actions>
        <!-- 전체보기 버튼 -->
        <v-col cols="12" class="text-center" style="margin-top: -20px;">
            <v-btn color="#FFFFFF" @click="this.$router.push('package')" style="border-radius: 50px;">
                🥦 패키지 전체보기
            </v-btn>
        </v-col>
    </v-container>
    <!-- 인기 패키지 끝 -->


    <!-- 인기 농장 -->
     <br>
    <v-container class="farm-container">
        <!-- 제목 -->
        <v-col cols="12">
            <div class="text-center" style="font-size: 23px; font-weight: bold;">
                🏠 실시간 인기 농장 🏠
            </div>
            <p class="text-center" style="color: grey; font-size: 16px;">즐겨찾기 수가 많은 농장들입니다.</p>
        </v-col>
        <br>
        <v-window v-model="farmOnboarding" style="width: 1080px; margin: auto;">
            <!-- v-model="onboarding": 현재 활성화된 슬라이드의 인덱스를 바인딩 -->
            <v-window-item v-for="n in farmWindowCount" :key="`window-${n}`" :value="n">
                <div style="display:flex">
                    <div v-for="(farm, index) in paginatedFarm(n)" :key="index" style="margin-left: 50px;"
                        class="card-outer">
                        <div style="padding-bottom: 30px;">
                            <v-img class="farm-img" style="width:190px; height:190px;" :src="farm.imageUrl"
                                alt="Farm 썸네일" cover />
                        </div>

                        <div style="display: flex; width: 190px; height: 30px;">
                            <div class="grade" :class="{ 'top-grade': (4 * (n - 1) + index + 1) <= 3 }">
                                {{ 4 * (n - 1) + index + 1 }}</div>
                            <div style="width: 120px;">
                                <p v-if="farm.farmName.length < 8" style="font-size: 15px; font-weight: 500;"> {{
                                    farm.farmName }}</p>
                                <p v-else style="font-size: 15px; font-weight: 500;"> {{ farm.farmName.substring(0, 8)
                                    }}... </p>
                            </div>


                            <v-chip
                                :class="{ 'selected-like-chip': this.likes[4 * (n - 1) + index] == 1 || this.likes[4 * (n - 1) + index] == 2 }"
                                class="like-chip" size="small" color="deep_orange"
                                @click="clickLike((4 * (n - 1) + index), farm.id)">
                                💛 {{ likeCount[4 * (n - 1) + index] }}
                            </v-chip>

                            <!-- 하트 이모지 애니메이션 -->
                            <div v-if="likes[(4 * (n - 1) + index)] == 2" class="heart-emoji">💛</div>
                        </div>

                    </div>
                </div>
            </v-window-item>
        </v-window>
        <v-card-actions style="justify-content: center;  margin-top: -20px;">
            <v-item-group v-model="farmOnboarding" class="text-center" mandatory>
                <v-item v-for="n in farmWindowCount" :key="`btn-${n}`" v-slot="{ isSelected, toggle }" :value="n">
                    <v-btn :color="isSelected ? 'yellow' : 'deep_green'" icon="mdi-circle-small"
                        @click="toggle"></v-btn>
                </v-item>
            </v-item-group>
        </v-card-actions>
        <!-- 전체보기 버튼 -->
        <v-col cols="12" class="text-center" style="margin-top: -20px;">
            <v-btn color="#FFFFFF" @click="this.$router.push('/farm')" style="border-radius: 50px;">
                🌾 농장 둘러보기
            </v-btn>
        </v-col>
    </v-container>
    <!-- 인기 농장 끝 -->



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
                판매자 회원은 다른 농장을<br>즐겨찾기할 수 없습니다. 😢
            </v-card-text>
            <v-row>
                <v-btn @click="this.sellerModal = false" class="submit-btn"
                    style="background-color: #e0e0e0;">close</v-btn>
            </v-row>

        </v-card>
    </v-dialog>

</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            images: [],
            items: [],
            packageWindowCount: 0,
            farmWindowCount: 0,
            onboarding: 1,
            scrollPosition: 0,
            farmList: [],
            farmOnboarding: 1,
            likes: [], // 0: 안눌려있는 상태, 1: 눌려있는 상태, 2: 눌리고 있는 상태(애니메이션처리)
            likeCount: []
        }
    },
    methods: {
        paginatedPackages(page) {
            // 페이지에 따라 프로젝트를 반환하도록 수정
            const packagesPerPage = 4;
            const start = (page - 1) * packagesPerPage;
            const end = start + packagesPerPage;
            return this.items.slice(start, end);
        },
        paginatedFarm(page) {
            // 페이지에 따라 프로젝트를 반환하도록 수정
            const farmsPerPage = 4;
            const start = (page - 1) * farmsPerPage;
            const end = start + farmsPerPage;
            return this.farmList.slice(start, end);
        },
        saveScrollPosition() {
            this.scrollPosition = window.scrollY;  // 현재 스크롤 위치 저장
        },
        restoreScrollPosition() {
            window.scrollTo(0, this.scrollPosition);  // 저장된 스크롤 위치로 이동
        },
        clickLike(idx, farmId) {
            try {

                if (this.likes[Number(idx)] != 0 && this.likes[Number(idx)] != 1) {
                    return;
                }
                axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/favorites/farm/${farmId}`);

                let ret;

                if (this.likes[Number(idx)] == 0) {
                    this.likes[Number(idx)] = 2;
                    this.likeCount[Number(idx)] += 1;
                    ret = 1;
                } else if (this.likes[Number(idx)] == 1) {
                    this.likes[Number(idx)] = 3;
                    this.likeCount[Number(idx)] -= 1;
                    ret = 0
                } else {
                    return;
                }

                setTimeout(() => {
                    this.likes[Number(idx)] = ret;  // 1초 후에 liked 상태 정적인 상태로 변경
                }, 1000);  // 1초 동안 하트 표시

            } catch (e) {
                console.log(e);

            }
        }
    },
    async created() {
        // 테스트용 임시 데이터
        this.images = [
            { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/mainpage/0dac11a7-7643-4fd0-a591-e6fb84ed7796inong1", "alt": "배너사진1", "link": "/event1" },
            { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/mainpage/7b389588-8eda-4eee-9502-703efca9d648inong2", "alt": "배너사진2", "link": "/event2" },
            // { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/_+(3).jpeg", "alt": "배너사진3", "link": "/event2" },
            // { "src:": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/desktop+wallpaper.jpeg", "alt": "배너사진4", "link": "/event2" },
            // { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/desktop+wallpaper.jpeg", "alt": "배너사진5", "link": "/event2" }
        ];

        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/top10`);
        this.items = response.data;
        this.packageWindowCount = parseInt(this.items.length / 4) + 1;

        const params = {
            "page": 0,
            "size": 10,
            "sort": "favoriteCount,desc"
        }

        try {
            const response2 = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth`, { params });
            this.farmList = response2.data.content;
            this.farmWindowCount = parseInt((this.farmList.length / 4)) + 1;

            this.likes = new Array(this.farmList.length);
            this.likeCount = new Array(this.farmList.length);
            for (let i = 0; i < this.farmList.length; ++i) {
                if (this.farmList[i].isLiked === true) {
                    this.likes[i] = 1;
                } else {
                    this.likes[i] = 0;
                }
                this.likeCount[i] = Number(this.farmList[i].favoriteCount);
            }

        } catch (e) {
            console.log(e);
        }


    },
    computed: {
        chunkedItems() {
            // 한 번에 4개씩 아이템을 나누어서 배열을 생성
            const chunkSize = 4;
            const result = [];
            for (let i = 0; i < this.items.length; i += chunkSize) {
                result.push(this.items.slice(i, i + chunkSize));
            }
            return result;
        }
    },
}
</script>
<style scoped>
.v-carousel-item {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    /* 넘치는 부분 감추기 */
    background-color: #f5f5f5;
}

.banner-img {
    object-fit: cover;
    width: 100%;
    /* 부모의 너비에 맞추기 */
    height: 100%;
    /* 부모의 높이에 맞추기 */
}

.text-center {
    text-align: center;
}

.package-img {
    width: 190px;
    height: 190px;
    border-radius: 10px;
    transition: transform 0.3s ease;
    /* 이미지 확대 시 부드러운 트랜지션 */
}

.package-img:hover {
    transform: scale(1.05);
    /* 이미지 확대 */
    transition: transform 0.3s ease;
    /* 이미지 확대 시 부드러운 트랜지션 */
    cursor: pointer;
}

.package-img-box {
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    /* 영역을 넘어가는 부분을 잘라냄 */
    transition: all 0.3s ease;
    /* 부드러운 트랜지션 효과 */
}

.farm-img {
    width: 190px;
    height: 190px;
    border-radius: 10px;
    transition: transform 0.3s ease;
    /* 이미지 확대 시 부드러운 트랜지션 */
}

.farm-container {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px #D5D5D5 solid;
}

.slider-wrapper {
    width: 100%;
    overflow: hidden;
    position: relative;
}

.slider {
    display: flex;
    width: max-content;
    transition: transform 0.1s linear;
}

.card {
    flex-shrink: 0;
    width: 300px;
    margin: 0 10px;
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

.like-chip {
    border-radius: 4px;
}

.like-chip:hover {
    background-color: #FFE2A6;
    transition: 0.5s ease;
}

.selected-like-chip {
    background-color: #FFE2A6;
}

.heart-emoji {
    position: absolute;
    transform: translateX(-50%);
    /* 중앙 정렬을 위한 트랜스폼 */
    font-size: 24px;
    opacity: 0;
    /* 애니메이션 전에는 보이지 않도록 설정 */
    animation: popUp 1s ease-in-out forwards;
    /* 애니메이션 정의 */
    margin-left: 35px;
}

.card-outer {
    border: 1px #D4D4D4 solid;
    border-radius: 10px;
    padding: 5px;
    margin-bottom: 20px;
    transition: 0.5s ease;
}

.card-outer:hover {
    box-shadow: 10px 10px #5D5D5D, 0 25px 40px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    transition: 0.7s ease;
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