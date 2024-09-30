<template>
    <v-container>
      <v-form>
        <div class="form-group">
          <label for="couponName">쿠폰 이름</label>
          <input
            type="text"
            id="couponName"
            v-model="coupon.couponName"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="discountPercentage">할인율</label>
          <div class="discount-input">
            <input
              type="number"
              id="discountPercentage"
              v-model="coupon.discountPercentage"
              required
            />
            <span class="percent-sign">%</span>
          </div>
        </div>
  
        <div class="form-group">
          <label for="expiration">쿠폰 소멸 일자</label>
          <input
            type="datetime-local"
            id="expiration"
            v-model="coupon.expiration"
            required
          />
        </div>
  
        <!-- 쿠폰 생성 버튼 -->
        <v-btn @click="createCoupon">등록</v-btn>
      </v-form>
  
      <!-- 결과 모달 -->
      <v-dialog v-model="resultDialog">
        <v-card>
          <v-card-title>{{ message }}</v-card-title>
          <v-card-actions>
            <v-btn @click="resultDialog = false">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        // 쿠폰 정보를 담는 객체
        coupon: {
          couponName: '',
          discountPercentage: 0,
          expiration: '', // 유효기간 (datetime-local에서 입력받음)
          farmId: null
        },
        resultDialog: false, // 결과 모달 상태
        message: '' // 결과 메시지
      };
    },
    methods: {
      async createCoupon() {
        // 서버에 전송할 데이터 준비
        const requestData = {
          couponName: this.coupon.couponName,
          discountPercentage: this.coupon.discountPercentage,
          expiration: this.coupon.expiration, // ISO 형식으로 자동 변환됨
          farmId: this.coupon.farmId
        };
  
        // 로컬 스토리지에서 토큰과 sellerId 가져오기
        const token = localStorage.getItem('Bearer Token');
        const sellerId = localStorage.getItem('sellerId');
  
        try {
          // 쿠폰 생성 요청
          const response = await axios.post('http://localhost:8080/order-service/coupons/create', requestData, {
            headers: {
              Authorization: `Bearer ${token}`,
              sellerId: sellerId
            }
          });
          console.log('Coupon created:', response.data);
          this.message = '쿠폰이 성공적으로 생성되었습니다.'; // 성공 메시지 설정
        } catch (error) {
          // 에러 발생 시 처리
          console.error('Error creating coupon:', error.response ? error.response.data : error.message);
          this.message = '쿠폰 생성에 실패했습니다.'; // 실패 메시지 설정
        } finally {
          this.resultDialog = true; // 결과 모달 열기
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* 추가 스타일을 여기에 작성할 수 있습니다. */
  .form-group {
    margin-bottom: 10px; /* 아래쪽 여백을 줄여 간격을 반으로 감소 */
    display: flex; /* 수평으로 정렬하기 위해 flex 사용 */
    align-items: center; /* 세로 정렬 */
  }
  
  /* 라벨과 입력 필드 사이의 간격 설정 */
  .form-group label {
    margin-right: 10px; /* 라벨과 입력 필드 사이의 간격 */
  }
  
  /* 입력 필드에 테두리 스타일 추가 및 너비 조정 */
  .form-group input {
    border: 1px solid #ccc; /* 테두리 색상 및 두께 설정 */
    border-radius: 4px; /* 테두리 모서리 둥글게 설정 */
    padding: 8px; /* 입력 필드 안쪽 여백 추가 */
    box-sizing: border-box; /* 패딩과 테두리를 포함한 전체 너비 계산 */
  }
  
  /* 쿠폰 이름 및 소멸 일자 입력 필드 너비 20%로 설정 */
  #couponName,
  #expiration {
    width: 20%;
  }
  
  /* 할인율 입력 필드 너비 10%로 설정 */
  .discount-input {
    display: flex; /* 수평으로 정렬 */
    align-items: center; /* 세로 정렬 */
  }
  
  #discountPercentage {
    width: 20%; /* 입력 필드 너비 10% */
  }
  
  /* % 텍스트 스타일 */
  .percent-sign {
    margin-left: 10px; /* 입력 필드와 % 텍스트 간의 간격 */
  }
  
  /* 입력 필드에 포커스 시 테두리 색상 변경 */
  .form-group input:focus {
    border-color: #007bff; /* 포커스 시 테두리 색상 */
    outline: none; /* 기본 포커스 아웃라인 제거 */
  }
  </style>
  