<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="8">
                <v-card class="notice-class elevation-0" outlined>
                    <v-card-title style="font-size: 17px;"> {{ title }} </v-card-title>
                    <v-card-text>{{ content }}</v-card-text>

                    <v-carousel
                        v-if="images && images.length > 0"
                        cycle
                        hide-delimiters
                        height="300"
                        class="mt-3"
                    >
                        <v-carousel-item
                            v-for="image in images"
                            :key="image.id">
                        <v-img :src="image" alt="Notice image" height="300"></v-img>
                        </v-carousel-item>
                    </v-carousel>
                </v-card>
                <br>
                <!-- 여기부터 댓글 작성은 아직 동작하지 않음 -->
                <h3 style="padding-left: 15px;">댓글 3개</h3>
                <br>
                <!-- 댓글 작성 -->
                <v-row>
                    <v-text-field
                        v-model="comment"
                        placeholder="댓글 추가"
                        hide-details
                        solo-inverted
                        flat
                        class="comment-input"
                        prepend-inner-icon="mdi-emoticon-happy-outline"
                    ></v-text-field>
                    <v-btn class="submit-btn" >작성</v-btn>
                </v-row>
                <!-- 여기까지는 아직 동작하지 않음 -->
                <br><br>
                <!-- 댓글 조회 -->
                <v-card v-for="comment in commentList" :key="comment.id" class="comment-class elevation-0" outlined>
                    <v-row>
                        <v-card-text>&nbsp;&nbsp;&nbsp;<strong>@{{ comment.name }}</strong>&nbsp;&nbsp;
                            <span style="font-size: 12px;">({{ comment.formattedDate }})</span></v-card-text>
                        <v-btn color="white" style="box-shadow: none; border: none; margin-bottom: 10px; font-size: 12px;">
                            <img src="/plus.png" width=15 alt="Logo" /> 
                        </v-btn>
                    </v-row>
                    <v-card-text>{{ comment.contents }}</v-card-text>
                    <hr class="hr-style">
                    <br>
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
            title: "",
            content: "",
            images: [],
            commentList: [],
            comment: "",
        }
    },
    created() {
        this.farmNoticeDetail();
    },
    methods: {
        async farmNoticeDetail() {
            try {
                const farm_id = this.$route.params.farm_id;
                const notice_id = this.$route.params.notice_id;
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/${farm_id}/notice/${notice_id}`);
                console.log(response.data);

                this.title = response.data.title;
                this.content = response.data.content;
                this.images = response.data.noticeImages;

                const response2 = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/${farm_id}/notice/${notice_id}/comment`);
                this.commentList = response2.data.content;
                
                this.commentList = response2.data.content.map(comment => {
                    const [date, time] = comment.createdAt.split('T');
                    return {
                        ...comment,
                        formattedDate: `${date} ${time.split('.')[0]}`
                    };
                });
                console.log(this.commentList);
            } catch(e) {
                console.log(e);
            }
        },
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
.comment-class {
    padding-left: 12px;
}
.comment-input {
    padding-left: 25px;
}
.submit-btn {
    margin-left: 10px;
    margin-top: 8px;
    background-color: #BCC07B;
    color: black;
    border-radius: 50px;
}
.hr-style {
  border: none;
  border-top: 0.9px solid lightgray; 
  margin-top: 10px;
}
</style>
