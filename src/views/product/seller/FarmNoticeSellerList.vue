<template>
    <SellerSidebar />
    <v-container fluid>
        <h3 style="padding: 10px; padding-left: 70px;">커뮤니티 관리</h3><br><br>
        <v-row class="align-center" style="padding-left: 70px; margin-top: -45px;">
            <v-col cols="12" sm="8" md="6" lg="12">
                <FarmNoticeCreate />
                <v-card v-for="notice in noticeList" :key="notice.id" class="notice-class elevation-0" outlined>
                    <v-card-title style="font-size: 17px;">{{ notice.title }}</v-card-title>
                    <v-card-text>
                        {{ notice.content }}
                    </v-card-text>

                    <v-carousel v-if="notice.noticeImages && notice.noticeImages.length > 0" hide-delimiters
                        height="300" class="mt-3">
                        <v-carousel-item v-for="image in notice.noticeImages" :key="image.id">
                            <v-img v-bind:src="image" alt="Notice image" height="300"></v-img>
                        </v-carousel-item>
                    </v-carousel>

                    <br>
                    <v-row>
                        <!-- 댓글 수와 아이콘 -->
                        <v-btn @click="goToDetail(notice.id)" color="white" style="box-shadow: none; border: none; margin-bottom: 10px; font-size: 12px;">
                            <img src="/comment.png" width=25 alt="Logo" /> 
                            {{ notice.commentCnt }}
                        </v-btn>

                        <!-- 자세히 보기 버튼 -->
                        <v-btn @click="goToDetail(notice.id)" class="btn-no-background">자세히 보기</v-btn>
                    </v-row>

                </v-card>
                <!-- 페이징 처리 -->
                <v-row class="align-center" style="padding-left: 350px; margin-top: 20px;">
                    <v-pagination v-model="currentPage" :length="pageCount"></v-pagination>
                  </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import SellerSidebar from '@/components/sidebar/SellerSidebar.vue';
import FarmNoticeCreate from '../farmNotice/FarmNoticeCreate.vue';
export default {
    components: {
        SellerSidebar,
        FarmNoticeCreate
    },
    data() {
        return {
            noticeList: [],
            currentPage: 1, // 페이지 1번부터 시작 
            pageSize: 5, // 한 페이지에 5개씩 출력 
            totalItems: 0,
        }
    },
    computed: {
        pageCount() {
            return Math.ceil(this.totalItems / this.pageSize);
        }
    },
    watch: {
        currentPage(newPage) {
            this.farmNoticeList(newPage);
        }
    },
    created() {
        this.farmNoticeList(this.currentPage);
    },
    methods: {
        async farmNoticeList(page) {
            try {
                const farmId = localStorage.getItem('farmId');
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth/${farmId}/notice/list`, {
                    params: {
                        page: page - 1,
                        size: this.pageSize
                    }
                });
                this.noticeList = response.data.content;
                this.totalItems = response.data.totalElements;
                console.log(response.data);
            } catch (e) {
                console.log(e);
            }
        },
        goToDetail(noticeId) {
            const farmId = this.$route.params.farmId;
            this.$router.push({
                name: 'FarmNoticeSellerDetail',
                params: { farmId: farmId, notice_id: noticeId }
            });
        }
    }
};
</script>

<style scoped>
.notice-class {
    margin-top: 20px;
    width: 800px;
    border: 1px solid #d4d4d4;
    border-radius: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 30px;
    padding-left: 30px;
}

.btn-no-background {
    box-shadow: none !important;
    border: none !important;
    color: #808080;
    position: absolute;
    bottom: 10px;
    right: 30px;
}
</style>
