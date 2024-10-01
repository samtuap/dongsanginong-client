<template>
    <div class="member-page" style="padding-right: 300px;">
        <MemberSidebar />
        <div class="member-info">
            <div class="header">
                <h2>마이 페이지</h2>
                <hr class="horizontal-divider" />
            </div>

            <div class="info-container">
                <div class="label">
                    <label style="font-weight: 900; font-size: large">이름</label>
                    <label>이메일</label>
                    <label>전화번호</label>
                    <label>우편번호</label>
                    <label>배송지</label>
                </div>

                <div class="divider"></div> <!-- 세로선 -->

                <div class="value">
                    <p>{{ memberInfo.name }}</p>
                    <p>{{ memberInfo.email }}</p>
                    <p>{{ memberInfo.phone }}</p>
                    <p>{{ memberInfo.zipcode }}</p>
                    <p>{{ memberInfo.address }} {{ memberInfo.addressDetail }}</p>
                </div>
            </div>

            <hr class="horizontal-divider" />

            <div class="footer">
                <div class="withdraw-container">
                    <a class="withdraw">탈퇴하기</a>
                </div>
                <p v-if="error">{{ error }}</p>
            </div>
        </div>
    </div>
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
                name: '',
                email: '',
                phone: '',
                address: '',
                addressDetail: '',
                zipcode: ''
            },
            loading: false,
            error: null
        };
    },
    methods: {
        async fetchMemberInfo() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/member-info`, {
                    headers: {
                        "myId": localStorage.getItem("memberId")
                    }
                });
                this.memberInfo = response.data;
            } catch (error) {
                this.error = error.response ? error.response.data.message : error.message;
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        this.fetchMemberInfo();
    }
};
</script>

<style scoped>
label {
    font-weight: 900;
    font-size: large;
}

.member-page {
    margin-left: 200px;
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
    padding: 40px;
    width: 1000px;
    height: 650px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
    margin-bottom: 20px;
}

.info-container {
    display: grid;
    grid-template-columns: 4fr auto 6fr; /* 라벨 4, 세로선, 값 6의 비율로 설정 */
    gap: 20px;
    align-items: center;
    width: 100%;
    flex-grow: 1;
}

.label {
    display: flex;
    color: #4a4a4a;
    flex-direction: column;
    height: 100%;
    text-align: left;
    justify-content: space-evenly;
    align-items: flex-start;
    padding-left: 100px;
    width: fit-content;
}

.value {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-evenly;
    text-align: left;
    padding-left: 100px;
}

.value p {
    margin: 0;
}

h2 {
    margin: 0;
    font-size: 24px;
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

.withdraw-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.withdraw {
    color: #999;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
}

.divider {
    width: 1px;
    background-color: #ccc;
    height: 100%; /* 세로선의 높이 */
}
</style>
