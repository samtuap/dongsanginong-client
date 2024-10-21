<template>
  <v-dialog :model-value="dialog" persistent max-width="530px" @update:model-value="updateDialog">
    <v-card class="custom-card" style="font-size: 15px;">
      <v-card-title class="custom-title">
        <span class="headline" style="font-size: 18px;">쿠폰 생성</span>
      </v-card-title>
      <v-card-text>
        <div class="coupon-form no-border">
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

          <!-- 수량 선택 -->
          <div class="form-group">
            <label class="form-label">수량</label>
            <div class="quantity-input">
              <v-radio-group v-model="isUnlimitedQuantity" @change="updateQuantity">
                <v-radio label="무제한" value="unlimited"></v-radio>
                <v-radio label="수량 제한" value="limited"></v-radio>
              </v-radio-group>
              <div v-if="isUnlimitedQuantity === 'limited'">
                <input
                  type="number"
                  v-model="coupon.quantity"
                  class="input-field short-input"
                  min="1"
                  required
                  placeholder="수량 입력"
                />
                <span class="percent-sign">개</span>
              </div>
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
        </div>
      </v-card-text>
      <v-card-actions class="action-buttons">
        <v-btn class="custom-button" @click="validateAndCreateCoupon">등록</v-btn>
        <v-btn class="custom-cancel-button" @click="updateDialog(false)">닫기</v-btn>
      </v-card-actions>
    </v-card>

    <!-- 날짜 선택 모달 -->
    <v-dialog v-model="datePickerDialog" max-width="330px">
      <v-card style="padding-top: 10px;">
        <v-card-title class="headline" style="font-size: 17px;">날짜 선택</v-card-title>
        <v-date-picker v-model="selectedDate" @update:model-value="openTimePicker" />
      </v-card>
    </v-dialog>

    <!-- 시간 선택 모달 -->
    <v-dialog v-model="timePickerDialog" max-width="350px">
      <v-card style="padding-top: 10px;">
        <v-card-title class="headline" style="font-size: 17px;">시간 선택</v-card-title>
        <div class="form-group time-input">
          <div class="time-picker-container">
            <input
              type="time"
              id="time"
              v-model="selectedTime"
              class="input-field short-time-input centered-input"
            />
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text class="custom-button" @click="setDateTime">확인</v-btn>
          <v-btn text class="custom-cancel-button" @click="timePickerDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 알림 모달 -->
    <v-dialog v-model="alertDialog" max-width="350px">
      <v-card class="modal" style="padding: 10px; padding-bottom: 15px; text-align: center;">
        <v-card-text style="text-align: center;">{{ alertMessage }}</v-card-text>
        <v-btn @click="closeAllModals" style=" margin-top: -10px; border-radius: 50px; width: 90%; margin-left: 5%;
        background-color: #BCC07B">닫기</v-btn>
      </v-card>
    </v-dialog>
  </v-dialog>

  <!--  완료 모달  -->
  <v-dialog v-model="successModal" max-width="260px">
    <v-card class="modal" style="padding: 10px; text-align: center;">
          <v-card-text style="text-align: center;">등록이 완료되었습니다.</v-card-text>
          <v-btn @click="closeSuccessModal" class="submit-btn">확인</v-btn>
      </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      coupon: {
        couponName: '',
        discountPercentage: 0,
        expirationDate: '',
        expirationTime: '',
        quantity: 0, // 수량 필드 추가
      },
      isUnlimitedQuantity: 'limited', // 수량 제한 여부를 위한 값
      selectedDate: null,
      selectedTime: '12:00',
      formattedExpiration: '',
      datePickerDialog: false,
      timePickerDialog: false,
      alertDialog: false,
      alertMessage: '',
      successModal: false,
    };
  },
  methods: {
    resetFormData() {
      this.coupon = {
        couponName: '',
        discountPercentage: 0,
        expirationDate: '',
        expirationTime: '',
        quantity: 0, // 초기화
      };
      this.isUnlimitedQuantity = 'limited'; // 무제한 수량 선택 초기화
      this.selectedDate = null;
      this.selectedTime = '12:00';
      this.formattedExpiration = '';
    },
    updateDialog(value) {
      if (!value) {
        this.resetFormData();
      }
      this.$emit('update:dialog', value);
    },
    openTimePicker() {
      if (this.selectedDate) {
        this.timePickerDialog = true;
      }
    },
    setDateTime() {
      if (this.selectedDate && this.selectedTime) {
        const year = this.selectedDate.getFullYear();
        const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.selectedDate.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`;
        
        this.coupon.expirationDate = formattedDate;
        this.coupon.expirationTime = this.selectedTime;
        this.formattedExpiration = `${formattedDate} ${this.selectedTime}`;
        
        this.datePickerDialog = false;
        this.timePickerDialog = false;
      }
    },
    showAlert(message) {
      this.alertMessage = message;
      this.alertDialog = true;
    },
    updateQuantity() {
      if (this.isUnlimitedQuantity === 'unlimited') {
        this.coupon.quantity = -1; // 무제한일 경우 -1로 설정
      } else {
        this.coupon.quantity = 1; // 기본값 설정
      }
    },
    validateAndCreateCoupon() {
      if (!this.coupon.couponName) {
        this.showAlert('쿠폰 이름을 입력하세요.');
        return;
      }

      if (this.coupon.discountPercentage <= 0) {
        this.showAlert('할인율은 1% 이상이어야 합니다.');
        return;
      }

      if (!this.coupon.expirationDate || !this.coupon.expirationTime) {
        this.showAlert('쿠폰 소멸 일자를 선택하세요.');
        return;
      }

      if (this.isUnlimitedQuantity === 'limited' && this.coupon.quantity <= 0) {
        this.showAlert('수량을 입력하세요.');
        return;
      }

      this.createCoupon();
    },
    async createCoupon() {
      const requestData = {
        couponName: this.coupon.couponName,
        discountPercentage: this.coupon.discountPercentage,
        expirationDate: this.coupon.expirationDate,
        expirationTime: this.coupon.expirationTime,
        quantity: this.coupon.quantity, // 수량 추가
      };

      const token = localStorage.getItem('Bearer Token');
      const sellerId = localStorage.getItem('sellerId');

      try {
        await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/order-service/coupon/create`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              sellerId: sellerId,
            },
          }
        );
        this.successModal = true;
        // this.showAlert('쿠폰이 성공적으로 생성되었습니다.');
      } catch (error) {
        console.error('쿠폰 생성 실패:', error.response?.data || error.message);
        this.showAlert('쿠폰 생성에 실패했습니다.');
      }
    },
    closeAllModals() {
      this.alertDialog = false;
    },
    closeSuccessModal() {
      this.successModal = false;
      this.updateDialog(false);
      window.location.reload();
    }
  },
};
</script>

<style scoped>
.custom-card {
  border-radius: 30px;
  padding: 10px;
  padding-top: 20px;
}

.custom-title {
  background-color: #BCC07B;
  border-radius: 10px;
  text-align: center;
  width: calc(97% - 30px);
  margin: 0 auto;
  padding: 7px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-label {
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

.short-time-input {
  width: 70%;
}

.centered-input {
  margin: 0 auto;
}

.time-picker-container {
  display: flex;
  justify-content: center;
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

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: -10px;
}

.custom-button {
  background-color: #BCC07B;
  color: black;
  border-radius: 30px;
  padding: 7px 30px;
  font-size: 14px;
  line-height: 1.5;
}

.custom-cancel-button {
  background-color: #e0e0e0;
  color: black;
  border-radius: 30px;
  padding: 7px 30px;
  font-size: 14px;
  line-height: 1.5;
}

.modal {
  background-color: rgb(255, 255, 255);
  border: none;
  box-shadow: none;
  border-radius: 10px;
}

.submit-btn {
  margin-top: -10px;
  background-color: #BCC07B;
  color: black;
  border-radius: 50px;
  width: 50%;
  margin-left: 27%;
}
</style>
