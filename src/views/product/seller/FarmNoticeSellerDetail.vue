<template>
    <SellerSidebar />
    <v-container>
        <v-row justify="left" style="padding-left: 70px;">
            <v-col cols="12" sm="8" md="6" lg="8">

                <!-- 수정 및 삭제 버튼을 수평으로 배치 -->
                <v-row justify="end" class="mt-3">
                    <v-btn @click="openEditDialog" class="edit-btn">수정</v-btn>
                    <v-btn @click="deleteNotice" class="delete-btn">삭제</v-btn>
                </v-row>
                
                <!-- 수정 모달 컴포넌트 추가 -->
                <farm-notice-update :notice-id="noticeId" ref="editModal" @notice-updated="farmNoticeDetail" />

                <v-card class="notice-class elevation-0" outlined>
                    <v-card-title style="font-size: 16px;"> {{ title }} </v-card-title>

                    <v-card-text>{{ content }}</v-card-text>

                    <v-carousel v-if="images && images.length > 0" hide-delimiters height="300" class="mt-3">
                        <v-carousel-item v-for="image in images" :key="image.id">
                            <v-img :src="image" alt="Notice image" height="300"></v-img>
                        </v-carousel-item>
                    </v-carousel>
                </v-card>

                <!-- 댓글 조회 -->
                <div style="margin-left: 7%; padding: 0; justify-content: center; width: 100%;">
                    <br>
                    <h3 class="comment-title">댓글 {{ commentCnt }}개</h3>
                    <br>
                    <v-card v-for="comment in commentList" :key="comment.id" class="comment-class elevation-0" outlined>
                        <v-row>
                            <v-card-text>@{{ comment.name }}&nbsp;&nbsp;
                                <span style="font-size: 12px; color: grey;">({{ comment.formattedDate }})</span></v-card-text>
                        </v-row>
                        <v-card-text class="centered-comment">&nbsp;{{ comment.contents }}</v-card-text>
                        <hr class="hr-style">
                    </v-card>

                    <!-- 페이징 처리 -->
                    <v-pagination v-model="currentPage" :length="pageCount"></v-pagination>
                </div>

                <!-- 삭제 완료 모달 -->
                <v-dialog v-model="alertModal" max-width="260px">
                    <v-card class="modal" style="padding: 15px; padding-right: 20px; text-align: center;">
                        <v-card-text>완료되었습니다.</v-card-text>
                        <v-btn @click="closeModal" class="submit-btn" style="margin-top: -2px;">닫기</v-btn>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import SellerSidebar from '@/components/sidebar/SellerSidebar.vue';
import FarmNoticeUpdate from '@/views/product/farmNotice/FarmNoticeUpdate.vue'; // 공지사항 수정 모달 import
import axios from 'axios';

export default {
    components: {
        SellerSidebar,
        FarmNoticeUpdate,
    },
    data() {
        return {
            title: "",
            content: "",
            images: [],
            noticeId: null,
            alertModal: false, // 모달 상태 관리 변수

            commentCnt: 0,
            commentList: [],

            currentPage: 1,
            pageSize: 15,
            totalItems: 0,
        };
    },
    computed: {
        pageCount() {
            return Math.ceil(this.totalItems / this.pageSize);
        }
    },
    watch: {
        currentPage(newPage) {
            this.farmNoticeDetail(newPage);
        }
    },
    created() {
        this.farmNoticeDetail(this.currentPage);
    },
    methods: {
        async farmNoticeDetail(page) {
            try {
                const farm_id = this.$route.params.farmId;
                const notice_id = this.$route.params.notice_id;
                this.noticeId = notice_id;

                // 공지사항 및 댓글 조회
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth/${farm_id}/notice/${notice_id}`);
                this.title = response.data.title;
                this.content = response.data.content;
                this.commentCnt = response.data.commentCnt;
                this.images = response.data.noticeImages;

                const response2 = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth/${farm_id}/notice/${notice_id}/comment`, {
                    params: {
                        page: page - 1,
                        size: this.pageSize
                    }
                });
                this.commentList = response2.data.content.map(comment => {
                    const [date, time] = comment.createdAt.split('T');
                    return {
                        ...comment,
                        formattedDate: `${date} ${time.split('.')[0]}`
                    };
                });
                this.totalItems = response2.data.totalElements;

            } catch (e) {
                console.log(e);
            }
        },
        openEditDialog() {
            this.$refs.editModal.openEditDialog();
        },
        async deleteNotice() {
            try {
                const notice_id = this.noticeId;
                const sellerId = localStorage.getItem('sellerId');
                await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/notice/${notice_id}/delete`, {
                    headers: { sellerId: sellerId }
                });
                this.alertModal = true;
            } catch (e) {
                console.error(e);
            }
        },
        closeModal() {
            this.alertModal = false;
            this.$router.go(-1);
        },
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

.edit-btn {
    background-color: #BCC07B;
    color: black;
    border-radius: 30px;
    padding: 7px 20px;
    font-size: 14px;
    line-height: 1.5;
    box-shadow: none;
    margin-right: 10px;
}
.delete-btn{
    margin-right: -80px ;
    background-color: #e0e0e0;
    color: black;
    border-radius: 30px;
    padding: 7px 20px;
    line-height: 1.5;
    box-shadow: none;
    font-size: 14px;
}
.hr-style {
  border: none;
  border-top: 0.9px solid lightgray;
  margin-top: 5px;
  margin-bottom: 10px;
}

.modal-btn {
    border: none;
    box-shadow: none;
}

.modal {
    background-color: rgb(255, 255, 255);
    border: none;
    box-shadow: none;
    border-radius: 10px;
}

.submit-btn {
    margin-left: 10px;
    margin-top: 8px;
    background-color: #BCC07B;
    color: black;
    border-radius: 50px;
}

.comment-title, .centered-comment {     
  padding-left: 0%;    
  text-align: left; 
}
</style>
