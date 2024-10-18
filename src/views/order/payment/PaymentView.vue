<template>
    <div style="background-color: #F3F3F3;">

        <v-container style="padding-left: 120px; padding-right: 120px; padding-top: 50px; padding-bottom: 50px;">
            <p style="font-size: 28px; margin-bottom: 40px; text-align: center;">결제하기</p>
            <v-row>
                <v-col cols="12" md="7">
                    <v-card class="pa-4 rectangle-card" style="margin-bottom: 20px;">
                        <!-- Order Product Information -->
                        <div style="width: 95%; margin :auto; margin-top: 10px;">
                            <h3>주문 상품 정보</h3>
                            <v-row style="justify-content: center; margin-top: 10px;">
                                <div style="border: 1px #D4D4D4 solid; width: 100%; display: flex;">
                                    <v-col cols="4">
                                        <v-img :src="this.packageProductImageUrl" alt="product"
                                            style="width: 100px;"></v-img>
                                    </v-col>
                                    <v-col cols="8">

                                        <p>{{ packageProduct.packageName }}</p>
                                        <p
                                            style="color: #8C8C8C; font-size: 13px; margin-top: 3px; margin-bottom: 10px;">
                                            {{ packageProduct.productDescription }}</p>
                                        <p>{{ getAmountWithFormat(packageProduct.price) }}</p>

                                    </v-col>
                                </div>
                                <div class="delivery-cost-div">
                                    <p>배송비 : 무료</p>
                                </div>
                            </v-row>

                            <!-- Subscription Settings -->
                            <div style="color: #5D5D5D; margin-top: 30px; font-size: 13px;">
                                * 결제 후 마이페이지 > 정기구독 관리에서 구독 취소 가능합니다. <br>구독 취소 시 오는 달부터 결제 되지 않으며 환불은 불가합니다.
                            </div>
                        </div>
                        <br>
                    </v-card>
                    <v-card class="pa-4 rectangle-card" style="margin-top: 20px;">
                        <div class="inner-div">
                            <h3>쿠폰 적용</h3>
                            <div v-if="selectedCouponName == undefined">
                                적용된 쿠폰이 없습니다.
                            </div>

                            <div v-else>
                                <p><span style="font-weight: 700; font-size: 25px;">{{ couponDiscountRate * 100 }}%
                                    </span> {{ selectedCouponName }}</p>
                            </div>
                            <div style="width: 100%; display: flex; justify-content: right;">
                                <v-btn class="mt-2" @click="this.couponModal = true"
                                    style="border-radius: 50px;">쿠폰 선택</v-btn>
                            </div>
                        </div>
                    </v-card>

                    <v-card class="pa-4 rectangle-card" style="margin-top: 20px;">
                        <div class="inner-div">
                            <h3>주문자 정보</h3>
                            <p>{{ memberName }} / {{ memberPhone }}</p>
                        </div>
                    </v-card>


                    <v-card class="pa-4 rectangle-card" style="margin-top: 20px;">
                        <div class="inner-div">
                            <h3>배송지 정보</h3>
                            <div v-if="memberAddress === undefined">
                                <p>배송지 정보를 입력해주세요.</p>
                            </div>
                            <div v-else>
                                <p>{{ memberAddress }}</p>
                                <p>{{ memberAddressDetail }}</p>
                            </div>
                            <div style="width: 100%; display: flex; justify-content: right;">
                                <v-btn class="mt-2" style="border-radius: 50px;">배송지 변경</v-btn>
                            </div>
                        </div>
                    </v-card>
                </v-col>

                <!-- Order Summary and Payment Methods -->
                <v-col cols="12" md="5">
                    <v-card class="pa-4 rectangle-card" style="margin-bottom: 20px;">
                        <div class="inner-div">
                            <!-- Order Summary -->
                            <h3>주문 요약</h3>
                            <span style="display: inline-block; width: 45%;" class="payment-info-title">상품
                                가격</span><span style="display: inline-block; width: 53%; text-align: right;"> {{
                                    getAmountWithFormat(packageProduct.price)
                                }}원</span>
                            <!-- TODO: discountedPrice => 추후 수정 필요 -->
                            <span style="display: inline-block; width: 45%;" class="payment-info-title">할인
                                금액</span><span style="display: inline-block; width: 53%; text-align: right;"> {{
                                    getAmountWithFormat(discountedPrice)
                                }}원</span>
                            <span style="display: inline-block; width: 45%;" class="payment-info-title">쿠폰 할인 금액</span>
                            <span style="display: inline-block; width: 53%; text-align: right;">
                                {{ getAmountWithFormat(couponDiscountedAmount) }}원</span>
                            <span style="display: inline-block; width: 45%;" class="payment-info-title">배송비</span><span
                                style="display: inline-block; width: 53%; text-align: right;"> 무료 </span>

                            <div style="border-top: 1px #D4D4D4 solid; margin-top: 10px; padding-top: 10px;">
                                <span style="display: inline-block; width: 45%;">합계</span>
                                <span style="display: inline-block; width: 53%; text-align: right; font-weight: 700;">
                                    {{ getAmountWithFormat(totalAmount) }}원</span>
                            </div>

                        </div>
                    </v-card>
                    <v-card class="pa-4 rectangle-card">
                        <!-- Payment Method -->
                        <div class="inner-div">
                            <h3>결제 수단</h3>
                            <div v-if="paymentMethod === undefined">
                                <p style="color: #234200;">결제 수단을 등록해주세요.</p>
                                <v-btn color="deep_green" class="mt-2" @click="this.addPaymentMethod">결제수단 등록하기</v-btn>
                            </div>
                            <div v-else style="display: flex;">
                                <img style="width: 50px;" :src="logoImage" />
                                <span>{{ paymentMethodValue }}</span>
                            </div>
                            <p style="font-size: 13px; margin-top: 10px; color: #5D5D5D;">등록하신 결제 수단으로 모든 정기 구독 상품이 자동
                                결제됩니다.</p>


                            <v-checkbox label="전체 동의" v-model="termsAllAccepted"
                                style="margin-bottom: -25px;"></v-checkbox>
                            <v-checkbox label="구매조건 확인 및 결제진행에 동의" v-model="termsAccepted1"
                                class="subcheckbox"></v-checkbox>
                            <v-checkbox label="전자금융거래 이용약관 동의" v-model="termsAccepted2"
                                class="subcheckbox"></v-checkbox>
                            <v-checkbox label="개인정보 수집 및 이용 동의" v-model="termsAccepted3"
                                class="subcheckbox"></v-checkbox>
                            <v-checkbox label="개인정보 제 3자 제공 동의" v-model="termsAccepted4"
                                class="subcheckbox"></v-checkbox>
                            <v-checkbox label="정기과금 이용 동의" v-model="termsAccepted5" class="subcheckbox"></v-checkbox>
                        </div>

                    </v-card>
                    <v-btn @click="openConfirmPayModal"
                        style="background-color: #BCC07B; width: 100%; height: 50px; text-align: center; display: flex; align-items: center; justify-content: center;">
                        <p>결제하기</p>
                    </v-btn>
                </v-col>

            </v-row>
        </v-container>
    </div>

    <v-dialog v-model="this.successModal" max-width="300px">
        <v-card class="modal"
            style="align-items: center; text-align: center; height: 160px; padding-bottom: 20px; overflow-y: hidden;">
            <v-card-text>
                정기 결제 수단이<br>
                성공적으로 등록되었습니다!
            </v-card-text>
            <v-row>
                <v-btn @click="this.successModal = false" class="submit-btn"
                    style="background-color: #e0e0e0;">확인</v-btn>
            </v-row>

        </v-card>
    </v-dialog>

    <v-dialog v-model="this.failModal" max-width="300px">
        <v-card class="modal"
            style="align-items: center; text-align: center; height: 160px; padding-bottom: 20px; overflow-y: hidden;">
            <v-card-text>
                정기 결제 수단 등록에 실패했습니다. <br>
                다시 시도해주세요.
            </v-card-text>
            <v-row>
                <v-btn @click="this.failModal = false" class="submit-btn" style="background-color: #e0e0e0;">확인</v-btn>
            </v-row>

        </v-card>
    </v-dialog>

    <v-dialog v-model="this.couponModal" max-width="300px">
        <v-card class="coupon-select-modal" style="align-items: center; padding-bottom: 10px; display: flex;">
            <div style="width: 100%; text-align: center; padding: 20px;">
                <v-radio-group v-model="this.selectedCoupon" class="mt-4 mb-4">
                    <v-card-title style="margin: auto;">
                        사용 가능한 쿠폰
                    </v-card-title>
                    <div style="max-height: 500px; overflow-y: scroll">
                    <!-- <v-card class="available-coupon-card"> -->
                    <div v-if="availableCoupons.length > 0">
                        <v-radio :value="-1" label="선택 안함"></v-radio>
                    </div>
                    <div v-else>
                        <p style="margin-top: 5px;">적용 가능한 쿠폰이 없어요. </p>
                    </div>
                        
                    <!-- </v-card> -->
                    
                    
                    <v-card class="available-coupon-card"
                    v-for="(coupon, index) in availableCoupons"
                    :key="index"
                    variant="outlined"
                    style="text-align: left; border: #EAEAEA 1px solid;"
                    >
                        <div>
                            <v-radio :value="index"></v-radio>
                        </div>
                        <div>
                            <p class="coupon-discount-rate">{{ coupon.discountRate }}%</p>
                            <p class="coupon-name">{{ coupon.couponName }}</p>
                            <p class="coupon-expiration">{{ getExpiration(coupon.expiration) }}까지 사용 가능</p>
                        </div>

                    </v-card>
                </div>
                </v-radio-group>
                <div style="width: 100%; display: flex; justify-content: right; margin-top:-10px; margin-bottom: 10px; padding-right: 30px;" >
                    <v-btn @click="changeCoupon" color="deep_green" class="submit-btn" style="background-color: #e0e0e0;">적용</v-btn>
                    <v-btn @click="this.couponModal = false;" class="submit-btn"
                    style="background-color: #e0e0e0; justify-self: right;">닫기</v-btn>
                </div>
            </div>
        </v-card>
    </v-dialog>

    <v-dialog v-model="this.loadingModal" max-width="300px">
        <v-card class="coupon-select-modal" style="align-items: center; padding-bottom: 20px; display: flex;">
            <v-card-title>결제가 진행 중입니다.</v-card-title>
        </v-card>
    </v-dialog>


    <v-dialog v-model="this.confirmPayModal" max-width="300px">
        <v-card class="coupon-select-modal" style="align-items: center; padding-bottom: 20px; display: flex;">
            <div>
                <v-radio-group v-model="this.selectedCoupon" class="mt-4 mb-4">
                    <v-card-title style="margin: auto;">
                        정말 결제하시겠습니까?
                    </v-card-title>
                    <v-card-text style="padding: 40px; margin: auto;">
                        아래 "결제" 버튼을 누르면 자동으로 결제되며,<br>정기 구독 상품의 특성 상 환불이 불가합니다.
                    </v-card-text>

                    <v-row style="margin: auto;">
                        <v-btn @click="this.confirmPayModal = false" class="submit-btn"
                            style="background-color: #e0e0e0;">닫기</v-btn>
                        <v-btn @click="doPay" class="submit-btn" color="deep_green">결제</v-btn>
                    </v-row>
                </v-radio-group>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
