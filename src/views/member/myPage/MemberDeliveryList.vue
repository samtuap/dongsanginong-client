<template>
    <div class="member-page" style="padding-right: 300px;">
        <MemberSidebar />
        <div class="delivery-list">
            <h2>결제 내역 조회</h2>
            <hr class="horizontal-divider" />
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>주문 상품</th>
                            <th>주문 농장</th>
                            <th>배송 일자</th>
                            <th>배송 현황</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredDeliveries === 0">
                            <td colspan="6">배송 조회할 목록이 없습니다.</td>
                        </tr>
                        <tr v-for="delivery in filteredDeliveries" :key="delivery.id">
                            <td>{{ delivery.packageName }}</td>
                            <td>{{ delivery.farmName }}</td>
                            <td>{{ formatDate(delivery.deliveryAt) }}</td>
                            <td>{{ formatDeliveryStatus(delivery.deliveryStatus) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">이전</button>
                <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
            </div>
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
            deliveries: [],
            currentPage: 0,
            totalPages: 0,
            itemsPerPage: 8,
        };
    },
    mounted() {
        this.getdeliveryList();
    },
    computed: {
        filteredDeliveries() {
            return this.deliveries.filter(delivery => delivery.deliveryStatus !== null && delivery.deliveryAt !== null);
        },
    },
    methods: {
        formatPrice(value) {
            if (value == null) {
                return "0원";
            }
            return parseInt(value).toLocaleString('ko-KR') + ' 원';
        },
        async getdeliveryList(page = 1) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/order-service/order/delivery/list`, {
                    params: {
                        page: page - 1,
                        size: this.itemsPerPage,
                    }
                });
                console.log(response.data);
                this.deliveries = response.data.content || [];

                // 필터링된 데이터로 totalPages 계산
                const filteredDeliveries = this.deliveries.filter(delivery => delivery.deliveryStatus !== null && delivery.deliveryAt !== null);
                this.totalPages = Math.ceil(filteredDeliveries.length / this.itemsPerPage) || 1;

                this.currentPage = page;
            } catch (error) {
                console.error("결제 리스트를 불러오는 중 오류가 발생했습니다.", error);
            }
        },
        formatDate(dateTime) {
            return dateTime.split('T')[0];
        },
        formatDeliveryStatus(status) {
            switch (status) {
                case 'IN_DELIVERY':
                    return '배송 중';
                case 'AFTER_DELIVERY':
                    return '배송 완료';
                default:
                    return '상태 미정';
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.getdeliveryList(this.currentPage + 1);
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.getdeliveryList(this.currentPage - 1);
            }
        },
    },
};
</script>


<style scoped>
.member-page {
    margin-left: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    flex-direction: column;
}

h2 {
    margin-bottom: 10px;
}

.delivery-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 40px;
    width: 1000px;
    min-height: 650px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.table-wrapper {
    flex: 1;
    margin-bottom: 20px;
}

table {
    width: 100%;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0 20px;
}

th,
td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 50px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    min-height: 50px;
}

.pagination button {
    padding: 10px 15px;
    background-color: #BCC07B;
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 5px;
}

.pagination button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}

.pagination span {
    margin: 0 15px;
}

.receipt-icon {
    width: 24px;
    height: 24px;
}

tbody td {
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.receipt-icon-cell {
    text-align: center;
}

.horizontal-divider {
    width: 100%;
    border: none;
    border-top: 1px solid #ccc;
    margin: 20px 0 10px;
}
</style>
