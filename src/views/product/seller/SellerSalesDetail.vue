<template>
    <!-- 사이드바 자리 -->
     <SellerSidebar />

    <v-container fluid>
        <!-- 상단 그래프 영역 -->
        <v-row>
            <v-col cols="12" sm="6">
                <div class="chart-container">
                    <p>일별 매출 추이</p>
                    <!-- 그래프1 -->
                    <canvas ref="LineChart" />
                </div>
            </v-col>
            <v-col cols="12" sm="6">
                <div class="chart-container">
                    <p>월별 매출 추이</p>
                    <canvas ref="BarChart" />
                </div>
            </v-col>
        </v-row>


        <!-- 매출 내역 확인 영역 -->
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        매출 내역 확인
                    </v-card-title>
                    <v-card-subtitle>
                        건수: 15, 총 매출액: 60,000
                    </v-card-subtitle>

                    <!-- 첫 구독만 표시와 날짜 선택 -->
                    <v-row align="center">
                        <v-col cols="6">
                            <v-checkbox label="첫 구독만 표시" />
                        </v-col>
                        <v-col cols="2">
                            <v-text-field
                            dense
                            label="시작일"/>
                        </v-col>
                        <v-col cols="1" class="text-center">
                            ~
                        </v-col>
                        <v-col cols="2">
                            <v-text-field label="종료일" value="2024.09.11" />
                        </v-col>
                        <v-col cols="1">
                            <v-btn style="border-radius: 50px;" color="deep_green">검색</v-btn>
                        </v-col>
                    </v-row>

                    <!-- 매출 내역 테이블 -->
                    <v-data-table :search="search" :items-per-page="20">
                        <thead>
                            <tr>
                                <th>결제 아이디</th>
                                <th>결제일</th>
                                <th>패키지 명</th>
                                <th>구매자 이름</th>
                                <th>누적 결제 횟수</th>
                                <th>금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="salesDetail in this.salesList" :key="salesDetail.orderId">
                                <td>{{ salesDetail.orderId }}</td>
                                <td>{{ salesDetail.paidAt }}</td>
                                <td>{{ salesDetail.packageName }}</td>
                                <td>{{ salesDetail.customerName }}</td>
                                <td>-</td>
                                <td>{{ salesDetail.paidAmount }}</td>
                            </tr>
                        </tbody>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js'
