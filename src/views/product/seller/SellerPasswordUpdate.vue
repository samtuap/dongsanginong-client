<template>
    <!-- 완료 모달 -->
    <v-dialog v-model="alertModal" max-width="300px">
        <v-card class="modal"
            style="align-items: center; text-align: center; height: 160px; padding-bottom: 20px; overflow-y: hidden;">
            <v-card-text>{{ modalMessage }}</v-card-text>
            <v-btn @click="handleAlertClose" class="submit-btn">확인</v-btn>
        </v-card>
    </v-dialog>

    <v-container fluid>
        <SellerSidebar />
        <h3 style="padding: 10px; padding-left: 70px;">비밀번호 수정</h3>

        <v-row class="info-container" style="margin-top:30px; padding-left: 70px;">
            <hr class="horizontal-divider" />
            <v-col cols="12" sm="8" md="6" lg="12">
                <div class="value">
                    <div class="label">
                        <label style="font-size: 17px;">현재 비밀번호</label>
                        <br />
                        <input type="password" v-model="currentPassword" placeholder="현재 비밀번호를 입력하세요." class="form-input" />
                    </div>

                    <div class="label">
                        <label style="font-size: 17px;">새 비밀번호</label>
                        <br />
                        <input type="password" v-model="newPassword" placeholder="새 비밀번호를 입력하세요." class="form-input" />
                    </div>
                </div>

                <hr class="horizontal-divider" />

                <div class="footer">
                    <div class="update-container">
                        <button class="update-button" @click="handleUpdatePassword">비밀번호 수정하기</button>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import SellerSidebar from '@/components/sidebar/SellerSidebar.vue';

export default {
    components: {
        SellerSidebar
    },
    data() {
        return {
            currentPassword: '',
            newPassword: '',
            loading: false,
            alertModal: false,
            modalMessage: ''
        };
    },
    methods: {
        handleAlertClose() {
            this.alertModal = false;
            if (this.modalMessage === "비밀번호가 수정되었습니다.") {
                window.location.reload();
            }
        },
        async handleUpdatePassword() {
            if (!this.currentPassword || !this.newPassword) {
                this.modalMessage = "모든 필드를 입력해주세요.";
            } else {
                try {
                    const passwordUpdateRequest = {
                        oldPassword: this.currentPassword,
                        newPassword: this.newPassword
                    };
                    await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/product-service/seller/info/password/update`, passwordUpdateRequest);
                    this.modalMessage = "비밀번호가 수정되었습니다.";
                } catch (error) {
                    console.log(error);
                    this.modalMessage = "비밀번호 수정에 실패했습니다.";
                }
            }
            this.alertModal = true;
        }
    }
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: -100px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
    margin-bottom: 20px;
}

.horizontal-divider {
    width: 100%;
    border: none;
    border-top: 1px solid #ccc;
    margin: 20px 0;
}

.footer {
    display: flex;
    flex-direction: column;
    margin-top: auto;
}

.update-button {
    background-color: #BCC07B;
    color: black;
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
}

.submit-btn {
    margin-left: 10px;
    margin-top: 8px;
    background-color: #BCC07B;
    color: black;
    border-radius: 50px;
}

.info-container {
    display: flex;
    flex-direction: column;
    width: 800px;
    padding-left: 30px;
}

.value {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.label {
    
    font-size: large;
    color: #4a4a4a;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px; /* Space between labels */
}

.divider {
    width: 100%;
    border: none;
    border-top: 1px solid #ccc;
    margin: 20px 0;
}

.update-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>
