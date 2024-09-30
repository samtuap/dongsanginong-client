<template>
    <div class="member-signup">
        <h2>회원 정보 입력</h2>
        <form @submit.prevent="onSubmit">
            <div class="form-group">
                <label for="name">이름</label>
                <input type="text" id="name" v-model="name" placeholder="이름을 입력하세요" required />
            </div>

            <div class="form-group">
                <label for="phone">전화번호</label>
                <input type="tel" id="phone" v-model="phone" placeholder="전화번호를 입력하세요" required />
            </div>

            <div class="form-group">
                <label for="email">이메일</label>
                <span>{{ email }}</span>
            </div>

            <div class="form-group">
                <label for="postal-code">우편번호</label>
                <input type="text" id="postal-code" v-model="postalCode" placeholder="우편번호를 입력하세요 (ex. 12345)" required />
                <input type="button" style="background-color: #FFE2A6;" class="find-postal" @click="execDaumPostcode" value="우편번호 찾기" />
            </div>

            <div class="form-group">
                <label for="address">주소</label>
                <input type="text" id="address" v-model="address" placeholder="도로명 주소를 입력하세요 (ex. 서울시 노원구)" required />
            </div>

            <div class="form-group">
                <label for="address-detail">상세 주소</label>
                <input type="text" id="address-detail" v-model="addressDetail" placeholder="상세 주소를 입력하세요 (ex. 101호)" required ref="addressDetail" />
            </div>

            <button type="submit" class="submit-btn">회원 가입 하기</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            name: '',
            phone: '',
            postalCode: '',
            address: '',
            addressDetail: '',
            email: localStorage.getItem("email"),
            socialType: localStorage.getItem("socialType") // 소셜 타입을 로컬 스토리지에서 가져오기
        };
    },
    methods: {
        async onSubmit() {
            const memberData = {
                name: this.name,
                phone: this.phone,
                postalCode: this.postalCode,
                address: this.address,
                addressDetail: this.addressDetail,
                email: this.email,
                socialType: this.socialType // 소셜 타입 추가
            };
            
            try {
                const token = localStorage.getItem("accessToken"); // 저장된 액세스 토큰 가져오기
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/sign-up`, memberData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                console.log("회원가입 성공:", response.data);
                // 회원가입 성공 후 처리 (예: 로그인 페이지로 리다이렉트)
                alert('회원가입이 완료되었습니다.');
                window.location.href = '/login'; // 로그인 페이지로 이동
            } catch (error) {
                console.error("회원가입 실패:", error);
                alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        },
        execDaumPostcode() {
            if (this.daum) {
                new this.daum.Postcode({
                    oncomplete: (data) => {
                        this.postalCode = data.zonecode;
                        this.address = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
                        this.$nextTick(() => {
                            this.$refs.addressDetail.focus();
                        });
                    }
                }).open();
            } else {
                console.error("Daum Postcode API가 로드되지 않았습니다.");
            }
        }
    },
    mounted() {
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
.member-signup {
    max-width: 400px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
}

span {
    display: block;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
}

input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button.submit-btn {
    width: 100%;
    padding: 10px;
    background-color: #DBE098;
    font-size: 18px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button.submit-btn:hover {
    background-color: #DBE098;
}
</style>
