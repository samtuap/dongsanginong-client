<template>
    <div class="loader-container">
        <img src="/loading.gif" width="50px" />
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "KakaoCallback",
    created() {
        const code = new URL(window.location.href).searchParams.get("code");

        if (code) {
            this.getKakaoToken(code);
        } else {
            console.error("NO code");
        }
    },
    methods: {
        async getKakaoToken(code) {
            try {
                // 카카오 액세스 토큰 요청
                const client_id = process.env.VUE_APP_KAKAO_CLIENT_ID;
                const redirect_uri = process.env.VUE_APP_KAKAO_REDIRECT_URI;
                const tokenResponse = await axios.post(
                    'https://kauth.kakao.com/oauth/token',
                    null,
                    {
                        params: {
                            grant_type: 'authorization_code',
                            client_id: client_id,
                            redirect_uri: redirect_uri,
                            code: code
                        }
                    }
                );
                const { access_token } = tokenResponse.data;
                
                // 동상이농 회원이 아닐 경우 해당 소셜 이메일로 가입하기 위해 이메일만 요청 후 localStorage 에 저장
                const emailResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
                const email = emailResponse.data.kakao_account.email;
                localStorage.setItem("email", email);
                localStorage.setItem("socialType", "KAKAO")

                const apiUrl = `${process.env.VUE_APP_API_BASE_URL}/member-service/member/sign-in`;
                // 서버에 로그인 요청
                const signInResponse = await axios.post(
                    apiUrl,
                    { socialType: 'KAKAO' },
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        }
                    }
                );

                // 로컬 스토리지 토큰 저장
                localStorage.clear(); // 회원가입을 위해서 저장했던 데이터 지워주기
                localStorage.setItem("accessToken", signInResponse.data.accessToken);
                localStorage.setItem("refreshToken", signInResponse.data.refreshToken);
                localStorage.setItem("role", signInResponse.data.role);

                // 홈으로 리다이렉트
                window.location.href = process.env.VUE_APP_MY_URL;
            } catch (error) {
                if (error.response.data.name === 'NEED_TO_REGISTER') {
                    alert('동상이농 회원이 아닙니다. 회원가입 페이지로 이동합니다.');
                    window.location.href = '/sign-up';
                } else {
                    console.error(error);
                }
            }
        }
    }
}
</script>

<style>
.loader-container {
    display: flex;
    justify-content: center;
    padding-top: 100px;
}
</style>