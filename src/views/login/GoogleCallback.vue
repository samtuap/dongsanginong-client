<template>
    <h1>로 그 인 하 는 중 ⭐️</h1>
</template>

<script>
import axios from "axios";
import qs from 'qs'; // qs 패키지 추가 > 구글 로그인 시 쿼리 문자열 형식으로 반환하기 위함

export default {
    name: "GoogleCallback",
    created() {
        const code = new URL(window.location.href).searchParams.get("code");

        if (code) {
            this.getGoogleToken(code);
        } else {
            console.error("NO code");
        }
    },
    methods: {
        async getGoogleToken(code) {
            try {
                const client_id = process.env.VUE_APP_GOOGLE_CLIENT_ID;
                const client_secret = process.env.VUE_APP_GOOGLE_CLIENT_SECRET;
                const redirect_uri = process.env.VUE_APP_GOOGLE_REDIRECT_URI;


                const data = {
                    grant_type: 'authorization_code',
                    client_id: client_id,
                    client_secret: client_secret,
                    redirect_uri: redirect_uri,
                    code: code
                };

                const tokenResponse = await axios.post(
                    'https://oauth2.googleapis.com/token',
                    qs.stringify(data), // qs로 쿼리 문자열 형식으로 변환
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );

                const { access_token } = tokenResponse.data;

                const signInResponse = await axios.post(
                    "http://localhost:8080/member-service/member/sign-in",
                    { socialType: 'GOOGLE' },
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        }
                    }
                );

                localStorage.setItem("accessToken", signInResponse.data.accessToken);
                localStorage.setItem("refreshToken", signInResponse.data.refreshToken);
                localStorage.setItem("role", signInResponse.data.role);

                window.location.href = "http://localhost:8081/";
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>