import SellerSidebar from '@/components/sidebar/SellerSidebar.vue';
Chart.register(...registerables)
export default {
    components: {
        SellerSidebar
    },
    data() {
        return {
            startTime: "2024-08-25T08:33:46.821Z",
            endTime: "2024-09-30T08:33:46.821Z",
            salesList: [],
            salesData: "",
            monthData: {
                labels: [],
                datasets: [{
                    label: 'number of sales',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        // 'rgba(54, 162, 235, 0.2)',
                        // 'rgba(255, 206, 86, 0.2)',
                        // 'rgba(75, 192, 192, 0.2)',
                        // 'rgba(153, 102, 255, 0.2)',
                        // 'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        // 'rgba(54, 162, 235, 1)',
                        // 'rgba(255, 206, 86, 1)',
                        // 'rgba(75, 192, 192, 1)',
                        // 'rgba(153, 102, 255, 1)',
                        // 'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            dayData: {
                labels: [],
                datasets: [{
                    label: 'number of sales',
                    data: [],
                    backgroundColor: [
                        // 'rgba(255, 99, 132, 0.2)',
                        // 'rgba(54, 162, 235, 0.2)',
                        // 'rgba(255, 206, 86, 0.2)',
                        // 'rgba(75, 192, 192, 0.2)',
                        // 'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        // 'rgba(255, 99, 132, 1)',
                        // 'rgba(54, 162, 235, 1)',
                        // 'rgba(255, 206, 86, 1)',
                        // 'rgba(75, 192, 192, 1)',
                        // 'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
        }
    },
    async created() {
        // 매출 정보 가져오기

        // 매출 내역 가져오기

        const body = {
            "startTime": this.startTime,
            "endTime": this.endTime,
            "onlyFirstSubscription": false
        };

        try {
            const resData = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order-service/farm/backoffice/sales-data`, body);
            const resList = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order-service/farm/backoffice/sales-list`, body, { params: { page: 0 }});

            this.salesData = resData.data;
            this.salesList = resList.data.content;

            // 월별 데이터 생성
            this.createDataForBarChart();
            this.createDataForLineChart();
            
            // 차트 그리기
            this.createLineChart();
            this.createBarChart();

        } catch (e) {
            console.log(e);
        }
    },
    methods: {
        createLineChart() {
            new Chart(this.$refs.LineChart, {
                type: 'line',
                data: this.dayData,
                options: this.options
            });
        },
        createBarChart() {
            new Chart(this.$refs.BarChart, {
                type: 'bar',
                data: this.monthData,
                options: this.options
            });
        },
        createDataForBarChart() { // 차트를 그리기 위한 데이터를 만들기
            // 1. 월 label 생성
            this.monthData.labels = this.getMonthsBetween(this.startTime, this.endTime);

            // 인덱스 맵 만들기
            const labelMap = this.createLabelIndexMap(this.monthData.labels);

            // 2. 숫자 넣기
            this.monthData.datasets[0].data = new Array(this.monthData.labels.length).fill(Number(0));

            this.salesList.forEach(element => {
                const yearMonth = this.extractYearAndMonth(element.paidAt);
                const idx = labelMap.get(yearMonth);
                this.monthData.datasets[0].data[idx] += 1;
            });
        },
        createDataForLineChart() { // 차트를 그리기 위한 데이터를 만들기
            // 1. 월 label 생성
            this.dayData.labels = this.getDaysBetween(this.startTime, this.endTime);

            console.log(this.dayData.labels);

            // 인덱스 맵 만들기
            const labelMap = this.createLabelIndexMap(this.dayData.labels);

            // 2. 숫자 넣기
            this.dayData.datasets[0].data = new Array(this.dayData.labels.length).fill(Number(0));

            this.salesList.forEach(element => {
                const yearMonthDay = this.extractYearAndMonthAndDay(element.paidAt);
                const idx = labelMap.get(yearMonthDay);
                this.dayData.datasets[0].data[idx] += 1;
            });
        },
        extractYearAndMonth(dateString) { // 년, 월을 추출
            const date = new Date(dateString);
            const year = date.getFullYear();      // 연도 추출
            const month = date.getMonth() + 1;    // 월 추출 (0부터 시작하므로 1을 더해줌)
            
            return year + "." + month;
        },
        extractYearAndMonthAndDay(dateString) { // 년.월.일을 추출
            const date = new Date(dateString);
            const year = date.getFullYear();      
            const month = date.getMonth() + 1;
            const day = date.getDate();
            
            return year + "." + month + "." + day;
        },
        getMonthsBetween(startTime, endTime) {
            const startDate = new Date(startTime);
            const endDate = new Date(endTime);
            const monthsArray = [];
            
            // startDate가 endDate보다 이전일 때까지 반복
            while (startDate <= endDate) {
                // 년, 월 데이터를 배열에 추가
                monthsArray.push(this.extractYearAndMonth(startDate.toISOString()));

                // 다음 달로 이동
                startDate.setMonth(startDate.getMonth() + 1);
            }
            
            return monthsArray;
        },
        getDaysBetween(startTime, endTime) {
            const startDate = new Date(startTime);
            const endDate = new Date(endTime);
            const monthsArray = [];
            
            // startDate가 endDate보다 이전일 때까지 반복
            while (startDate <= endDate) {
                // 년, 월 데이터를 배열에 추가
                monthsArray.push(this.extractYearAndMonthAndDay(startDate.toISOString()));

                // 다음 날로 이동
                console.log(startDate.getDate());
                startDate.setDate(startDate.getDate() + 1);
            }
            
            return monthsArray;
        },
        createLabelIndexMap(labels) {
            const map = new Map();
            
            // 배열을 순회하며 각 값을 키로, 인덱스를 값으로 저장
            labels.forEach((label, index) => {
                map.set(label, index);
            });
            return map;
        }
    }
};
</script>

<style>
.chart-container {
    border: 1px solid #ccc;
    padding: 16px;
    text-align: center;
    width: 100%; /* 부모 컨테이너 너비 */
    height: 280px;
    overflow-x: scroll; /* 가로 스크롤 활성화 */
    overflow-y: hidden; /* 세로 스크롤 비활성화 */
}

.chart-container canvas {
    width: 1000px; /* 캔버스 너비 (컨테이너 너비를 초과하도록 설정) */
    height: 280px;
}
</style>