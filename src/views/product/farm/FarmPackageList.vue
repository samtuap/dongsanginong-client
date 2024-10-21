<template>
    <FarmMenuComponent :currentMenu="1"/>
    <br>
    <v-container style="max-width: 1200px;"> 
      <!-- 에러 메시지 출력 -->
      <v-row v-if="errorMessage">
        <v-col>
          <v-alert type="error">
            {{ errorMessage }}
          </v-alert>
        </v-col>
      </v-row>
  
      <!-- 패키지 리스트 슬라이드 -->
      <v-row v-else justify="center" style="gap: 5px;"> <!-- 중앙 정렬을 위한 justify-center -->
        <v-col
          v-for="(packageProduct, index) in paginatedPackageList"
          :key="index"
          cols="12"
          sm="6"
          md="3"
          class="d-flex justify-center"
          style="margin:9px; padding: 0px;"
        >
          <v-card elevation="0" class="v-card" style="width: 400px; height: 400px; padding: 0px;" @click="goToPackageDetail(packageProduct.packageId)">
            <v-img
              :src="packageProduct.imageUrl"
              alt="Package Image"
              height="300px"
              width="300px"
              cover
            ></v-img>
            <v-card-text style="padding-left: 0px;">
                <span style="font-size:medium; font-weight: 400;" v-if="packageProduct.packageName.length > 10"> {{
                    packageProduct.packageName.substring(0, 10)
                }}... </span>
                <span style="font-size:medium; font-weight: 400;" v-else> {{ packageProduct.packageName }}</span>
                <br />
                <span style="color:darkgreen; font-size:medium;"> {{
                    formatPrice(packageProduct.price) }} </span>
                <br />
                <span style="color:#999; font-size: small;"> 1회 제공 금액 {{
                    formatPrice(getPerCyclePrice(packageProduct.price, packageProduct.deliveryCycle)) }} </span>
                <br />
                <span style="color:#999; font-size: small;">
                    🧾 누적 주문 {{ packageProduct.orderCount }}
                </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 슬라이드 컨트롤 버튼 -->
      <v-row justify="center" class="mt-4">
        <v-btn icon="mdi-chevron-left" variant="plain" @click="prevPage" :disabled="currentPage === 1"></v-btn>
        <v-btn icon="mdi-chevron-right" variant="plain" @click="nextPage" :disabled="currentPage === totalPages"></v-btn>
      </v-row> <br><br><br><br>
    </v-container>
  </template>
  
  
  
<script>
import axios from 'axios';
import FarmMenuComponent from '@/components/menubar/FarmMenuComponent.vue';

export default {
  components: {
    FarmMenuComponent
  },
  data() {
    return {
      packageProductList: [], // 전체 상품 리스트
      currentPage: 1, // 현재 페이지
      itemsPerPage: 3, // 한 페이지당 보여줄 아이템 수
      farmId: null,
      errorMessage: null
    };
  },
  computed: {
    totalPages() {
      // 총 페이지 수 계산
      return Math.ceil(this.packageProductList.length / this.itemsPerPage);
    },
    paginatedPackageList() {
      // 현재 페이지에 해당하는 상품 리스트만 반환
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.packageProductList.slice(start, end);
    }
  },
  async created() {
    this.farmId = this.$route.params.farmId;

    try { 
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/for-sale/${this.farmId}`);
      this.packageProductList = response.data;
    } catch (e) {
      this.errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.';
      console.error(e);
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // 패키지 디테일 페이지로 이동하는 메서드
    goToPackageDetail(packageId) {
      this.$router.push({ name: 'FarmPackageDetail', params: { packageId } });
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
  }
};

</script>

<style scoped>
.package-name {
    font-size: 15px;
    font-weight: bold;
    margin-top: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.package-price {
    font-size: 13px;
    color: #8e8e8e;
}
</style>
