<template>
  <div class="register-form">
    <h2>회원 가입</h2>
    <hr class="divider" />

    <form @submit.prevent="registerSeller">
      <!-- 이름 입력 -->
      <div class="form-group">
        <label for="name">이름</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          placeholder="이름을 입력해주세요."
          required
        />
      </div>

      <!-- 이메일 입력 -->
      <div class="form-group">
        <label for="email">이메일</label>
        <input
          type="text"
          id="email"
          v-model="formData.email"
          class="align-left"
          @input="checkEmail"
          placeholder="이메일을 입력해주세요."
          required
        />
        <p :class="emailStatusClass">{{ emailStatusMessage }}</p>
      </div>

      <!-- 이메일 인증 버튼 -->
      <button
        type="button"
        class="send-auth-code-button"
        @click="sendAuthCode"
        :disabled="!isEmailValid || isSendingAuthCode"
      >
        {{ authCodeButtonText }}
      </button>

      <!-- 인증 코드 입력 필드 및 타이머 -->
      <div v-if="isAuthCodeSent" class="form-group">
        <label for="verification-code">인증 코드</label>
        <div class="verification-container">
          <input
            type="text"
            id="verification-code"
            v-model="formData.verificationCode"
            placeholder="인증 코드를 입력해주세요."
            required
          />
          <button type="button" class="modal-button" @click="verifyAuthCode">
            인증
          </button>
        </div>
        <p :class="emailVerificationClass">{{ emailVerificationMessage }}</p>
        <!-- 타이머 표시 -->
        <p v-if="isTimerActive" class="timer-message">인증 코드 유효 시간: {{ formattedTimer }}</p>
      </div>

      <!-- 비밀번호 입력 -->
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          @input="validatePassword"
          placeholder="비밀번호를 입력해주세요."
          required
        />
        <p :class="passwordStatusClass">{{ passwordStatusMessage }}</p>
      </div>

      <!-- 비밀번호 확인 입력 -->
      <div class="form-group">
        <label for="confirm-password">비밀번호 확인</label>
        <input
          type="password"
          id="confirm-password"
          v-model="formData.confirmPassword"
          @input="validateConfirmPassword"
          placeholder="비밀번호를 다시 입력해주세요."
          required
        />
        <p :class="confirmPasswordStatusClass">{{ confirmPasswordStatusMessage }}</p>
      </div>

      <!-- 상호명 입력 -->
      <div class="form-group">
        <label for="business-name">상호명</label>
        <input
          type="text"
          id="business-name"
          v-model="formData.businessName"
          placeholder="상호명을 입력해주세요."
          required
          @input="validateForm"
        />
      </div>

      <div class="form-group">
        <label for="business-number">사업자 번호</label>
        <input
          type="text"
          id="business-number"
          v-model="formData.businessNumber"
          placeholder="사업자 번호를 입력해주세요."
          required
          @input="validateForm"
        />
      </div>

      <!-- 우편번호 입력 -->
      <div class="form-group">
        <label for="zipcode">우편번호</label>
        <input
          type="text"
          id="zipcode"
          v-model="formData.zipcode"
          placeholder="우편번호를 입력해주세요."
          readonly
          required
          @input="validateForm"
        />
        <br><br>
        <input type="button" value="우편번호 찾기" class="send-auth-code-button" @click="sample6_execDaumPostcode" />
      </div>

      <!-- 주소 입력 -->
      <div class="form-group">
        <label for="address">주소</label>
        <input
          type="text"
          id="address"
          v-model="formData.address"
          placeholder="주소를 입력해주세요."
          readonly
          required
          @input="validateForm"
        />
      </div>

      <!-- 상세주소 입력 -->
      <div class="form-group">
        <label for="detail-address">상세주소</label>
        <input
          type="text"
          id="detail-address"
          v-model="formData.addressDetail"
          placeholder="상세 주소를 입력해주세요."
          required
          @input="validateForm"
        />
      </div>

      <!-- 회원가입 버튼 -->
      <button type="submit" class="submit-button" :disabled="!isFormValid">
        회원가입
      </button>
    </form>

    <v-dialog v-model="alertModal" max-width="260px">
      <v-card class="modal" style="padding: 10px; padding-right: 20px; text-align: center;">
        <v-card-text>완료되었습니다.</v-card-text>
        <v-btn @click="closeModalAndRedirect" class="submit-btn">Close</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* global daum */
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        email: '',
        verificationCode: '',
        name: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        businessNumber: '',
        zipcode: '',
        address: '',
        addressDetail: '',
      },
      alertModal: false,
      isVerified: false, // 이메일 인증 상태
      isAuthCodeSent: false, // 인증 코드 전송 상태
      emailStatusMessage: '',
      emailStatusClass: '',
      passwordStatusMessage: '',
      passwordStatusClass: '',
      confirmPasswordStatusMessage: '',
      confirmPasswordStatusClass: '',
      isFormValid: false,
      isEmailValid: false, // 이메일 유효성 상태
      isSendingAuthCode: false,
      emailVerificationMessage: '', // 인증 완료 또는 실패 메시지
      emailVerificationClass: '', // 인증 메시지 스타일
      authCodeButtonText: '이메일 인증 코드 전송', // 인증 버튼 텍스트
      authCodeTimer: 300, // 타이머 (초 단위)
      timerInterval: null, // 타이머 인터벌 ID
      isTimerActive: false, // 타이머 활성화 상태
    };
  },
  computed: {
    formattedTimer() {
      const minutes = Math.floor(this.authCodeTimer / 60);
      const seconds = this.authCodeTimer % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
  },
  mounted() {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => {
      console.log('Daum Postcode script loaded.');
    };
    script.onerror = () => {
      alert('우편번호 API 스크립트 로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
    };
    document.head.appendChild(script);
  },
  methods: {
    async sendAuthCode() {
      if (!this.isEmailValid) {
        alert('유효한 이메일을 입력해주세요.');
        return;
      }
      this.isSendingAuthCode = true; // 코드 전송 중 상태 활성화
      this.emailStatusMessage = '코드를 전송 중입니다...';
      this.emailStatusClass = 'success-message';
      try {
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/product-service/seller/request-auth-code`, {
          email: this.formData.email,
        });
        this.emailStatusMessage = '코드가 전송되었습니다. 이메일을 확인해주세요.';
        this.authCodeButtonText = '이메일 인증 코드 재전송';
        this.isAuthCodeSent = true; // 인증 코드 입력 필드 표시
        this.resetTimer(); // 기존 타이머 중지 및 새 타이머 시작
      } catch (error) {
        this.emailStatusMessage = error.response?.data?.message || '코드 전송에 실패했습니다.';
        this.emailStatusClass = 'error-message';
      } finally {
        this.isSendingAuthCode = false;
      }
    },

    closeModalAndRedirect() {
      this.alertModal = false;
      window.location.href = '/member/sign-in'; // 회원가입 완료 후 페이지 이동
    },

    async verifyAuthCode() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/product-service/seller/verify-email`, {
          email: this.formData.email,
          code: this.formData.verificationCode,
        });
        if (response.status === 200) {
          this.emailVerificationMessage = '이메일 인증이 완료되었습니다.';
          this.emailVerificationClass = 'success-message';
          this.isVerified = true;
          this.stopTimer(); // 타이머 중지
        } else {
          this.emailVerificationMessage = '인증번호가 올바르지 않습니다.';
          this.emailVerificationClass = 'error-message';
        }
      } catch (error) {
        this.emailVerificationMessage =
          error.response?.data?.message || '이메일 인증에 실패했습니다.';
        this.emailVerificationClass = 'error-message';
      }
      this.validateForm();
    },

    async registerSeller() {
      // 최종 폼 유효성 검사
      if (!this.isFormValid) {
        alert('모든 필드를 올바르게 입력해주세요.');
        return;
      }

      try {
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/product-service/seller/sign-up`, this.formData);
        this.alertModal = true; // 회원가입 완료 모달 열기
      } catch (error) {
        alert(error.response?.data?.message || '회원가입에 실패했습니다.');
      }
    },

    sample6_execDaumPostcode() {
      if (!window.daum || !window.daum.Postcode) {
        alert('주소 검색 기능을 로드하지 못했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      new daum.Postcode({
        oncomplete: (data) => {
          const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
          this.formData.zipcode = data.zonecode;
          this.formData.address = addr;
          this.$nextTick(() => {
            document.getElementById('detail-address').focus();
          });
        },
      }).open();
    },

    validatePassword() {
      const password = this.formData.password;
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

      if (!password) {
        this.passwordStatusMessage = '비밀번호를 입력해주세요.';
        this.passwordStatusClass = 'error-message';
      } else if (!regex.test(password)) {
        this.passwordStatusMessage = '비밀번호는 8~20자의 영문자와 숫자를 포함해야 합니다.';
        this.passwordStatusClass = 'error-message';
      } else {
        this.passwordStatusMessage = '사용 가능한 비밀번호입니다.';
        this.passwordStatusClass = 'success-message';
      }

      this.validateConfirmPassword();
      this.validateForm();
    },

    validateConfirmPassword() {
      const { password, confirmPassword } = this.formData;
      if (!confirmPassword) {
        this.confirmPasswordStatusMessage = '비밀번호 확인을 입력해주세요.';
        this.confirmPasswordStatusClass = 'error-message';
      } else if (password !== confirmPassword) {
        this.confirmPasswordStatusMessage = '비밀번호가 일치하지 않습니다.';
        this.confirmPasswordStatusClass = 'error-message';
      } else {
        this.confirmPasswordStatusMessage = '비밀번호가 일치합니다.';
        this.confirmPasswordStatusClass = 'success-message';
      }
      this.validateForm();
    },

    async checkEmail() {
      const email = this.formData.email.trim();
      if (!email) {
        this.emailStatusMessage = '이메일을 입력해주세요.';
        this.emailStatusClass = 'error-message';
        this.isEmailValid = false;
        this.validateForm();
        return;
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.emailStatusMessage = '유효한 이메일 형식이 아닙니다.';
        this.emailStatusClass = 'error-message';
        this.isEmailValid = false;
        this.validateForm();
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/product-service/seller/check-email`,
          { params: { email } }
        );

        if (response.data.exists) {
          this.emailStatusMessage = '이미 사용 중인 이메일입니다.';
          this.emailStatusClass = 'error-message';
          this.isEmailValid = false;
        } else {
          this.emailStatusMessage = '사용 가능한 이메일입니다.';
          this.emailStatusClass = 'success-message';
          this.isEmailValid = true;
        }
      } catch (error) {
        this.emailStatusMessage = '이메일 확인 중 오류가 발생했습니다.';
        this.emailStatusClass = 'error-message';
        this.isEmailValid = false;
      }
      this.validateForm();
    },

    validateForm() {
      console.log("이메일 유효:", this.isEmailValid);
      console.log("인증 완료:", this.isVerified);
      console.log("비밀번호 유효:", this.passwordStatusClass);
      console.log("비밀번호 확인:", this.confirmPasswordStatusClass);

      this.isFormValid =
        this.isEmailValid &&
        this.isVerified &&
        this.passwordStatusClass === 'success-message' &&
        this.confirmPasswordStatusClass === 'success-message' &&
        this.formData.name.trim() !== '' &&
        this.formData.businessName.trim() !== '' &&
        this.formData.zipcode.trim() !== '' &&
        this.formData.address.trim() !== '' &&
        this.formData.addressDetail.trim() !== '';

      console.log("폼 전체 유효성:", this.isFormValid);
    },

    startTimer() {
      this.authCodeTimer = 300; // 5분 초기화
      this.isTimerActive = true;
      this.timerInterval = setInterval(() => {
        if (this.authCodeTimer > 0) {
          this.authCodeTimer--;
        } else {
          this.stopTimer();
          this.handleTimerExpire();
        }
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.timerInterval);
      this.isTimerActive = false;
      this.authCodeTimer = 0;
    },

    resetTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      this.startTimer();
    },

    handleTimerExpire() {
      this.emailVerificationMessage = '인증 시간이 만료되었습니다. 다시 시도해주세요.';
      this.emailVerificationClass = 'error-message';
      this.isAuthCodeSent = false;
      this.isVerified = false;
      this.formData.verificationCode = '';
      this.authCodeButtonText = '이메일 인증 코드 재전송';
    },
  },
};
</script>

<style scoped>
/* 기본 스타일 */
.register-form {
  width: 28%;
  margin: 50px auto;
  font-family: 'Noto Sans KR', sans-serif;
}

h2 {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #4a4a4a;
}

.form-group input[type='text'],
.form-group input[type='password'] {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #4a4a4a;
  box-sizing: border-box;
}

.form-group input[readonly] {
  background-color: #f9f9f9;
}

.send-auth-code-button {
  display: block;
  width: 100%;
  margin-bottom: 20px;
  background-color: #bcc07b;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
}

.send-auth-code-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.send-auth-code-button:hover:not(:disabled) {
  background-color: #a4b06f;
}

.verification-container {
  display: flex;
  align-items: center;
}

.verification-container input[type='text'] {
  flex: 1;
  margin-right: 10px;
}

.modal-button {
  background-color: #bcc07b;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
}

.modal-button:hover {
  background-color: #a4b06f;
}

.submit-button {
  width: 100%;
  padding: 15px;
  background-color: #bcc07b;
  color: black;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
  background-color: #a4b06f;
}

.success-message {
  color: #8e8e8e;
  font-size: 12px;
  margin-top: 5px;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.timer-message {
  color: #555;
  font-size: 12px;
  margin-top: 5px;
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
</style>
