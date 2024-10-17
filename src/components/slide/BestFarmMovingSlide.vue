<template>
    <v-container>
        <div class="carousel">
            <div class="carousel-inner" :style="`transform: translateX(-${currentSlide * (100 / itemsPerPage)}%);`">
                <div class="carousel-item" v-for="(item, index) in items" :key="index">
                    <img :src="item.imageUrl"
                    alt="item image"
                    class="item-img"
                    @click="this.$router.push(`/farm/${item.id}/packages`)"
                    />
                    <div class="item-info">
                        <h2>{{ item.farmName }}</h2>
                        <p class="farm-intro">{{ item.farmIntro }}</p>
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
            farmList: [],
            likes: [],
            likeCount: [],
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.items.length / this.itemsPerPage);
        },
    },
    async created() {
        const params = {
            "page": 0,
            "size": 10,
            "sort": "favoriteCount,desc"
        }

        try {
            const response2 = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/no-auth`, { params });
            this.items = response2.data.content;

            this.likes = new Array(this.farmList.length);
            this.likeCount = new Array(this.farmList.length);
            for (let i = 0; i < this.farmList.length; ++i) {
                if (this.farmList[i].isLiked === true) {
                    this.likes[i] = 1;
                } else {
                    this.likes[i] = 0;
                }
                this.likeCount[i] = Number(this.farmList[i].favoriteCount);
            }

        } catch (e) {
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
            }, 3000); // Change slide every 3 seconds
        },
    },
};
</script>
<style scoped>
.carousel {
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  padding-right: 20px; /* To make the next item partially visible */
  
}

.carousel::-webkit-scrollbar {
    display: none;
}

.carousel-inner {
  display: flex;
  width: calc(100% + 20px); /* Compensate for the padding */
  transition: transform 1s ease-in-out;
}

.carousel-item {
  flex: 1 0 calc(25% - 20px); /* Three items per page with spacing */
  margin-right: 20px; /* Create space between items */
  text-align: center;
  box-sizing: border-box;
}

.item-img {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 50%;
}

.item-info {
  margin-top: 10px;
}

.item-info h2 {
  font-size: 18px;
  font-weight: bold;
}

.item-img:hover {
    cursor: pointer;
}

.farm-intro {
    font-size: 15px;
    font-weight: medium;
    opacity: 0.9;
    color: #5D5D5D;
}
</style>
