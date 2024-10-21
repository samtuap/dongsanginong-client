<template>
  <FarmMenuComponent :currentMenu="3" />
    <br><br>
    <div class="review-container">
      <h4 class="review-header" style="margin-left: 30px;">전체 리뷰({{ reviews.length }})</h4>
  
      <!-- 리뷰 목록 -->
      <v-row v-if="paginatedReviews.length > 0" class="review-row" justify="center">
        <v-col
          v-for="(review, index) in paginatedReviews"
          :key="index"
          cols="12"
          md="8"
          class="review-item"
        >
          <!-- 리뷰 카드 클릭 시 디테일 페이지로 이동 -->
          <v-card class="review-card" @click="goToReviewDetail(review.id)">
            <div class="card-header">
              <div class="rating">
                <!-- 별점 표시 -->
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
  
            <!-- 상품 이름 표시 (회색) -->
            <div class="package-name" v-if="review.memberId == this.memberId">
              상품명: {{ review.packageName }}&nbsp;&nbsp;
              <span lclass="my-review" style="background-color: #eee; padding: 3px 5px; border-radius: 10px; font-size: 13px;
            margin-bottom: 5px; color: blue;">내 리뷰</span>
            </div>
            <div class="package-name" v-else>
              상품명: {{ review.packageName }}
            </div>
            <br>
            <div class="review-title">
              <strong>{{ review.title }}</strong>
            </div>
  
            <div class="review-images" v-if="review.imageUrls && review.imageUrls.length">
              <img
                v-for="(imageUrl, i) in review.imageUrls"
                :key="i"
                :src="imageUrl"
                class="review-image"
                alt="리뷰 이미지"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 페이지네이션 -->
      <v-row class="align-center">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @input="paginateReviews"
        class="pagination"
      ></v-pagination>
    </v-row>
    </div>
</template>

<script>
  import FarmMenuComponent from '@/components/menubar/FarmMenuComponent.vue';
  export default {
    components: {
        FarmMenuComponent
    },
    data() {
      return {
        reviews: [],
        currentPage: 1,
        reviewsPerPage: 5,
        paginatedReviews: [],
        memberId: localStorage.getItem('memberId'),
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.reviews.length / this.reviewsPerPage);
      },
    },
    mounted() {
      this.fetchReviews();
    },
    watch: {
      currentPage() {
        this.paginateReviews();
      }
    },
    methods: {
      async fetchReviews() {
        const farmId = this.$route.params.farmId;
        try {
          const response = await fetch(
            `${process.env.VUE_APP_API_BASE_URL}/product-service/reviews/no-auth/farm/${farmId}/list`
          );
          if (response.ok) {
            this.reviews = await response.json();
            this.reviews.sort((a, b) => b.id - a.id);
            this.paginateReviews(); // 첫 번째 페이지를 설정
          } else {
            console.error("리뷰 목록을 불러오는 중 오류 발생:", response.status);
          }
        } catch (error) {
          console.error("리뷰 목록을 불러오는 중 오류 발생:", error);
        }
      },
      paginateReviews() {
        const start = (this.currentPage - 1) * this.reviewsPerPage;
        const end = start + this.reviewsPerPage;
        this.paginatedReviews = this.reviews.slice(start, end);
      },
      formatDate(date) {
        if (!date) return '';
        return date.split('T')[0]; // 날짜를 'YYYY-MM-DD' 형식으로 잘라서 반환
      },
      // 리뷰 디테일 페이지로 이동하는 함수
      goToReviewDetail(reviewId) {
        this.$router.push({ name: 'ReviewDetail', params: { reviewId } });
      },
    },
  };
</script>

<style scoped>
.review-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -20px;
}

.review-header {
  text-align: left;
  width: 100%;
  max-width: 950px;
  margin-bottom: 30px;
  padding-left: 0; /* 왼쪽 여백을 없앰 */
}

.review-row {
  justify-content: center; 
  width: 100%;
}

.review-card {
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  margin-bottom: 20px;
  width: 93%;
  /* max-width: 800px; */
  cursor: pointer;
  margin-left: 4%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.rating {
  display: flex;
  align-items: center;
}

.star-icon {
  color: #FFCC80;
  font-size: 30px;
  padding: 0 5px;
  border-radius: 50%;
}

.review-date {
  font-size: 15px;
  padding: 10px;
  color: #888;
}

.review-title {
  margin: 10px 0;
  font-size: 16px;
}

/* 상품 이름을 회색으로 표시 */
.package-name {
  font-size: 15px;
  color: #888;
}

.review-images {
  display: flex;
  gap: 10px;
}

.review-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
}

.pagination {
  margin-top: 10px;
}
</style>
