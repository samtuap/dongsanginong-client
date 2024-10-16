<template>
    <v-carousel cycle :show-arrows="false" delimiter-icon="mdi-square" delimiter-color="light_green" height="520"
        interval="5000" hide-delimiter-background> <!--5초마다 슬라이드-->
        <v-carousel-item v-for="(image, index) in images" :key="index" style="overflow: hidden;">
            <img :src="image.src" :alt="image.alt" class="banner-img" />
        </v-carousel-item>
    </v-carousel>


    <!-- 인기 농장 -->
    <br>
    <v-container class="farm-container">
        <!-- 제목 -->
        <v-col cols="12">
            <div class="text-center slide-title" @click="this.$router.push('/farm')">
                🏠 Farm Best 9 🏠
                <v-icon icon="mdi-chevron-right" style="font-size: 46px;"/>
            </div>
            <p class="text-center" style="color: grey; font-size: 16px;">즐겨찾기 수가 많은 농장들입니다.</p>
        </v-col>
        <br>

        <BestFarmSlide />
        
    </v-container>
    <!-- 인기 농장 끝 -->



    <!-- 인기 패키지 -->
    <br>
    <v-container>
        <div style="margin-bottom: 40px; padding-top: 50px; display: flex; justify-content: center; border-top: 1px #D5D5D5 solid;">
            <div>
                <div class="text-center slide-title"
                @click="this.$router.push('/product')"
                >
                    🥦 Best Packages 🥦 
                    <v-icon icon="mdi-chevron-right" style="font-size: 46px;"/>
                </div>
                <p class="text-center" style="color: grey; font-size: 16px;">가장 많이 팔린 패키지를 주문해보세요. :)</p>
            </div>
        </div>
        <BestPackageSlide />

    </v-container>
    <!-- 인기 패키지 끝 -->


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
import BestFarmSlide from '@/components/slide/BestFarmSlide.vue';
import BestPackageSlide from '@/components/slide/BestPackageSlide.vue';
import axios from 'axios';
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default {
    components: {
        BestPackageSlide,
        BestFarmSlide
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    data() {
        return {
            images: [],
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
            // { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/mainpage/0dac11a7-7643-4fd0-a591-e6fb84ed7796inong1", "alt": "배너사진1", "link": "/event1" },
            // { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/mainpage/7b389588-8eda-4eee-9502-703efca9d648inong2", "alt": "배너사진2", "link": "/event2" },
            { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/mainpage/a591fdfe-4151-4b7f-932a-d5afff886ae5banner2", "alt": "배너사진3", "link": "/event2" },
            // { "src:": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/desktop+wallpaper.jpeg", "alt": "배너사진4", "link": "/event2" },
            // { "src": "https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/desktop+wallpaper.jpeg", "alt": "배너사진5", "link": "/event2" }
        ];


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
    margin-top: 10px;
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

.slide-title {
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;

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