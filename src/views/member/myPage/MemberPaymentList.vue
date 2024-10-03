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
                        <th>결제 영수증</th> <!-- 영수증 항목 추가 -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="payment in payments" :key="payment.id">
                        <td>{{ payment.packageName }}</td>
                        <td>{{ payment.farmName }}</td>
                        <td>{{ formatDate(payment.orderAt) }}</td>
                        <td>{{ payment.paymentMethod }}</td>
                        <td>{{ payment.totalPrice }}원</td>
                        <td class="receipt-icon-cell">
                            <a :href="'/receipt/' + payment.receiptId" target="_blank" class="receipt-btn">
                                <img src="https://cdn-icons-png.flaticon.com/512/201/201282.png" alt="영수증 아이콘" class="receipt-icon" />
                            </a>
                        </td>
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
        },
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
    text-align: center;
    width: 100%;
    border-collapse: collapse;
}

thead th {
    text-align: center;
    background-color: #f5f5f5;
    padding: 10px;
    font-weight: bold;
}

tbody td {
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.receipt-icon-cell {
    text-align: center; /* 아이콘을 가운데 정렬 */
}

.receipt-btn {
    background: none;
    border: none;
    padding: 0;
}

.receipt-icon {
    width: 24px; /* 아이콘 크기 설정 */
    height: 24px;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
