<template>
    <div class="member-page">
        <MemberSidebar />

        <div class="member-info">
            <h2>마이 페이지</h2>
            <div class="info-container">
                <div class="label">
                    <p>이름</p>
                    <p>이메일</p>
                    <p>전화번호</p>
                    <p>우편번호</p>
                    <p>배송지</p>
                </div>

                <!-- 회색 세로선 -->
                <div class="divider"></div>

                <!-- 데이터를 받아와 표시할 부분 -->
                <div class="value">
                    <p>{{ memberInfo.name }}</p>
                    <p>{{ memberInfo.email }}</p>
                    <p>{{ memberInfo.phone }}</p>
                    <p>{{ memberInfo.zipcode }}</p>
                    <p>{{ memberInfo.address }} {{ memberInfo.addressDetail }}</p>
                </div>
            </div>

            <!-- 로딩 중일 때 표시 -->
            <p v-if="loading">정보를 불러오는 중...</p>

            <!-- 에러가 발생했을 때 표시 -->
            <p v-if="error">{{ error }}</p>
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
            error: null  // error 변수를 유지함
        };
    },
    methods: {
        fetchMemberInfo() {
            this.loading = true;
            this.error = null;  // 에러 초기화

            // 서버에서 회원 정보를 받아오기
            axios
                .get('/member-service/member/member-info', {
                    headers: {
                        
                    }
                })
                .then((response) => {
                    this.memberInfo = response.data;
                })
                .catch((error) => {
                    // 에러 메시지 설정
                    this.error = error;
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
    mounted() {
        // 컴포넌트가 로드되면 데이터 요청 실행
        this.fetchMemberInfo();
    }
};
</script>

<style scoped>
.member-page {
    display: flex;
}

.member-info {
    flex-grow: 1;
    padding: 20px;
}

.info-container {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    align-items: center;
}

.label {
    text-align: left;
    padding-right: 20px;
}

.divider {
    width: 1px;
    background-color: #ccc;
    height: 100%;
}

.value {
    text-align: left;
    padding-left: 20px;
}

h2 {
    margin-bottom: 20px;
    font-size: 24px;
}
</style>
