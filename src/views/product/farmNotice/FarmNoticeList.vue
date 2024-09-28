<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="8">
                <v-card v-for="notice in noticeList" :key="notice.id" class="notice-class elevation-0" outlined>
                    <v-card-title style="font-size: 17px;">{{ notice.title }}</v-card-title>
                    <v-card-text>
                        {{ notice.content }}
                    </v-card-text>

                    <v-carousel
                        v-if="notice.noticeImages && notice.noticeImages.length > 0"
                        cycle
                        hide-delimiters
                        height="200"
                        class="mt-3"
                    >
                        <v-carousel-item
                            v-for="image in notice.noticeImages"
                            :key="image.id">
                        <v-img :src="image" alt="Notice image" height="300"></v-img>
                        </v-carousel-item>
                    </v-carousel>

                    <br>
                    <v-row>
                        <v-btn color="white" style="box-shadow: none; border: none; margin-bottom: 10px; font-size: 12px;">
                            <img src="/comment.png" width=25 alt="Logo" /> 
                            10
                        </v-btn>
                        <v-btn class="btn-no-background">자세히 보기</v-btn>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            noticeList: [],
        }
    },
    created() {
        this.farmNoticeList()
    },
    methods: {
        async farmNoticeList() {
            try {
                const id = this.$route.params.id;
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/${id}/notice/list`);
                this.noticeList = response.data.content;
                console.log(response.data);
            } catch(e) {
                console.log(e);
            }
        }
    }

};
</script>

<style scoped>
.notice-class {
    margin-top: 20px;
    width: 800px;
    border: 1px solid #d4d4d4;
    border-radius: 10px;

    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 30px;
    padding-left: 30px;
}
.btn-no-background {
  box-shadow: none !important; 
  border: none !important;
  color: #808080;
  position: absolute;
  bottom: 10px;
  right: 30px;
}
</style>
