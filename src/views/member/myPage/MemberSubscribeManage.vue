<template>
    <div class="member-page" style="padding-right: 300px;">
        <MemberSidebar />
        <h3 style="margin-right: 74%;">내 구독 정보 관리</h3>
        <br>

        <!-- 자동결제 카드 정보 -->
        <div class="card-section">

            <div style="font-weight: 700; font-size:17px;">정기 결제 수단
                <i class="mdi mdi-credit-card-outline"></i>
                <button @click="addPaymentMethod" style="margin-left: 5px;">
                    
                    <span style="font-size: 15px; font-weight: 200; margin-top: -10px;">결제수단 등록/변경</span>
                  </button>
            </div>

            <div v-if="billingKey === ''" style="margin-top: 23px;" class="">
                <p style="margin-bottom: 10px;">결제 수단이 없습니다. 등록해주세요.</p>
            </div>
            
            <div v-else>
                <div style="align-items: center; display: flex; margin-top: 23px;">
                    <img :src="paymentMethodImageUrl" style="width: 60px;" />
                    <p>{{ paymentMethodType }}</p>
                </div>
            </div>

            <div style="border-top: 1px #D4D4D4 solid; width: 100%; margin-top: 20px; padding-top: 20px">
                <p class="payment-description">* 등록한 결제 수단으로 28일마다 오후 1시에 자동 결제됩니다.</p>
                <p class="payment-description">* 결제 수단은 언제든 변경 가능하며, 해당 결제 수단으로 모든 정기 결제가 진행됩니다.</p>
            </div>
        </div>
        <br><br>
        <!-- 구독한 패키지 상품 -->
        <div class="subscribe-section">
            <v-card style="border-radius: 15px; padding: 10px; max-width: 1200px; width: 100%;" rounded="0" flat>
                <v-card-text style="font-weight: 700; font-size:17px;">구독한 패키지</v-card-text>
                <v-card-text style="color: gray; margin-top: -25px;">회원님이 구독한 패키지입니다.</v-card-text>
                <br>
                <div style="display: flex; justify-content: center; align-items:center;">
                    <v-btn class="slide-btn" icon="mdi-chevron-left" variant="plain" @click="prevProduct"
                        :disabled="productOnboarding === 1"></v-btn>
                    <v-window v-model="productOnboarding" style="width: 1080px;">
                        <v-window-item v-for="n in productWindowCount" :key="`product-window-${n}`" :value="n">
                            <v-row class="d-flex justify-center">
                                <v-col v-for="(packageProduct, index) in paginatedPackageProducts(n)" :key="index"
                                    cols="12" md="3" class="d-flex justify-center">
                                    <v-card variant="text" style="width:210px; height:300px;">
                                        <v-img class="packageProduct-image" width="210px" height="250px"
                                            :src="packageProduct.imageUrl" alt="packageProduct 썸네일" cover
                                            @click="this.$router.push(`/product/${packageProduct.packageId}`)" />
                                        <v-card-text style="padding: 0; margin-top: 10px;">
                                            <span v-if="packageProduct.packageName.length > 10"> {{
                                                packageProduct.packageName.substring(0, 10) }}...</span>
                                            <span v-else> {{ packageProduct.packageName }}</span>
                                            <div class="detail-container">
                                                <a class="toDetail" @click="createReview(packageProduct.packageId)">후기 작성</a>
                                                <a class="toDetail" @click="openCancelModal(packageProduct.id)">구독 취소</a>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-window-item>
                    </v-window>
                    <v-btn class="slide-btn" icon="mdi-chevron-right" variant="plain" @click="nextProduct"
                        :disabled="!canGoToNextProduct"></v-btn>
                </div>
            </v-card>
        </div>
        <ReviewCreate ref="reviewCreate" :packageProductId="selectedPackageProductId" />

    </div>
    <br>


    <v-dialog v-model="failModal" max-width="300px">
        <v-card class="modal" style="align-items: center; text-align: center; height: 160px; padding-bottom: 20px; 
        overflow-y: hidden;">
            <v-card-text style="margin-top: 10%;">⚠️ 결제 수단 등록에 실패했습니다.</v-card-text>
            <v-btn @click="closeWarningAndReload" class="submit-btn">닫기</v-btn>
        </v-card>
    </v-dialog>

    <!-- 구독취소 확인 모달 -->
    <v-dialog v-model="cancelSub" max-width="300">
        <v-card class="modal" style="padding: 10px; padding-bottom: 5px;">
            <v-card-title class="modal-title">정말 취소하시겠습니까?</v-card-title>
            <v-card-actions class="modal-actions">
                <v-spacer></v-spacer>
                <v-btn @click="withdrawSubscribe(selectedSubscriptionId)" class="delete-confirm-btn">확인</v-btn>
                <v-btn @click="cancelSub = false;" class="cancel-btn">닫기</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="alertModal" max-width="330px">
        <v-card class="modal" style="padding: 15px; text-align: center; height: 120px; overflow-y: hidden;">
            <v-card-text style="text-align: center;">구독 취소가 완료되었습니다.</v-card-text>
            <v-btn @click="closeModal" class="submit-btn" style="margin-top: -10px; margin-right: 10px;">확인</v-btn>
        </v-card>
    </v-dialog>


