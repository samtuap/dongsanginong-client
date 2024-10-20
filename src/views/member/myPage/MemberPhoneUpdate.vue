<template>
    <!-- 완료 모달 -->
    <v-dialog v-model="alertModal" max-width="300px">
        <v-card class="modal"
            style="align-items: center; text-align: center; height: 120px; padding-bottom: 12px; overflow-y: hidden;">
            <v-card-text>{{ modalMessage }}</v-card-text>
            <v-btn @click="handleAlertClose" class="submit-btn" style="margin-top: -15px;">확인</v-btn>
        </v-card>
    </v-dialog>

    <div class="member-page" style="padding-right: 300px;">
        <MemberSidebar />
        <h3 style="margin-right: 76%;">내 정보 수정</h3><br>
        <div class="member-info">
            <!-- 전화번호 수정 -->
            <div class="number-container">
                <br>
                <div style="font-weight: 700; margin-left: 6%; font-size: 17px;"> <i class="mdi mdi-phone" style="font-size: 18px;"></i>
                    &nbsp;전화번호 변경
                </div>
                <br>
                <div class="label" style="padding-bottom: 20px;">
                    <div class="form-group">
                        <label style="font-size: 16px; font-weight: 400; margin-left: 10%;">현재 전화번호&nbsp;&nbsp;&nbsp;</label>
                        <input type="password" v-model="currentPhone" placeholder="현재 전화번호를 입력하세요." />
                    </div>
                    <div class="form-group">
                        <label style="font-size: 16px; font-weight: 400; margin-left: 10%;">&nbsp;&nbsp;&nbsp;새 전화번호&nbsp;&nbsp;&nbsp;</label>
                        <input type="password" v-model="newPhone" placeholder="새 전화번호를 입력하세요."/>
                    </div>
                </div>
                <div class="footer">
                    <div class="update-container">
                        <button class="update-button" @click="handleUpdatePhone">전화번호 수정하기</button>
                    </div>
                </div>
            </div>
            <br>
            <hr class="horizontal-divider" />

            <!-- 주소지 변경 -->
            <div class="address-container">
                <div style="font-weight: 700; margin-left: 8%; font-size: 17px;"> <i class="mdi mdi-home" style="font-size: 18px;"></i>
                    &nbsp;주소지 변경
                </div>
                <br>
                <form @submit.prevent="onSubmit_address">
                    <div class="form-group">
                        <label for="zipcode" style="font-size: 16px; font-weight: 400; margin-left: 14%;">우편번호 &nbsp;&nbsp;&nbsp;</label>
                        <input type="text" id="zipcode" v-model="zipcode" placeholder="우편번호를 입력하세요 (ex. 12345)" required readonly/>
                    </div>
                    <div class="form-group">
                        <input type="button" class="find-postal" @click="execDaumPostcode_address" value="우편번호 찾기" />
                    </div>
                    <!-- <input type="button" class="find-postal" @click="execDaumPostcode_address" value="우편번호 찾기" /> -->

                    <div class="form-group">
                        <label for="address" style="font-size: 16px; font-weight: 400; margin-left: 14%;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            주소&nbsp;&nbsp;&nbsp;
                        </label>
                        <input type="text" id="address" v-model="address" placeholder="도로명 주소를 입력하세요 (ex. 서울시 노원구)"
                            required readonly/>
                    </div>
                    <div class="form-group">
                        <label for="address-detail" style="font-size: 16px; font-weight: 400; margin-left: 14%;">상세 주소&nbsp;&nbsp;&nbsp;</label>
                        <input type="text" id="address-detail" v-model="addressDetail" placeholder="상세 주소를 입력하세요 (ex. 101호)"
                            required ref="addressDetail" />
                    </div>

                    <div class="footer">
                        <div class="update-container" style="margin-top: 20px;">
                            <button type="submit" class="update-button">주소지 변경하기</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 주소지 변경 완료 모달 -->
    <v-dialog v-model="alertModal_address" max-width="300px">
        <v-card class="modal" style="align-items: center; text-align: center; height: 130px; padding-bottom: 20px; 
        overflow-y: hidden;">
            <v-card-text style="margin-bottom:5px">{{ modalMessage_address }}</v-card-text>
            <v-btn @click="handleAlertClose_address" class="submit-btn" style="border-radius: 50px; width: 100px">확인</v-btn>
        </v-card>
    </v-dialog>

    <!-- 주소지 변경 에러 모달 -->
    <v-dialog v-model="errorModal" max-width="300px">
        <v-card class="modal" style="align-items: center; text-align: center;">
            <v-card-text>주소지 변경 중 오류가 발생했습니다. <br /> 다시 시도해주세요.</v-card-text>
            <v-btn @click="handleCloseErrorModal_address" class="submit-btn" width="100px">확인</v-btn>
        </v-card>
    </v-dialog>
</template>


<script>
import axios from 'axios';
import MemberSidebar from '@/components/sidebar/MemberSidebar.vue';

