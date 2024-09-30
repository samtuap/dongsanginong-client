<template>
    <v-app-bar app dark dense height="70">
        <v-container class="bar" fluid>
            <v-row no-gutters class="flex-nowrap justify-space-between">
                <!-- 콜 전체를 왼쪽정 렬되게 해줌 -->
                <v-col class="d-flex justify-start">
                    <v-btn style="text-transform: none;">Farm</v-btn>
                    <v-btn style="text-transform: none;">Live</v-btn>
                    <v-btn style="text-transform: none;" v-if="!isSeller">Mypage</v-btn>
                    <v-btn style="text-transform: none;" v-if="isSeller">MyFarm</v-btn>
                </v-col>
                <v-col class="text-center">
                    <v-btn :to="{ path: '/' }" color="white">
                        <img src="/inongLogo.png" width=175 alt="Logo" class="main-logo-image" />
                    </v-btn>
                </v-col>
                <!-- 콜 전체를 오른쪽 정렬되게 해줌 -->
                <v-col class="d-flex justify-end">
                    <v-btn style="text-transform: none;" v-if="!isLogin" class="reduce-spacing"
                        :to="{ path: '/sign-in' }">Login</v-btn>
                    <v-btn style="text-transform: none;" v-if="isLogin" class="reduce-spacing"
                        @click="logout">Logout</v-btn>
                    <v-btn color="white" class="reduce-spacing">
                        <img src="/notifications.png" width=30 alt="Logo" />
                    </v-btn>
                    <v-btn color="white">
                        <img src="/searchLogo.png" width=20 alt="Logo" />
                    </v-btn>
                </v-col>
            </v-row>

        </v-container>
    </v-app-bar>
</template>
<script>
export default {
    data() {
        return {
            isLogin: false, // 로그인 여부 확인 
            isSeller: false, // seller인지 member인지 여부 확인
        }
    },
    created() {
        // localStorage.setItem('token', 'temporary-token'); // 테스트용
        const token = localStorage.getItem('accessToken');
        if (token) {
            this.isLogin = true;
        } else {
            this.isLogin = false;
        }
    },
    methods: {
        logout() {
            localStorage.clear();
            this.isLogin = false;
            alert('로그아웃 되었습니다.');
            window.location.href = '/';
        },
    },
};
</script>

<style scoped>
.bar {
    /* font-family: "Fredoka", sans-serif;  */
    font-weight: 400;
}

.main-logo-image {
    transform: translateY(-21px);
}

.reduce-spacing {
    padding-right: 0px;
}
</style>