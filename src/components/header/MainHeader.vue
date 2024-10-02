<template>
    <v-app-bar app dark dense height="70">
        <v-container class="bar" fluid>
            <v-row no-gutters class="flex-nowrap justify-space-between">
                <!-- Left-aligned buttons -->
                <v-col class="d-flex justify-start">
                    <v-btn style="text-transform: none;" @click="this.$router.push(`/farm`)">Farm</v-btn>
                    <v-btn style="text-transform: none;">Live</v-btn>
                    <v-btn :to="{ path: '/member/my-page' }" style="text-transform: none;" v-if="!isSeller">Mypage</v-btn>
                    <v-btn style="text-transform: none;" v-if="isSeller" @click="checkFarmAndRedirect">MyFarm</v-btn>
                </v-col>
                <v-col class="text-center">
                    <v-btn :to="{ path: '/' }" color="white">
                        <img src="/inongLogo.png" width=175 alt="Logo" class="main-logo-image" />
                    </v-btn>
                </v-col>
                <!-- Right-aligned buttons -->
                <v-col class="d-flex justify-end">
                    <v-btn style="text-transform: none;" v-if="!isLogin" class="reduce-spacing"
                        :to="{ path: '/member/sign-in' }">Login</v-btn>
                    <v-btn style="text-transform: none;" v-if="isLogin" class="reduce-spacing"
                        @click="alertModal = true">Logout</v-btn> <!-- Open modal instead of logging out directly -->
                    <v-btn color="white" class="reduce-spacing">
                        <img src="/notifications.png" width=25 alt="Logo" />
                    </v-btn>
                    <v-btn color="white">
                        <img src="/searchLogo.png" width=17 alt="Logo" />
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-app-bar>

    <v-dialog v-model="alertModal" max-width="300px">
        <v-card class="modal" style="align-items: center; text-align: center; height: 160px; padding-bottom: 20px; 
        overflow-y: hidden;">
            <v-card-text>로그아웃 되었습니다.</v-card-text>
            <v-btn @click="handleLogout" class="submit-btn">close</v-btn>
        </v-card>
    </v-dialog>

    <v-dialog v-model="firstFarmModal" max-width="260px">
        <v-card class="farmModal" style="padding: 10px; padding-right: 20px; text-align: center;">
            <v-card-text style="font-weight: bold;">
            농장 정보가 존재하지 않네요.<br><br>농장 정보를 입력해주세요. :)
            </v-card-text>
            <v-btn @click="goToFarmCreate" class="submit-btn">확인</v-btn>
        </v-card>
    </v-dialog>
</template>

<script>

import axios from 'axios';

export default {
    data() {
        return {
            alertModal: false, // Initialize alertModal as a reactive data property
            isLogin: false, // 로그인 여부 확인 
            isSeller: false, // seller인지 member인지 여부 확인
            firstFarmModal: false,
        };
    },
    created() {
        const token = localStorage.getItem('accessToken');
        this.isLogin = !!token;

        const role = localStorage.getItem('role');

        if (token) {
            this.isLogin = true;
        } else {
            this.isLogin = false;
        }

        if(role == "SELLER") {
            this.isSeller = true;
        } else {
            this.isSeller = false;
        }

    },
    methods: {
        async checkFarmAndRedirect() {
        try {
            const response = await axios.get('http://localhost:8080/product-service/farm/exists', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
                if (response.data) {
                    this.$router.push('/seller/delivery-management');
                } else {
                    // 농장이 없을 경우 모달 띄우기
                    this.firstFarmModal = true; 
                }
            } catch (error) {
                console.error('농장 확인 실패:', error);
            }
        },

        goToFarmCreate() {
            this.firstFarmModal = false;
            this.$router.push('/farm/farm-create'); // 농장 생성 페이지로 이동
        },

        handleLogout() {
            localStorage.clear();
            this.isLogin = false;
            this.alertModal = false; // Close the modal
            window.location.href = '/'; // Redirect to home
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

.modal {
    background-color: rgb(255, 255, 255);
    border: none;
    box-shadow: none;
    border-radius: 10px;
}

.farmModal {
  background-color: rgb(255, 255, 255);
  border: none;
  box-shadow: none;
  border-radius: 10px;
  width: 300px;
}

.submit-btn {
    margin-left: 10px;
    margin-top: 8px;
    background-color: #BCC07B;
    color: black;
    border-radius: 50px;
}
</style>