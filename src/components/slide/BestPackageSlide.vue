<template>
    <v-container>

        <div class="carousel">
            <div class="carousel-inner" :style="`transform: translateX(-${currentSlide * (100 / itemsPerPage)}%);`">
                <div class="carousel-item" v-for="(item, index) in items" :key="index">
                    <img :src="item.imageUrl"
                    alt="item image"
                    class="item-img"
                    @click="this.$router.push(`/product/${item.id}`)"
                    />
                    <div class="item-info">
                        <h2>{{ item.packageName }}</h2>
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
export default {
    data() {
        return {
            currentSlide: 0,
            itemsPerPage: 4,  // Number of items to show per page
            items: [],
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
        } catch(e) {
            console.log(e);
        }
    },
    mounted() {
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
            for(i=0; i<amount.length; i++) {
                ret = String(amount[amount.length - i - 1]) + ret;
                if(i % 3 == 2 && i != amount.length-1) {
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
    },

};
</script>
<style scoped>
.carousel {
  width: 100%;
  overflow: hidden;
  padding-right: 20px; /* To make the next item partially visible */
}

.carousel-inner {
  display: flex;
  transition: transform 1s ease-in-out;
  width: calc(100% + 20px); /* Compensate for the padding */
}

.carousel-item {
  flex: 1 0 calc(25.333% - 20px); /* Three items per page with spacing */
  margin-right: 20px; /* Create space between items */

  box-sizing: border-box;
}

.item-img {
  width: 260px;
  height: 260px;
  object-fit: cover;
  border-radius: 2%;
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
</style>
