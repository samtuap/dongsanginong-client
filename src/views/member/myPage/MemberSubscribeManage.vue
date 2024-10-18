<template>
    <div class="member-page" style="padding-right: 300px;">
        <MemberSidebar />
        <h3 style="margin-right: 74%;">내 구독 정보 관리</h3><br>
        
        <!-- 자동결제 카드 정보 -->
        <div class="card-section">
            <div style="font-weight: 700; font-size:17px;">자동 결제 카드 정보</div>
        </div>
        <br><br>
        <!-- 구독한 패키지 상품 -->
        <div class="subscribe-section">
            <v-card style="border-radius: 15px; padding: 10px; max-width: 1200px; width: 100%;" rounded="0" flat>
                <v-card-text style="font-weight: 700; font-size:17px;">구독한 패키지</v-card-text>
                <v-card-text style="color: gray; margin-top: -25px;">회원님이 구독한 패키지입니다.</v-card-text>
                <br>
                <div style="display: flex; justify-content: center; align-items:center;">
                    <v-btn class="slide-btn" icon="mdi-chevron-left" variant="plain" @click="prevProduct" :disabled="productOnboarding === 1"></v-btn>
                    <v-window v-model="productOnboarding" style="width: 1080px;">
                        <v-window-item v-for="n in productWindowCount" :key="`product-window-${n}`" :value="n">
                            <v-row class="d-flex justify-center">
                                <v-col v-for="(packageProduct, index) in paginatedPackageProducts(n)" :key="index" cols="12" md="3" class="d-flex justify-center">
                                    <v-card variant="text" style="width:210px; height:300px;">
                                        <v-img class="packageProduct-image" width="210px" height="250px" :src="packageProduct.imageUrl" alt="packageProduct 썸네일" cover @click="this.$router.push(`/product/${packageProduct.packageId}`)" />
                                        <v-card-text style="padding: 0; margin-top: 10px;">
                                            <span v-if="packageProduct.packageName.length > 10"> {{ packageProduct.packageName.substring(0, 10) }}...</span>
                                            <span v-else> {{ packageProduct.packageName }}</span>
                                            <div class="detail-container">
                                                <a class="toDetail" @click="createReview(packageProduct.packageId)">후기 작성</a>
                                                <a class="toDetail" @click="withdrawSubscribe">구독 취소</a>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-window-item>
                    </v-window>
                    <v-btn class="slide-btn" icon="mdi-chevron-right" variant="plain" @click="nextProduct" :disabled="!canGoToNextProduct"></v-btn>
                </div>
            </v-card>
        </div>
        <ReviewCreate ref="reviewCreate" :packageProductId="selectedPackageProductId" />

    </div>
    <br>
</template>

<script>
import axios from 'axios';
import MemberSidebar from '@/components/sidebar/MemberSidebar.vue';
import ReviewCreate from '@/views/product/review/ReviewCreate.vue';

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

            selectedPackageProductId: null,
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
    },
    methods: {
        async fetchSubscriptionPackageProducts() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/subscription/list`);
            this.subscriptionPackageProductList = response.data;
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
        withdrawSubscribe() {
            // 영수증 페이지로 보내주기
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

.detail-container{
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
</style>