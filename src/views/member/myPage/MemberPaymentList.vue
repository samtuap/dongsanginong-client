<template>
    <div>
        <!-- 멤버 사이드바 유지 -->
        <MemberSidebar />

        <div class="payment-list">
            <h2>결제 내역 조회</h2>
            <table>
                <thead>
                    <tr style="color: #BCC07B">
                        <th>주문 상품</th>
                        <th>주문 농장</th>
                        <th>결제일</th>
                        <th>결제 수단</th>
                        <th>결제 금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="payment in payments" :key="payment.id" style="gap: 100px;">
                        <td>{{ payment.packageName }}</td>
                        <td>{{ payment.farmName }}</td>
                        <td>{{ formatDate(payment.orderAt) }}</td>
                        <td>{{ payment.paymentMethod }}</td>
                        <td>{{ payment.totalPrice }}원</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import MemberSidebar from '@/components/sidebar/MemberSidebar.vue';

export default {
    components: {
        MemberSidebar,
    },
    data() {
        return {
            payments: [], // 결제 리스트 데이터
        };
    },
    mounted() {
        // 결제 리스트 데이터를 API에서 가져옴
        this.getPaymentList();
    },
    methods: {
        async getPaymentList() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/order-service/order/list`);
                this.payments = response.data;
                console.log(this.payments)
            } catch (error) {
                console.error("결제 리스트를 불러오는 중 오류가 발생했습니다.", error);
            }
        },
        formatDate(dateTime) {
            return dateTime.split('T')[0]; // "T"를 기준으로 날짜와 시간을 나눔, 앞부분(날짜)만 반환
        }
    },
};
</script>

<style scoped>
.payment-list {
    width: 100%;
    max-width: 900px;
    margin: 20px auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead th {
    background-color: #f5f5f5;
    text-align: left;
    padding: 10px;
    font-weight: bold;
}

tbody td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}
</style>