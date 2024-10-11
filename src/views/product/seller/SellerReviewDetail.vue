<template>
  <SellerSidebar />
  <v-container>
    <v-card class="review-card elevation-0" outlined>
      <!-- 별점과 업데이트 날짜를 표시하는 섹션 -->
      <v-row class="review-header">
        <v-col cols="12" class="review-info">
          <div class="header-content">
            <!-- 별점 표시 -->
            <div class="rating">
              <span v-for="star in 5" :key="star">
                <v-icon v-if="star <= review.rating" class="star-icon">mdi-star</v-icon>
                <v-icon v-else class="star-icon">mdi-star-outline</v-icon>
              </span>
            </div>
            <!-- 업데이트 날짜 표시 -->
            <div class="review-date">
              {{ formatDate(review.updateAt) }}
            </div>
          </div>

          <v-row>
            <!-- 리뷰 제목 -->
            <div class="review-title">
              <strong>제목 : {{ review.title }}</strong>
            </div>
            <!-- 삭제 버튼 추가 -->
            <div class="action-buttons">
              <v-btn class="delete-btn" @click="openDeleteConfirmation">삭제</v-btn>
            </div>
          </v-row>
        </v-col>
      </v-row>
      <br>
      <!-- 리뷰 내용과 이미지가 표시되는 섹션 -->
      <v-row class="review-content" style="margin-top: -30px;">
        <v-col cols="12">
          <!-- 리뷰 내용 -->
          <p class="review-text">{{ review.contents }}</p>
          
          <!-- 리뷰 이미지들 -->
          <div class="review-images" v-if="review.imageUrls && review.imageUrls.length">
            <div class="image-slider-container">
              <!-- 이미지가 3장 이상일 때 페이지네이션 버튼 표시 -->
              <button v-if="review.imageUrls.length > imagesPerPage" @click="scrollLeft" class="scroll-button left-button">‹</button>
              <div ref="imageSlider" class="image-slider">
                <img
                  v-for="(imageUrl, i) in visibleImages"
                  :key="i"
                  :src="imageUrl"
                  class="review-image"
                  alt="리뷰 이미지"
                />
              </div>
              <button v-if="review.imageUrls.length > imagesPerPage" @click="scrollRight" class="scroll-button right-button">›</button>
            </div>
          </div>
        </v-col>
      </v-row>
      <br>
      <!-- 삭제 확인 모달 -->
      <v-dialog v-model="deleteModal" max-width="300">
        <v-card class="modal">
          <v-card-text class="modal-title">정말 삭제하시겠습니까?</v-card-text>
          <v-card-actions class="modal-actions">
            <v-btn @click="confirmDelete" class="delete-confirm-btn">삭제</v-btn>
            <v-btn @click="closeDeleteModal" class="cancel-btn">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 삭제 완료 모달 -->
      <v-dialog v-model="alertModal" max-width="260px">
        <v-card class="modal" style="padding: 10px; padding-right: 20px; text-align: center;">
          <v-card-text>리뷰가 삭제되었습니다.</v-card-text>
          <v-btn @click="closeAlertModal" class="submit-btn">close</v-btn>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import SellerSidebar from '@/components/sidebar/SellerSidebar.vue';
export default {
  components: {
    SellerSidebar,
  },
  data() {
    return {
      review: {},
      currentImageIndex: 0,
      imagesPerPage: 3,
      deleteModal: false,
      alertModal: false,
    };
  },
  computed: {
    visibleImages() {
      return this.review.imageUrls.slice(
        this.currentImageIndex,
        this.currentImageIndex + this.imagesPerPage
      );
    },
  },
  mounted() {
    this.fetchReviewDetail();
  },
  methods: {
    async fetchReviewDetail() {
      const reviewId = this.$route.params.reviewId;
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/product-service/reviews/no-auth/detail/${reviewId}`
        );
        if (response.ok) {
          this.review = await response.json();
        } else {
          console.error("리뷰 디테일을 불러오는 중 오류 발생:", response.status);
        }
      } catch (error) {
        console.error("리뷰 디테일을 불러오는 중 오류 발생:", error);
      }
    },
    formatDate(date) {
      if (!date) return '';
      return date.split('T')[0]; // 날짜를 'YYYY-MM-DD' 형식으로 반환
    },
    scrollLeft() {
      this.currentImageIndex = Math.max(this.currentImageIndex - this.imagesPerPage, 0);
    },
    scrollRight() {
      const maxIndex = this.review.imageUrls.length - this.imagesPerPage;
      this.currentImageIndex = Math.min(this.currentImageIndex + this.imagesPerPage, maxIndex);
    },
    openDeleteConfirmation() {
      this.deleteModal = true;
    },
    closeDeleteModal() {
      this.deleteModal = false;
    },
    closeAlertModal() {
      this.alertModal = false;
      this.$router.go(-1); // 이전 페이지로 이동
    },
    async confirmDelete() {
      const sellerId = localStorage.getItem('sellerId');
      const accessToken = localStorage.getItem('accessToken');
      try {
        await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/product-service/reviews/seller/${this.review.id}/delete`, 
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,  // accessToken 추가
              sellerId: sellerId,  // sellerId를 헤더에 추가
            },
          }
        );
        this.alertModal = true;  // 리뷰 삭제 완료 모달 표시
      } catch (error) {
        console.error('리뷰 삭제 실패:', error);
        alert('리뷰 삭제 중 오류가 발생했습니다.');
      }
      this.closeDeleteModal(); // 삭제 확인 모달 닫기
    },
  },
};
</script>

<style scoped>
/* 리뷰 카드 디자인 */
.review-card {
  margin-top: 40px;
  margin-left: 70px;
  width: 800px;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  padding: 20px 30px;
}

/* 전체적으로 정렬을 깔끔하게 정리 */
.review-detail-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.review-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  display: flex;
  align-items: center;
}

.star-icon {
  color: #FFCC80;
  font-size: 30px;
  padding: 0 5px;
}

.review-date {
  font-size: 14px;
  color: #888;
  margin-left: auto;
  margin-right: -10px;
}

.review-title {
  margin-top: 23px;
  font-size: 17px;
  font-weight: bold;
  margin-left: 15px;
}

.review-text {
  font-size: 16px;
  line-height: 1.5;
  margin-top: 20px;
}

.image-slider-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  margin-top: 20px;
}

.image-slider {
  display: flex;
  gap: 10px;
  overflow: hidden;
}

.review-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.scroll-button {
  color: black;
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 1;
  font-size: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-button {
  margin-right: 10px; 
}

.right-button {
  margin-left: 10px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  margin-top: 10px;
}

.delete-btn {
  margin-top: 10px;
  background-color: #BCC07B;
  color: black;
  border-radius: 30px;
  padding: 10px;
  font-size: 14px;
}

/* 모달 스타일 */
.modal {
  background-color: rgb(255, 255, 255);
  border: none;
  box-shadow: none;
  border-radius: 10px;
  padding: 10px;
}

.modal-title {
  text-align: center;
  font-size: 16px;
}

.modal-actions {
  justify-content: space-between;
  margin-top: 10px;
}

.delete-confirm-btn {
  background-color: #BCC07B;
  color: black;
  border-radius: 50px;
  padding: 10px;
}
.cancel-btn {
  background-color: #e0e0e0;
  color: black;
  border-radius: 50px;
  padding: 10px;
}
.submit-btn {
  background-color: #BCC07B;
  color: black;
  border-radius: 50px;
  padding: 10px;
}
</style>
