<template>
    <v-container>
        <div class="carousel">
            <div class="carousel-inner" :style="`transform: translateX(-${currentSlide * (100 / itemsPerPage)}%);`">
                <div class="carousel-item" v-for="(item, index) in items" :key="index">
                    <img :src="item.imgSrc" alt="item image" class="item-img" />
                    <div class="item-info">
                        <h2>{{ item.title }}</h2>
                        <p>{{ item.price }}원</p>
                    </div>
                </div>
            </div>
        </div>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            currentSlide: 0,
            itemsPerPage: 3,  // Number of items to show per page
            items: [
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.28.07.png',
                    title: '김종옥 농부의 단감',
                    price: '30,295',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.28.07.png',
                    title: '담채원 친환경 & 국산 김치',
                    price: '12,000',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.28.07.png',
                    title: '장재훈, 임영희 농부의 배',
                    price: '24,000',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.29.56.png',
                    title: '[정기구독] 김인기 농부의 무농약 유럽 채소13종',
                    price: '11,000',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.29.56.png',
                    title: '김종옥 농부의 단감',
                    price: '30,295',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.29.56.png',
                    title: '담채원 친환경 & 국산 김치',
                    price: '12,000',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.28.07.png',
                    title: '장재훈, 임영희 농부의 배',
                    price: '24,000',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.28.07.png',
                    title: '[정기구독] 김인기 농부의 무농약 유럽 채소13종',
                    price: '11,000',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.28.07.png',
                    title: '김종옥 농부의 단감',
                    price: '30,295',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.28.07.png',
                    title: '담채원 친환경 & 국산 김치',
                    price: '12,000',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.28.07.png',
                    title: '장재훈, 임영희 농부의 배',
                    price: '24,000',
                },
                {
                    imgSrc: 'https://dongsanginong-bucket.s3.ap-northeast-2.amazonaws.com/local/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2024-10-10+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+9.28.07.png',
                    title: '[정기구독] 김인기 농부의 무농약 유럽 채소13종',
                    price: '11,000',
                },
                
            ],
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.items.length / this.itemsPerPage);
        },
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
  flex: 1 0 calc(33.333% - 20px); /* Three items per page with spacing */
  margin-right: 20px; /* Create space between items */
  text-align: center;
  box-sizing: border-box;
}

.item-img {
  width: 260px;
  height: 260px;
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

.item-info p {
  font-size: 16px;
  color: green;
}
</style>