</template>

<script>
import axios from 'axios';
import MemberSidebar from '@/components/sidebar/MemberSidebar.vue';
import ReviewCreate from '@/views/product/review/ReviewCreate.vue';
import * as PortOne from "@portone/browser-sdk/v2";

export default {
    components: {
        MemberSidebar,
        ReviewCreate
    },
    data() {
        return {
            subscriptionPackageProductList: [], // 구독한 패키지 리스트
            farmOnboarding: 1,
            productOnboarding: 1,
            farmWindowCount: 3,
            productWindowCount: 3,
            isLoading: false,
            reviewModal: false,
            selectedPackageProductId: null,
            billingKey: "",
            paymentMethodType: "",
            paymentMethodImageUrl: "",
            failModal: false,
            alertModal: false,
            cancelSub: false,
            selectedSubscriptionId: null,
        }
    },
    computed: {
        canGoToNextProduct() {
            const packageProductsPerPage = 4;
            const totalPages = Math.ceil(this.subscriptionPackageProductList.length / packageProductsPerPage);
            return this.productOnboarding < totalPages;
        }
    },
    async created() {
        await this.fetchSubscriptionPackageProducts();

        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/subscription/payment/method`);
        this.billingKey = response.data.billingKey;
        this.paymentMethodType = response.data.paymentMethodValue;
        this.paymentMethodImageUrl = response.data.logoImageUrl;
    },
    methods: {
        async fetchSubscriptionPackageProducts() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/subscription/list`);
            this.subscriptionPackageProductList = response.data;
            console.log(this.subscriptionPackageProductList);
            // console.log(">>>>>>구독id: " + this.subscriptionPackageProductList[0].id + "  >>>>>>>상품id: " + this.subscriptionPackageProductList[0].packageId)
        },
        nextProduct() {
            if (this.canGoToNextProduct) {
                this.productOnboarding += 1;
            }
        },
        prevProduct() {
            if (this.productOnboarding > 1) {
                this.productOnboarding -= 1;
            }
        },
        paginatedPackageProducts(page) {
            const packageProductsPerPage = 4;
            const start = (page - 1) * packageProductsPerPage;
            const end = start + packageProductsPerPage;
            return this.subscriptionPackageProductList.slice(start, end);
        },
        createReview(packageProductId) {
            console.log("packageProductId:", packageProductId);
            this.selectedPackageProductId = packageProductId;
            this.$refs.reviewCreate.openDialog(packageProductId);
        },
        openCancelModal(subscriptionId) {
            this.selectedSubscriptionId = subscriptionId;
            this.cancelSub = true;
        },
        async withdrawSubscribe(subId) {
            try {
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/subscription/cancel?id=${subId}`);
                console.log(">>>>>response: ", response.data);
                this.alertModal = true;
            } catch(e) {
                console.log(e.message);
            }
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
                // 결제 수단 등록 프로세스 중단
                if(res.code === 'FAILURE_TYPE_PG') {
                    this.failModal = true;
                    return;
                }

                this.billingKey = res.billingKey;
                this.successModal = true;
                this.paymentMethod = 'KAKAOPAY'; // TODO: 추후 확장 가능성 있음

                const body = {
                    'billingKey': this.billingKey,
                    'paymentMethodType': 'KAKAOPAY'
                }

                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/subscription/payment/method`, body);

                window.location.reload();
            } catch (e) {
                this.failModal = true;
                console.log(e);
            }
        },
        closeWarningAndReload() {
            this.failModal = false;
            window.location.reload();
        },
         closeModal() {
            this.alertModal = false; 
            window.location.reload();
        }
        
    }
}
</script>

<style scoped>
.member-page {
    background-color: #F3F3F3;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    flex-direction: column;
}

.subscribe-section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 5px 10px;
    width: 905px;
    min-height: 450px;
    margin-left: 20%;
    background-color: white;
}

.card-section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px 30px;
    width: 905px;
    min-height: 150px;
    margin-left: 20%;
    background-color: white;
}

.toDetail {
    color: #ca7f5a;
    font-size: 12px;
    cursor: pointer;
    text-decoration: none;
}

.detail-container {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
}

.slide-btn {
    margin-bottom: 40px;
}

.packageProduct-image {
    cursor: pointer;
}

.payment-description {
    font-size: 12px;
    color: #5D5D5D;
}

.submit-btn {
    margin-left: 10px;
    margin-top: 8px;
    background-color: #BCC07B;
    color: black;
    border-radius: 50px;
}
.modal-title {
  font-size: 16px;
  text-align: center;
}
.delete-confirm-btn {
  background-color: #BCC07B;
  color: black;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 13px;
  max-width: 200px;
}
.cancel-btn {
  background-color: #e0e0e0;
  color: black;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 13px;
  max-width: 200px;
}
</style>