import * as PortOne from "@portone/browser-sdk/v2";

export default {
    watch: {
        termsAllAccepted: function (termsAllAccepted) {
            if (termsAllAccepted === true) {
                this.termsAccepted1 = termsAllAccepted;
                this.termsAccepted2 = termsAllAccepted;
                this.termsAccepted3 = termsAllAccepted;
                this.termsAccepted4 = termsAllAccepted;
                this.termsAccepted5 = termsAllAccepted;
            }
        },
        termsAccepted1: function () {
            if (this.termsAccepted1 === true
                && this.termsAccepted2 === true
                && this.termsAccepted3 === true
                && this.termsAccepted4 === true
                && this.termsAccepted5 === true
            ) {
                this.termsAllAccepted = true;
            } else {
                this.termsAllAccepted = false;
            }
        },
        termsAccepted2: function () {
            if (this.termsAccepted1 === true
                && this.termsAccepted2 === true
                && this.termsAccepted3 === true
                && this.termsAccepted4 === true
                && this.termsAccepted5 === true
            ) {
                this.termsAllAccepted = true;
            } else {
                this.termsAllAccepted = false;
            }
        }
    },
    data() {
        return {
            subscriptionFrequency: '1주',
            termsAllAccepted: false,
            termsAccepted1: false,
            termsAccepted2: false,
            termsAccepted3: false,
            termsAccepted4: false,
            termsAccepted5: false,
            couponNumber: '',
            pointsUsed: '',
            packageProduct: "",
            packageProductImageUrl: "",
            failModal: false,
            successModal: false,
            billingKey: "",
            paymentMethod: undefined,
            paymentMethodValue: undefined,
            coupon: undefined,
            couponModal: false,
            availableCoupons: [],
            member: undefined,
            memberAddress: undefined,
            memberAddressDetail: undefined,
            memberName: "",
            selectedCoupon: undefined,
            selectedCouponName: undefined,
            couponDiscountRate: Number(0),
            couponDiscountedAmount: 0,
            discountedPrice: 0,
            totalAmount: 0,
            loadingModal: false,
            memberPhone: "",
            logoImage: "",
            confirmPayModal: false,
        }
    },
    async created() {
        try {
            const packageId = this.$route.params.packageId;
            const packageRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/detail/${packageId}`);
            this.packageProduct = packageRes.data;

            const packageImageRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/info/${packageId}`);
            this.packageProductImageUrl = packageImageRes.data.imageUrls[0];

            const paymentMethodRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/subscription/payment/method`);
            this.paymentMethod = paymentMethodRes.data.paymentMethodType;
            this.paymentMethodValue = paymentMethodRes.data.paymentMethodValue;
            this.billingKey = paymentMethodRes.data.billingKey;
            this.logoImage = paymentMethodRes.data.logoImageUrl;
            console.log(this.logoImage);


            // 멤버 정보 불러오기 (배송지를 위함)
            const memberRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/member-info`);
            this.member = memberRes.data;
            this.memberAddress = this.member.address;
            this.memberAddressDetail = this.member.addressDetail;
            this.memberName = this.member.name;
            this.memberPhone = this.member.phone;

            // 적용 가능한 쿠폰 불러오기
            const farmId = this.packageProduct.farmId;
            const couponRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/order-service/coupon/farm/${farmId}`);
            this.availableCoupons = couponRes.data.availableCouponList;
            this.couponDiscountRate = Number(couponRes.discountRate) / 100;
            this.couponDiscountedAmount = this.couponDiscountRate * this.packageProduct.price;

            this.couponDiscountedAmount = 0;

            // totalAmount 계산
            this.totalAmount = this.packageProduct.price;
        } catch (e) {
            console.log(e);
        }

    },
    methods: {
        testMethod(idx) {
            console.log(this.selectedCoupon);
            this.selectedCoupon = idx;
            this.selectedCouponName = this.availableCoupons[idx].couponName;
        },
        async addPaymentMethod() {

            // issueId 생성
            const memberId = localStorage.getItem("memberId");
            const issueId = memberId + "_" + crypto.randomUUID();

            try {
                const res = await PortOne.requestIssueBillingKey({
                    storeId: `${process.env.VUE_APP_PORTONE_STORE_ID}`, // 고객사 storeId로 변경해주세요.
                    channelKey: `${process.env.VUE_APP_PORTONE_CHANNEL_KEY}`, // 콘솔 결제 연동 화면에서 채널 연동 시 생성된 채널 키를 입력해주세요.
                    billingKeyMethod: "EASY_PAY",
                    issueId: issueId,
                    issueName: `동상이농 정기 결제 수단 등록`,
                    orderName: `동상이농 정기 결제 수단 등록`,
                    paymentId: "test_payment_001",
                    totalAmount: 0,
                    curreny: "KRW",
                    paymentMethod: "EASY_PAY",
                    redirectUrl: `${process.env.VUE_APP_MY_URL}/payment-done`,
                    offerPeriod: {
                        interval: "1m"
                    },
                    customer: {
                        fullName: "김세정",
                        phoneNumber: "010-3104-4841",
                        email: "clearrworld@gmail.com",
                    },
                });


                this.billingKey = res.billingKey;
                this.successModal = true;
                this.paymentMethod = 'KAKAOPAY'; // TODO: 추후 확장 가능성

                const body = {
                    'billingKey': this.billingKey,
                    'paymentMethodType': this.paymentMethod
                }

                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/subscription/payment/method`, body);
            } catch (e) {
                this.failModal = true;
                console.log(e);
            }
        },
        getExpiration(expiration) {
            const exp = new Date(expiration);
            return exp.getFullYear() + "년 " + (exp.getMonth() + 1) + "월 " + (exp.getDate()) + "일";
        },
        changeCoupon() {
            if (this.selectedCoupon === undefined || this.selectedCoupon == -1) {
                this.selectedCoupon = undefined;
                this.selectedCouponName = undefined
                this.coupon = undefined
                this.couponDiscountRate = 0;
                this.couponDiscountedAmount = 0;
                this.couponModal = false;
                return;
            }

            this.selectedCoupon = Number(this.selectedCoupon);
            this.selectedCouponName = this.availableCoupons[this.selectedCoupon].couponName;
            this.coupon = this.availableCoupons[this.selectedCoupon];
            this.couponModal = false;

            // 할인가 계산
            this.couponDiscountRate = this.availableCoupons[this.selectedCoupon].discountRate / 100.0;
            this.couponDiscountedAmount = this.packageProduct.price * this.couponDiscountRate;

            this.totalAmount = this.packageProduct.price - this.couponDiscountedAmount;
            console.log(this.selectedCouponName);
        },
        async doPay() {
            this.confirmPayModal = false;


            try {
                // 결제 요청
                // 포트원 빌링키 결제 API 호출
                let body = undefined;
                if (this.coupon === undefined) {
                    body = {
                        "packageId": this.packageProduct.id,
                    }
                } else {
                    body = {
                        "packageId": this.packageProduct.id,
                        "couponId": this.coupon.couponId,
                    }
                }
                const paymentResponse = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order-service/order`, body);
                const orderId = paymentResponse.data.orderId;
                window.location.href = `${process.env.VUE_APP_MY_URL}/order/${orderId}`;
            } catch (e) {
                console.log(e);
                alert(e.response?.data?.message);
            }


        },
        getAmountWithFormat(amount) {
            let ret = "";
            let i = 0;
            amount = String(amount);
            for (i = 0; i < amount.length; i++) {
                ret = String(amount[amount.length - i - 1]) + ret;
                if (i % 3 == 2 && i != amount.length - 1) {
                    ret = ',' + ret
                }
            }
            return ret;
        },
        openConfirmPayModal() {

            if (this.termsAccepted1 != true
                || this.termsAccepted2 != true
                || this.termsAccepted3 != true
                || this.termsAccepted4 != true
                || this.termsAccepted5 != true) {
                alert("모든 동의 항목에 체크해주세요.");
                return;
            }

            this.confirmPayModal = true;
        }
    },

}
</script>

<style scoped>
body {
    background-color: #D4D4D4;
}

h3 {
    font-weight: bold;
    margin-bottom: 16px;
}

.rectangle-card {
    border-radius: 0px;
    box-shadow: none;
    padding-bottom: 40px;
}

.delivery-cost-div {
    border: 1px #D4D4D4 solid;
    width: 100%;
    border-top: 0px white solid;
    text-align: center;
    background-color: #F8F8F8;
    padding: 10px;
}

.coupon-name {
    font-weight: 500;
}

.coupon-discount-rate {
    font-size: 20px;
    font-weight: 500;
}

.coupon-expiration {
    font-size: small;
    color: #8C8C8C;
}

.available-coupon-card {
    width: 400px;
    padding: 20px;
    margin: 20px;
    display: flex;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12), 0 4px 4px rgba(0, 0, 0, 0.24);
}

.coupon-select-modal {
    width: 500px;
    height: auto;
}

.payment-info-title {
    font-size: 14px;
    color: #3c3c3c;
    margin-top: 10px;
}

.subcheckbox {
    margin-top: -20px;
    margin-bottom: -20px;
    font-size: 12px;
    margin-left: 30px;
}

.inner-div {
    width: 95%;
    margin: auto;
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>