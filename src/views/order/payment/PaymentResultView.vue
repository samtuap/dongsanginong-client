<template>
    <div style="background-color: #F3F3F3; margin: auto;">
        
    <v-container>
        <!-- 주문 완료 메시지 -->
         <v-container class="payment-box" style="margin: auto; width: 800px; margin-bottom: 30px; margin-top: 20px;">
            <v-row cols="12">
                <svg-icon style="margin: auto; color: #BCC07B;" size="100px" type="mdi" :path="mdiCartCheck"></svg-icon>
            </v-row>
            <v-row>
                <v-col cols="12" class="text-center">
                    <h2>주문 완료</h2>
                    <p>주문이 완료되었습니다.</p>
                    <p>주문 번호: 202410140030405</p>
                    <p>주문 일자: {{this.paidAt}}</p>
                </v-col>
            </v-row>
         </v-container>



         <v-container style="background-color: white; width: 800px;">
        <!-- 상품 정보 -->
        <v-container class="info-container" style="justify-content: center; margin-top: 0px;">
            <v-row class="mt-4 info-title">
                <p>주문 상품</p>
            </v-row>
            <div style="border: 1px #D4D4D4 solid; width: 100%; display: flex;">
                <v-col cols="3">
                    <v-img :src="this.packageProductImageUrl" alt="product"
                        style="width: 150px;"></v-img>
                </v-col>
                <v-col cols="9">

                    <p>{{ packageProduct.packageName }}</p>
                    <p
                        style="color: #8C8C8C; font-size: 13px; margin-top: 3px; margin-bottom: 10px;">
                        {{ packageProduct.productDescription }}</p>
                </v-col>
            </div>
        </v-container>

        <!-- 배송 정보 -->
        <v-container class="info-container">
            <v-row class="mt-4 info-title">
                <p>배송정보</p>
            </v-row>
            <v-row cols="12">
                <p>주문자: <span>{{ memberName }}</span> / <span>{{ memberPhone }}</span></p>
            </v-row>
            <v-row>
                <p>배송지: {{ memberAddress }} {{ memberAddressDetail }}</p>
            </v-row>
        </v-container>


        <!-- 결제 금액 -->
        <v-container class="info-container">
            <v-row class="mt-4 info-title">
                <p>결제 정보</p>
            </v-row>
            <v-row cols="12">
                <p>결제 금액: <strong class="red--text">{{ getAmountWithFormat(totalAmount) }}</strong>원</p>
            </v-row>
            <v-row cols="12">
                <p>결제 수단: {{ paymentMethod }}</p>
            </v-row>
        </v-container>

        <!-- 버튼 -->
        <v-container class="info-container">
            <v-row class="mt-4">
                <v-col cols="4"></v-col>
                <v-col cols="2">
                    <v-btn block color="deep_green" style="border-radius: 50px" @click="this.$router.push(`/receipt/${orderId}`)">주문 상세보기</v-btn>
                </v-col>
                <v-col cols="2">
                    <v-btn block color="#D4D4D4" style="border-radius: 50px" @click="this.$router.push('/product')">계속 쇼핑하기</v-btn>
                </v-col>
                <v-col cols="4"></v-col>
            </v-row>
        </v-container>

    </v-container>
</v-container>
</div>
</template>

<script>
import axios from 'axios';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCartCheck  } from '@mdi/js';


export default {
    name: "OrderCompletePage",
    components: {
        SvgIcon
    },
    data() {
        return {
            mdiCartCheck: mdiCartCheck ,
            member: undefined,
            memberName: undefined,
            memberAddress: undefined,
            memberPhone: undefined,
            memberAddressDetail: undefined,
            memberEmail: undefined,
            totalAmount: undefined,
            paymentMethod: undefined,
            packageProduct: "",
            packageProductImageUrl: "",
            paidAt: "",
        }
    },
    async created() {
        try {
            
            // 멤버 정보 불러오기 (배송지를 위함)
            const memberRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/member-info`);
            this.member = memberRes.data;
            this.memberAddress = this.member.address;
            this.memberAddressDetail = this.member.addressDetail;
            this.memberName = this.member.name;
            this.memberPhone = this.member.phone;
            this.memberEmail = this.member.email;

            this.orderId = this.$route.params.orderId;
            const params = {
                "id": this.orderId,
            }
            const receiptRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/order-service/receipt`, { params });

            this.totalAmount = receiptRes.data.totalPrice;
            this.paymentMethod = receiptRes.data.paymentMethod;
            this.paidAt = this.getDatetimeWithFormat(receiptRes.data.paidAt);
            console.log(this.paidAt);

            // 상품 정보 불러오기
            const productId = receiptRes.data.productId;
            const packageRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/detail/${productId}`);
            this.packageProduct = packageRes.data;
            const packageImageRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/info/${productId}`);
            this.packageProductImageUrl = packageImageRes.data.imageUrls[0];
        } catch(e) {
            console.log(e);
        }

    },
    methods: {
        getDatetimeWithFormat(paidAt) {
            const d = new Date(paidAt);

            const date = new Date(d).toISOString().split('T')[0];
            const time = d.toTimeString().split(' ')[0];
            console.log(date + ' ' + time);
            return date + " " + time;
        },
        getAmountWithFormat(amount) {
            let ret = "";
            let i = 0;
            amount = String(amount);
            for(i=0; i<amount.length; i++) {
                ret = String(amount[amount.length - i - 1]) + ret;
                if(i % 3 == 2 && i != amount.length-1) {
                    ret = ',' + ret
                }
            }
            return ret;
        }
    }
};
</script>

<style scoped>
h2,
h3 {
    font-weight: bold;
}

.info-title {
    font-size: large;
    font-weight: 700;
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px black solid;
    margin-bottom: 20px;
}

.info-container {
    margin: auto;
    margin-top: 30px;
    
}

.payment-box {
    margin-top: 50px;
    border: 1px #D4D4D4 solid;
    padding: 30px;
    margin-top: 30px;
    background-color: white;
}

</style>