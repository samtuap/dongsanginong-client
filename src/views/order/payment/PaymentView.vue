<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="pa-4">
            <!-- Order Product Information -->
            <h3>주문 상품 정보</h3>
            <v-row>
              <v-col cols="4">
                <v-img
                  src="https://via.placeholder.com/150"
                  alt="product"
                ></v-img>
              </v-col>
              <v-col cols="8">
                <p>[정기구독] 김인기 농부의 무농약 유럽 채소 13종</p>
                <p>11,000원</p>
                <p>배송비 무료</p>
              </v-col>
            </v-row>
  
            <!-- Subscription Settings -->
            <h3>구독주기 설정</h3>
            <v-btn-toggle v-model="subscriptionFrequency">
              <v-btn value="1주">1주</v-btn>
              <v-btn value="2주">2주</v-btn>
              <v-btn value="1개월">1개월</v-btn>
            </v-btn-toggle>
  
            <v-alert type="info" class="mt-4">
              * 결제 후 마이페이지 > 정기구독 관리에서 구독주기 변경이 가능합니다.
            </v-alert>
          </v-card>
        </v-col>
  
        <!-- Order Summary and Payment Methods -->
        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <!-- Order Summary -->
            <h3>주문 요약</h3>
            <p>상품가격: 11,000원</p>
            <p>배송비: 무료</p>
            <h3>총 주문금액: 11,000원</h3>
            <p>110 포인트 적립 예정</p>
  
            <!-- Payment Method -->
            <h3>결제수단</h3>
            <v-btn color="primary" class="mt-2">결제수단 등록하기</v-btn>
  
            <v-checkbox
              label="전체 동의"
              v-model="termsAccepted"
              class="mt-4"
            ></v-checkbox>
            <v-checkbox
              label="구매조건 확인 및 결제진행에 동의"
              v-model="termsAccepted"
            ></v-checkbox>
            <v-checkbox
              label="전자금융거래 이용약관 동의"
              v-model="termsAccepted"
            ></v-checkbox>
          </v-card>
        </v-col>
  
        <!-- Coupon and Address -->
        <v-col cols="12" md="8">
          <v-card class="pa-4 mt-4">
            <!-- Coupon / Points -->
            <h3>쿠폰/포인트</h3>
            <v-text-field label="쿠폰번호" v-model="couponNumber"></v-text-field>
            <v-btn color="secondary" class="mt-2">코드 확인</v-btn>
            <v-text-field label="포인트" v-model="pointsUsed"></v-text-field>
          </v-card>
        </v-col>
  
        <!-- Payment Button -->
        <v-col cols="12" class="text-right">
          <v-btn color="primary" class="mt-4">결제하기</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        subscriptionFrequency: '1주',
        termsAccepted: false,
        couponNumber: '',
        pointsUsed: '',
      }
    },
    async created() {
        const packageId = this.$route.params.packageId;
        axios.get(`${process.env.VUE_APP_API_BASE_URL}/package/${packageId}`);
    }
  }
  </script>
  
  <style scoped>
  h3 {
    font-weight: bold;
    margin-bottom: 16px;
  }
  </style>
  