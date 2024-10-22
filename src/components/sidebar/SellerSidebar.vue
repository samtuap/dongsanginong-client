<template>
    <v-navigation-drawer app permanent>
        <v-list dense>
            <v-list-item-group>
                <v-list-item style="text-align: center;">
                    <v-list-item-title class="item-title"><strong>동상이농 사장님 서비스</strong></v-list-item-title>
                </v-list-item>
                <v-col class="text-start" style="margin-left: 10%;">
                    <div>
                        <div style="color: black; font-size: 15px; font-weight: bold;"><i class="mdi mdi-clock-outline"></i> 영업 관리</div>
                        <v-btn class="cat_btn" :to="{path:'/seller/delivery-management'}">주문 및 배송 관리</v-btn><br>
                        <v-btn class="cat_btn" :to="{path:'/seller/sales-detail'}">매출 내역 관리</v-btn><br>
                    </div>
                    <br>
                    <div>
                        <div style="color: black; font-size: 15px; font-weight: bold;"><i class="mdi mdi-home-outline"></i> 농장 관리</div>
                        <v-btn class="cat_btn" :to="{path: '/seller/product-list'}">상품 관리</v-btn><br>
                        <v-btn class="cat_btn" :to="{ path: `/seller/review/list`}">리뷰 관리</v-btn><br>
                        <v-btn class="cat_btn" :to="{ path: `/coupons/list`}">쿠폰 관리</v-btn><br>
                        <v-btn class="cat_btn" :to="{ path: `/seller/notice/list`}">커뮤니티 관리</v-btn><br>
                        <v-btn class="cat_btn" :to="{ path: '/my-farm/update'}">내 농장 수정</v-btn><br>
                        <v-btn class="cat_btn" :to="{ path: `/farm/${this.farmId}/packages`}">내 농장 바로가기</v-btn>
                    </div>
                    <br>
                    <div>
                        <div style="color: black; font-size: 15px; font-weight: bold;"><i class="mdi mdi-cog-outline"></i> 기본 환경설정</div>
                        <v-btn class="cat_btn" :to="{ path: `/seller/password/update`}">비밀번호 변경</v-btn><br>
                    </div>
                    
                </v-col>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
export default {
    data() {
        return {
            farmId: localStorage.getItem('farmId'),
        }
    }
}
</script>
<style scoped>
.item-title {
    background-color: #BCC07B; 
    border-radius: 50px;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 10px;
    padding-bottom: 10px;

}
.cat_btn{
    border: none;
    box-shadow: none;
    justify-content: start;
    width: auto;
    margin-left: 6px;
}
</style>