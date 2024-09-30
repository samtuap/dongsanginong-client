<template>
    <div class="login-page">
        <div class="login-container">
            <!-- 로그인 제목 -->
            <h2 class="login-title">동상이농 로그인</h2>
            <!-- 카카오 로그인 버튼 -->
            <img :src="require('@/assets/kakao_login.png')" class="sign-in" @click="kakaoLogin" />
            <!-- 구글 로그인 버튼 -->
            <img :src="require('@/assets/google_login.png')" class="sign-in" />
            <!-- 판매자로 로그인하기 링크 -->
            <a class="seller-login">판매자로 로그인하기</a>
        </div>
    </div>
</template>

<script>
export default {
    name: "KakaoLogin",
    
    methods: {
        kakaoLogin() {
            const redirect_uri = process.env.VUE_APP_KAKAO_REDIRECT_URI;
            const client_id = process.env.VUE_APP_KAKAO_CLIENT_ID;
            const auth_url = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
            window.location.href = auth_url;
        }
    }
}
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
    margin-bottom: 20px;
}

/* 로그인 버튼 컨테이너 스타일 */
.login-container {
    display: flex;
    padding-top: 120px;
    flex-direction: column;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 900px;
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
</style>
