<template>
    <div class="login-page">
        <div class="login-container">
            <!-- 로그인 제목 -->
            <img :src="require('@/assets/inongLogo.png')" width=100px/>
            <h2 class="login-title">로그인</h2>
            
            <img :src="require('@/assets/kakao_login.png')" class="sign-in" @click="kakaoLogin" />
            <!-- 구글 로그인 버튼 -->
            <img :src="require('@/assets/google_login.png')" class="sign-in" @click="googleLogin" />
            <!-- 판매자로 로그인하기 링크 -->
            <a class="seller-login" @click="openLoginModal">판매자로 로그인하기</a>
            <a class="seller-signup" @click="openSignUpModal">판매자로 회원가입</a>
        </div>

        <SellerSignIn
            :isModalOpen="isLoginModalOpen"
            :title="'판매자 로그인'"
            @close="closeLoginModal"
            @login="sellerLogin"/>

      <SellerSignUp
        v-model="isSignUpModalOpen"
        @close="closeSignUpModal"
        @register-success="handleRegisterSuccess"
      />

      <v-dialog v-model="isRegisterSuccessModalOpen" max-width="400px">
      <v-card class="modal-card" style="padding: 10px; padding-right: 20px; text-align: center;">
        <v-card-text style="margin-top: 20px;">동상이농 회원가입이 <br />
          완료되었습니다.</v-card-text>
        <v-btn @click="closeRegisterSuccessModal" class="submit-btn" style="margin-bottom:15px">닫기</v-btn>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>
import SellerSignIn from '@/views/product/seller/SellerSignIn.vue';
import SellerSignUp from '@/views/product/seller/SellerSignUp.vue';
  
export default {
    name: "KakaoLogin",
    components: {
        SellerSignIn,
        SellerSignUp,
    },
    data() {
      return {
        isLoginModalOpen: false,
        isSignUpModalOpen: false,
        isRegisterSuccessModalOpen: false,
      };
    },
    methods: {
        kakaoLogin() {
            const redirect_uri = process.env.VUE_APP_KAKAO_REDIRECT_URI;
            const client_id = process.env.VUE_APP_KAKAO_CLIENT_ID;
            const auth_url = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
            window.location.href = auth_url;
        },

        googleLogin() {
            const redirect_uri = process.env.VUE_APP_GOOGLE_REDIRECT_URI;
            const client_id = process.env.VUE_APP_GOOGLE_CLIENT_ID;
            const auth_url = `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&service=lso&o2v=1&ddm=0&flowName=GeneralOAuthFlow`;
            window.location.href = auth_url;
        },

      openLoginModal() {
        this.isLoginModalOpen = true;
      },
  
      closeLoginModal() {
        this.isLoginModalOpen = false;
      },
  
      openSignUpModal() {
        this.isSignUpModalOpen = true;
      },
  
      closeSignUpModal() {
        this.isSignUpModalOpen = false;
      },
  
        sellerLogin(formData) {
            console.log("판매자 로그인 성공: ", JSON.stringify(formData));
        },

        goToSellerSignUp() {
            this.$router.push({ path: '/seller/sign-up' });
        },
  
        handleRegisterSuccess() {
            this.isRegisterSuccessModalOpen  = true;
            this.isSignUpModalOpen = false;
        },

        closeRegisterSuccessModal() {
            this.isRegisterSuccessModalOpen = false;
        },
    },
  };
</script>

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 100px);
}

/* 로그인 제목 스타일 */
.login-title {
    font-size: 24px;
    font-weight: bold;
    margin: 10% 0 10% 0;
}

/* 로그인 버튼 컨테이너 스타일 */
.login-container {
    display: flex;
    padding-top: 50px;
    flex-direction: column;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 500px;
    height: 600px;
}

.sign-in {
    width: 300px;
    margin: 12px 0;
    cursor: pointer;
    transition: all 0.3s ease;
}

.sign-in:hover {
    transform: translateY(-3px);
}

.seller-login {
    margin-top: 20px;
    color: #999;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
}

.seller-login:hover {
    text-decoration: underline;
}

.seller-signup {
    margin-top: 20px;
    color: #999;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
}

.seller-signup:hover {
    text-decoration: underline;
}
.modal-card {
  background-color: rgb(255, 255, 255);
  border: none;
  padding: 35px;
  box-shadow: none;
  border-radius: 10px;
  height: 200px;
}

.submit-btn {
  margin-left: 10px;
  margin-top: 8px;
  background-color: #bcc07b;
  color: black;
  border-radius: 50px;
}
</style>
