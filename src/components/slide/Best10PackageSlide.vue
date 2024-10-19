<template>
    <v-container>
        <div class="carousel">
            <div class="carousel-inner" :style="`transform: translateX(-${currentSlide * (100 / itemsPerPage)}%);`">
                <div class="carousel-item" v-for="(item, index) in items" :key="index">
                    <img :src="item.imageUrl" alt="item image" class="item-img"
                        @click="this.$router.push(`/product/${item.id}`)" />
                    <v-chip
                        style="position: absolute; top: 10px; left: 10px; padding: 5px 10px; border-radius: 8px; background-color: rgba(128, 128, 128, 0.9); color: white;">
                        {{ item.deliveryCycle }}일 주기 배송🚚
                    </v-chip>
                    <v-btn style="width: 100%; margin-top:10px; border: 0.5px solid gray; box-shadow: none;"
                        @click="addToWishList(item)" v-if="member">
                        <div v-if="wishAnimation.get(item.id)" class="heart-emoji">
                            <svg-icon type="mdi" :path="mdiHeart" class="icon-colored"></svg-icon>
                        </div>
                        <svg-icon type="mdi" :path="wishlistItems[item.id] ? mdiHeart : mdiHeartOutline"
                            :style="{ marginRight: '2px', color: wishlistItems[item.id] ? 'red' : 'black' }"
                            class="heart-icon"></svg-icon>
                        <span style="font-size: 14px;">{{ wishlistItems[item.id] ? '위시리스트 취소' : '위시리스트 담기' }}</span>
                    </v-btn>
                    <div class="item-info">
                        <p style="font-size: medium; color: black;">{{ item.packageName }}</p>
                        <p>{{ getAmountWithFormat(item.price) }}원</p>
                        <span style="color:#999; font-size: small;"> 1회 제공 금액 {{
                            getAmountWithFormat(getPerCyclePrice(item.price, item.deliveryCycle)) }} </span>
                        <br />
                        <span style="color:#999; font-size: small;">
                            🧾 누적 주문 {{ item.orderCount }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </v-container>
</template>
<script>
import axios from 'axios';
import { mdiHeartOutline, mdiHeart } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';

export default {
    components: {
        SvgIcon,
    },
    data() {
        return {
            currentSlide: 0,
            itemsPerPage: 4,  // Number of items to show per page
            items: [],
            wishlistItems: [],
            member: localStorage.getItem("memberId"),
            wishAnimation: new Map(),
            mdiHeartOutline: mdiHeartOutline,
            mdiHeart: mdiHeart,
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.items.length / this.itemsPerPage);
        },
    },
    async created() {
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/product/no-auth/top10`);
            this.items = response.data;
        } catch (e) {
            console.log(e);
        }
    },
    async mounted() {
        await this.fetchWishlistItems();
        this.startCarousel();
    },
    methods: {
        startCarousel() {
            setInterval(() => {
                this.currentSlide = (this.currentSlide + 1) % this.totalPages;  // Move to next page
            }, 5000); // Change slide every 3 seconds
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
        getPerCyclePrice(price, deliveryCycle) {
            if (price == null || deliveryCycle == null || deliveryCycle == 0) {
                return 0; // 값이 없거나 deliveryCycle이 0일 경우 0 반환
            }
            // 10단위 반올림 처리
            const perCyclePrice = Math.round(price / (28 / deliveryCycle) / 10) * 10;
            return perCyclePrice;
        },
        async addToWishList(packageProduct) {
            try {
                const memberId = localStorage.getItem('memberId');
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/wishlist/product/${packageProduct.id}`, {
                    headers: {
                        myId: memberId,
                    }
                });
                this.wishlistItems[packageProduct.id] = !this.wishlistItems[packageProduct.id];
                if (this.wishlistItems[packageProduct.id]) {
                    // 애니메이션 시작
                    console.log(`애니메이션 시작 for product id: ${packageProduct.id}`);
                    this.wishAnimation.set(packageProduct.id, true);
                    setTimeout(() => {
                        this.wishAnimation.set(packageProduct.id, false);
                        console.log(`애니메이션 종료 for product id: ${packageProduct.id}`);
                    }, 1000); // 애니메이션 지속 시간 조절 가능
                }
            } catch (e) {
                console.log(e.message);
            }
        },
        async fetchWishlistItems() {
            try {
                const memberId = localStorage.getItem('memberId');
                if (memberId) {
                    const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/wishlist`);
                    console.log(">>>>>>>>response : ", response.data);

                    const wishlistProductIds = response.data.map(product => product.id);
                    wishlistProductIds.forEach(id => {
                        this.wishlistItems[id] = true;
                    });
                }
            } catch (error) {
                console.error('위시리스트 정보를 가져오는데 실패했습니다:', error);
            }
        },
    },

};
</script>
<style scoped>
.carousel {
    width: 100%;
    overflow: hidden;
    padding-right: 10px;
}

.carousel-inner {
    display: flex;
    transition: transform 1s ease-in-out;
    width: 100%;
    /* Compensate for the padding */
}

.carousel-item {
    flex: 1 0 calc(25.333% - 20px);
    /* Three items per page with spacing */
    margin-right: 15px;
    /* Create space between items */
    position: relative;
    box-sizing: border-box;
}

.item-img {
    object-fit: cover;
    transition: transform 0.3s ease;
    /* border-radius: 10px; */
    width: 260px;
    height: 320px;
}

.item-img:hover {
    cursor: pointer;
}

.item-info {
    margin-top: 10px;
}

.item-info h2 {
    font-size: 18px;
    font-weight: bold;
}

.item-info p {
    font-size: 16px;
    color: green;
}

.heart-emoji {
    position: absolute;
    top: -20px;
    /* 필요에 따라 위치 조정 */
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    opacity: 0;
    animation: popUp 1s ease-in-out forwards;
}

.icon-colored {
    color: red;
}

.heart-icon {
    width: 17px;
    height: 17px;
}

@keyframes popUp {
    0% {
        opacity: 0;
        transform: translate(-50%, 0) scale(0);
    }

    50% {
        opacity: 1;
        transform: translate(-50%, -50px) scale(1.5);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -100px) scale(0);
    }
}

</style>
