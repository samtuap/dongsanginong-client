<template>
    <v-navigation-drawer app permanent>
        <v-list dense>
            <v-list-item-group>
                <v-list-item>
                    <v-list-item-title>동상이몽 사장님 서비스</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-for="(item, index) in menuItems" :key="index">
                    <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>


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
                        <v-col cols="4">
                            <v-checkbox label="첫 구독만 표시" />
                        </v-col>
                        <v-col cols="3">
                            <v-text-field label="시작일" value="2024.09.01" />
                        </v-col>
                        <v-col cols="1" class="text-center">
                            ~
                        </v-col>
                        <v-col cols="3">
                            <v-text-field label="종료일" value="2024.09.11" />
                        </v-col>
                        <v-col cols="1">
                            <v-btn color="primary">검색</v-btn>
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
Chart.register(...registerables)
export default {
    data() {
        return {
            startTime: "2024-09-03T08:33:46.821Z",
            endTime: "2024-09-30T08:33:46.821Z",
            salesList: [],
            salesData: "",
            testData: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: 'number of sales',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
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

        const headers = {
            "Authorization": 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mjc1OTkyNjQsImV4cCI6MTcyNzYzNTI2NCwic3ViIjoiMiIsInJvbGUiOiJTRUxMRVIifQ.d99XJuLOfLA9NS2Rr5U1Y8dnNylExAHtxzvU9DKV_pIo2045Q66yxTFtFKoHmmLzy615jlFeBaZeNCfpYKpZPQ'
        };

        try {
            const resData = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order-service/farm/backoffice/sales-data`, body, headers);
            const resList = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order-service/farm/backoffice/sales-list`, body, { params: { page: 0 }, headers });

            this.salesData = resData.data;
            this.salesList = resList.data.content;

            console.log(this.salesData);
            console.log(this.salesList);

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
                data: this.testData,
                options: this.options
            })
        },
        createBarChart() {
            new Chart(this.$refs.BarChart, {
                type: 'bar',
                data: this.testData,
                options: this.options
            })
        },
        createDataForChart() { // 차트를 그리기 위한 데이터를 만들자..
            

        }
    }
};
</script>

<style>
.chart-container {
    border: 1px solid #ccc;
    padding: 16px;
    text-align: center;
}
</style>