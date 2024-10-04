<template>
    <div class="receipt-page">
        <h2 style="margin-top:80px; margin-bottom: 20px;">결제 영수증 조회</h2>

        <div class="receipt-container">
            <div class="logo">
                <img src="/inongLogo.png" alt="로고" />
            </div>

            <div class="receipt-details">
                <div class="detail">
                    <span>구매 패키지</span>
                    <span>{{ receipt.productName }}</span>
                </div>

                <div class="detail">
                    <span>판매 농장</span>
                    <span>{{ receipt.farmName }}</span>
                </div>

                <div class="detail">
                    <span>패키지 금액</span>
                    <span>{{ receipt.beforePrice }}원</span>
                </div>

                <div class="detail">
                    <span>할인 금액</span>
                    <span>{{ receipt.discountPrice }}원</span>
                </div>

                <div class="detail">
                    <span>결제 금액</span>
                    <span>{{ receipt.totalPrice }}원</span>
                </div>

                <div class="detail">
                    <span>결제일</span>
                    <span>{{ formatDate(receipt.paidAt) }}</span>
                </div>
            </div>

            <!-- PDF 다운로드 버튼 -->
            <div class="pdf-download">
                <button @click="downloadPDF">PDF 내려받기</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
    data() {
        return {
            receipt: {}, // 영수증 데이터를 저장할 객체
        };
    },
    mounted() {
        this.getReceiptInfo();
    },
    methods: {
        async getReceiptInfo() {
            const receiptId = this.$route.params.receiptId; // 라우트에서 영수증 ID 가져옴
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/order-service/receipt`, {
                    params: { id: receiptId },
                });
                this.receipt = response.data;
                console.log(this.receipt)
            } catch (error) {
                console.error("영수증 정보를 가져오는 중 오류가 발생했습니다.", error);
            }
        },
        formatDate(paidAt) {
            if (!paidAt) {
                return '정보 없음';
            }

            const datePart = paidAt.split('T')[0]; // 날짜 부분
            const timePart = paidAt.split('T')[1]; // 시간 부분
            return `${datePart} ${timePart}`; // 공백으로 결합
        },
        async downloadPDF() {
            const element = document.querySelector('.receipt-container');
            const downloadButton = document.querySelector('.pdf-download'); // 버튼 요소 선택

            // pdf 다운로드 버튼 숨기기
            downloadButton.style.display = 'none';

            // 화면 캡처
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF();
            const imgWidth = 190;
            const pageHeight = doc.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // PDF 다운로드
            doc.save(`동상이농_결제 영수증_${this.receipt.paidAt}.pdf`);

            // 버튼 다시 표시
            downloadButton.style.display = 'block';
        },
    },
};
</script>

<style scoped>
.receipt-page {
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
    text-align: center;
}

.receipt-container {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
}

.logo img {
    width: 150px;
    margin-bottom: 20px;
}

.receipt-details {
    margin-bottom: 20px;
}

.detail {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}

.pdf-download button {
    background-color: #BCC07B;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.pdf-download button:hover {
    background-color: #98a159;
}
</style>