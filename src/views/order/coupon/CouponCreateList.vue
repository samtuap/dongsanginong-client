<template>
  <v-container fluid>
    <v-row>
      <!-- 사이드바 자리 -->
      <v-col cols="2">
        <SellerSidebar />
      </v-col>

      <!-- 쿠폰 생성 폼 영역 -->
      <v-col cols="6" class="coupon-form-container">
        <h2 class="form-title">쿠폰 생성</h2> <!-- 텍스트를 폼 위로 이동 -->

        <v-form class="coupon-form">
          <!-- 쿠폰 이름 입력 -->
          <div class="form-group">
            <label for="couponName" class="form-label">쿠폰 이름</label>
            <input
              type="text"
              id="couponName"
              v-model="coupon.couponName"
              class="input-field full-width-input"
              required
            />
          </div>

          <!-- 할인율 입력 -->
          <div class="form-group">
            <label for="discountPercentage" class="form-label">할인율</label>
            <div class="discount-input">
              <input
                type="number"
                id="discountPercentage"
                v-model="coupon.discountPercentage"
                class="input-field short-input"
                required
              />
              <span class="percent-sign">%</span>
            </div>
          </div>

          <!-- 쿠폰 소멸 일자 선택 -->
          <div class="form-group">
            <label for="expiration" class="form-label">쿠폰 소멸 일자</label>
            <div class="expiration-input">
              <input
                type="text"
                id="expiration"
                v-model="formattedExpiration"
                class="input-field full-width-input"
                readonly
              />
              <v-icon class="calendar-icon" @click="datePickerDialog = true">mdi-calendar</v-icon>
            </div>
          </div>

          <!-- 등록 버튼 -->
          <v-btn class="submit-btn" @click="createCoupon">등록</v-btn>
        </v-form>
      </v-col>
    </v-row>

    <!-- 날짜 선택 모달 -->
    <v-dialog v-model="datePickerDialog" max-width="330px">
      <v-card>
        <v-card-title class="headline">날짜 선택</v-card-title>
        <v-date-picker 
          v-model="selectedDate" 
          @update:model-value="openTimePicker"
        />
      </v-card>
    </v-dialog>

    <!-- 시간 선택 모달 -->
    <v-dialog v-model="timePickerDialog" max-width="290px">
      <v-card>
        <v-card-title class="headline">시간 선택</v-card-title>
        
        <!-- 시간 선택 input 필드 -->
        <div class="form-group time-input">
          <div class="time-picker-container">
            <label for="time" class="time-label">시간</label>
            <input
              type="time"
              id="time"
              v-model="selectedTime"
              class="input-field short-time-input"
            />
          </div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- 확인과 취소 위치 변경 -->
          <v-btn text class="custom-button" @click="setDateTime">확인</v-btn>
          <v-btn text class="custom-button" @click="timePickerDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import SellerSidebar from '@/components/sidebar/SellerSidebar.vue';

export default {
  components: {
    SellerSidebar,
  },
  data() {
    return {
      coupon: {
        couponName: '',
        discountPercentage: 0,
        expirationDate: '',  // YYYY-MM-DD 형식
        expirationTime: '',  // HH:mm 형식
        farmId: null,
      },
      selectedDate: null, // 선택된 날짜
      selectedTime: "12:00", // 선택된 시간
      formattedExpiration: '', // 화면에 표시할 날짜 및 시간 형식
      datePickerDialog: false, // 날짜 선택 모달 상태
      timePickerDialog: false, // 시간 선택 모달 상태
    };
  },
  methods: {
    openTimePicker() {
      this.datePickerDialog = false;
      this.timePickerDialog = true;
    },
    setDateTime() {
      if (this.selectedDate && this.selectedTime) {
        this.coupon.expirationDate = this.selectedDate;
        this.coupon.expirationTime = this.selectedTime;

        this.formattedExpiration = `${this.selectedDate} ${this.selectedTime}`;

        this.timePickerDialog = false;
      }
    },
    async createCoupon() {
      const requestData = {
        couponName: this.coupon.couponName,
        discountPercentage: this.coupon.discountPercentage,
        expirationDate: this.coupon.expirationDate, 
        expirationTime: this.coupon.expirationTime,
        farmId: this.coupon.farmId,
      };

      const token = localStorage.getItem('Bearer Token');
      const sellerId = localStorage.getItem('sellerId');

      try {
        await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/order-service/coupons/create`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              sellerId: sellerId,
            },
          }
        );
        alert('쿠폰이 성공적으로 생성되었습니다.');
      } catch (error) {
        console.error('쿠폰 생성 실패:', error.response.data);  
        alert('쿠폰 생성에 실패했습니다.');
      }
    },
  },
};
</script>

<style scoped>
.coupon-form-container {
  padding: 50px;
  margin-left: -150px; /* 폼을 왼쪽으로 이동 */
  background-color: white;
  width: 30%; /* 폼의 가로 크기를 절반으로 줄임 */
}

.coupon-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: white; /* 폼 안 배경을 흰색으로 */
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center; /* 가운데 정렬 */
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.input-field {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}

.full-width-input {
  width: 100%;
}

.short-input {
  width: 80px;
}

.discount-input {
  display: flex;
  align-items: center;
}

.percent-sign {
  font-size: 18px;
  margin-left: 10px;
}

.expiration-input {
  display: flex;
  align-items: center;
}

.expiration-input .mdi-calendar {
  margin-left: 10px;
  font-size: 24px;
  color: #333;
  cursor: pointer;
}

.submit-btn {
  background-color: #b4cf97;
  color: black;
  border-radius: 30px;
  padding: 10px 40px;
  font-size: 15px;
  font-weight: bold; /* 글씨체를 할인율과 동일하게 설정 */
  align-self: flex-end; /* 버튼을 오른쪽으로 정렬 */
  line-height: 1.5; /* 등록 텍스트를 올리기 위한 기본 설정 */
  width: 30%; /* 버튼 크기를 80%로 줄임 */
}

.submit-btn .v-btn__content {
  transform: translateY(-10px); /* 등록 텍스트를 10px 올림 */
}

.submit-btn:hover {
  background-color: #a3bd87;
}

.short-time-input {
  width: 50%; /* 시간 선택 input의 가로 길이를 50%로 줄임 */
}

.time-picker-container {
  display: flex;
  justify-content: center; /* input과 label을 가운데 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  gap: 30px; /* label과 input 사이의 거리 30px로 설정 */
  margin-top: 10px; /* label과 input을 10px 아래로 이동 */
}

.custom-button {
  color: black !important; /* 텍스트 색상 검정으로 설정 */
  transition: background-color 0.3s ease; /* 배경색 변경 시 부드럽게 전환 */
  border-radius: 50px; /* 모서리 둥글기 50px로 설정 */
}

.custom-button:hover {
  background-color: #BCC07B; /* 마우스 호버 시 배경색 변경 */
}
</style>
