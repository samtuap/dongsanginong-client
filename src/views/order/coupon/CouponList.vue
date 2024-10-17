<template>
  <SellerSidebar />
  <v-container fluid>
    <h3 style="padding: 10px; padding-left: 70px;">쿠폰 관리</h3><br><br>

    <v-row class="align-center" style="padding-left: 70px; margin-top: -45px;">
      <v-col>
        <h4>등록된 쿠폰 목록</h4>
      </v-col>
      <v-col class="text-right">
        <v-btn @click="openCouponCreateModal" class="create-btn" style="border-radius: 50px; right: 200px;">
          쿠폰 생성
        </v-btn>
      </v-col>
    </v-row>

    <v-col style="position: relative;"></v-col>
      <v-card class="product-card elevation-0" outlined>
        <v-table class="table-header">
          <thead>
            <tr>
              <th class="table-header">No.</th>
              <th class="table-header">쿠폰명</th>
              <th class="table-header">할인율(%)</th>
              <th class="table-header">유효기간</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(coupon, index) in paginatedCoupons" :key="coupon.id">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ coupon.couponName }}</td>
              <td>{{ coupon.discountPercentage }}%</td>
              <td>{{ formatDateTime(coupon.expiration) }}</td>
            </tr>
          </tbody>
        </v-table>

        <!-- 페이징 처리 -->
        <v-pagination v-model="currentPage" :length="pageCount"></v-pagination>
      </v-card>

      <!-- 쿠폰 생성 모달 -->
      <CouponCreate v-model:dialog="isCouponCreateModalOpen" @new-coupon="getCouponList" />
  </v-container>
</template>

<script>
import axios from 'axios';
import SellerSidebar from '@/components/sidebar/SellerSidebar.vue';
import CouponCreate from '@/views/order/coupon/CouponCreate.vue';

export default {
  components: {
    SellerSidebar,
    CouponCreate,
  },
  data() {
    return {
      couponList: [],
      currentPage: 1,
      itemsPerPage: 10,
      isCouponCreateModalOpen: false,
    };
  },
  computed: {
    paginatedCoupons() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.couponList.slice(start, end);
    },
    pageCount() {
      return Math.ceil(this.couponList.length / this.itemsPerPage);
    }
  },
  mounted() {
    this.getCouponList();
  },
  methods: {
    async getCouponList() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/order-service/coupons/list`);
        this.couponList = response.data.sort((a, b) => b.id - a.id);
      } catch (error) {
        console.error('Error fetching coupon list:', error);
      }
    },
    formatDateTime(dateString) {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleString(undefined, options);
    },
    openCouponCreateModal() {
      this.isCouponCreateModalOpen = true;
    },
  },
};
</script>

<style scoped>
.product-card {
  overflow-x: hidden;
  margin-top: 20px;
  width: 77%; /* 테이블 가로 길이 줄임 */
  margin: 0 auto; /* 중앙에 위치 */
  height: auto;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  padding: 20px;
  margin-right: 17%;
}

.table-header {
  text-align: center !important;
  font-size: 14px;
  background-color: none;
  border-bottom: 1px solid #d4d4d4;
}

.create-btn {
  background-color: #bcc07b;
  color: black;
}

.v-pagination {
  margin-top: 20px;
  justify-content: center;
}

</style>