export default {
    components: {
        MemberSidebar
    },
    data() {
        return {
            memberInfo: {
                phone: '',
                address: '',
                addressDetail: '',
                zipcode: ''
            },
            currentPhone: '',
            newPhone: '',
            loading: false,
            alertModal: false,
            modalMessage: '',

            // 주소지 변경 
            memberInfo_address: {
                phone: '',
                address: '',
                addressDetail: '',
                zipcode: ''
            },
            zipcode: '',
            address: '',
            addressDetail: '',
            alertModal_address: false,
            errorModal: false,
            modalMessage_address: '',
            loading_address: false,
            daum: null
        };
    },
    methods: {
        // 전화번호 변경
        async fetchMemberInfo() {
            this.loading = true;
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/member-info`);
                this.memberInfo = response.data;
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
        handleAlertClose() {
            this.alertModal = false;
            if (this.modalMessage === "전화번호가 수정되었습니다.") {
                window.location.reload();
            }
        },
        async handleUpdatePhone() {
            if (this.currentPhone !== this.memberInfo.phone) {
                this.modalMessage = "전화번호가 일치하지 않습니다.";
            } else if (!this.newPhone) {
                this.modalMessage = "변경하실 전화번호를 입력해주세요.";
            } else {
                try {
                    const updateInfo = {
                        phone: this.newPhone,
                        address: this.memberInfo.address,
                        addressDetail: this.memberInfo.addressDetail,
                        zipcode: this.memberInfo.zipcode
                    };
                    await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/update-info`, updateInfo);
                    this.modalMessage = "전화번호가 수정되었습니다.";
                } catch (error) {
                    console.log(error);
                    this.modalMessage = "전화번호 수정에 실패했습니다.";
                }
            }
            this.alertModal = true;
        },
        // 주소지 변경 
        async fetchMemberInfo_address() {
            this.loading_address = true;
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/member-info`);
                this.memberInfo_address = response.data;
            } catch (error) {
                console.log(error);
            } finally {
                this.loading_address = false;
            }
        },
        handleAlertClose_address() {
            this.alertModal_address = false;
            if (this.modalMessage_address === "주소지가 변경되었습니다.") {
                window.location.reload();
            }
        },
        handleCloseErrorModal_address() {
            this.errorModal = false;
        },
        async onSubmit_address() {
            // 입력값 검증
            if (!this.zipcode || !this.address || !this.addressDetail) {
                this.modalMessage_address = "모든 주소 정보를 입력해 주세요."; // 에러 메시지 설정
                this.errorModal = true; // 에러 모달 띄우기
                return; // 함수 종료
            }

            const addressData = {
                phone: this.memberInfo_address.phone,
                zipcode: this.zipcode,
                address: this.address,
                addressDetail: this.addressDetail
            };

            try {
                await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/update-info`, addressData);
                this.modalMessage_address = "주소지가 변경되었습니다.";
                this.alertModal_address = true;
            } catch (error) {
                console.error("주소지 변경 실패:", error);
                this.modalMessage_address = "주소지 변경에 실패했습니다.";
                this.errorModal = true; // 에러 모달 띄우기
            }
        },
        execDaumPostcode_address() {
            if (this.daum) {
                new this.daum.Postcode({
                    oncomplete: (data) => {
                        this.zipcode = data.zonecode;
                        this.address = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
                        this.$nextTick(() => {
                            this.$refs.addressDetail.focus();
                        });
                    }
                }).open();
            } else {
                console.error("주소지 변경에 실패했습니다. 다시 시도해주세요.");
            }
        }
    },
    mounted() {
        // 전화번호 변경 
        this.fetchMemberInfo();

        // 주소지 변경
        this.fetchMemberInfo_address();
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = () => {
            this.daum = window.daum;
        };
        document.body.appendChild(script);
    }
};
</script>


<style scoped>
.member-page {
    background-color: #F3F3F3;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    flex-direction: column;
}

.member-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px 40px;
    width: 905px;
    min-height: 650px;
    margin-left: 20%;
    background-color: white;
}

.number-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.footer {
    display: flex;
    flex-direction: column;
    margin-top: auto;
}

.update-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.update-button {
    margin-top: -10px;
    margin-right: 12%;
    background-color: #BCC07B;
    color: black;
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 15px;
}

.submit-btn {
    margin-left: 10px;
    margin-top: 8px;
    background-color: #BCC07B;
    color: black;
    border-radius: 50px;
}

/* 주소지 변경 스타일 */
.address-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px 0;
}

.form-group {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    margin-top: 20px;
}

input {
    width: 65%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 50px;
}

input[type="button"].find-postal {
    padding: 10px;
    background-color: #FFE2A6;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px; 
    font-weight: 400; 
    margin-left: 23%;
}

input.find-postal:hover {
    background-color: #FFD68B;
}

.horizontal-divider {
    width: 100%;
    border: none;
    border-top: 3px solid #ededed;
    margin: 20px 0;
}
</style>
