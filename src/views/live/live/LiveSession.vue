<template>
    <!-- 🔖 라이브 세션 화면 -->
    <div>
      <div id="session-header" style="display: flex; flex-direction: column; align-items: center; padding-top: 30px;">
        <h3 style="text-align: center;">{{ title }}</h3>
        <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 10px;">
          <v-btn class="live-btn" v-if="isPublisher" @click="leaveSession">라이브 종료</v-btn>
          <v-btn class="live-btn" v-if="!isPublisher" @click="leaveSession">나가기</v-btn>
        </div>
      </div>
      <div id="main-video" class="col-md-6 video-style" v-if="isPublisher">
        <user-video :stream-manager="mainStreamManager" />
      </div>
      <div id="video-container" class="col-md-6 video-style" v-if="!isPublisher">
        <user-video :stream-manager="publisher" @click="updateMainVideoStreamManager(publisher)" />
        <user-video 
          v-for="sub in subscribers" 
          :key="sub.stream.connection.connectionId" 
          :stream-manager="sub" 
          @click="updateMainVideoStreamManager(sub)" />
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { OpenVidu } from "openvidu-browser";
  import UserVideo from "@/components/video/UserVideo"; //⭐
  export default {
    components: {
      UserVideo //⭐
    },
    data() {
      return {
        session: undefined, 
        mainStreamManager: undefined,
        publisher: undefined,
        subscribers: [],
        isPublisher: false,
        title: "", 
        OV: undefined,
        mySessionId: "",
      };
    },
    async created() {
        const { sessionId } = this.$route.params;
        const title = this.$route.query.title;
        const isPublisher = this.$route.query.isPublisher === 'true'; // 방송자인지 시청자인지 구분 

        this.title = title;
        this.isPublisher = isPublisher;
        this.mySessionId = sessionId;
        this.joinSession(sessionId);    
    },
    methods: {
        async joinSession(sessionId) {
            console.log("화면들어옴 sessionId: ", sessionId);
            this.OV = new OpenVidu();
            this.session = this.OV.initSession();

            // 스트림 생성 및 제거 처리
            this.session.on("streamCreated", ({ stream }) => {
                const subscriber = this.session.subscribe(stream);
                this.subscribers.push(subscriber);
            });

            this.session.on("streamDestroyed", ({ stream }) => {
            const index = this.subscribers.indexOf(stream.streamManager);
            if (index >= 0) {
                this.subscribers.splice(index, 1);
            }
            });
            
            // 백엔드에서 토큰 받아와서 세션에 연결
            const token = await this.getToken(sessionId);
            this.session.connect(token, { clientData: this.myUserName }).then(() => {
                console.log("isPublisher: ", this.isPublisher);
                if (this.isPublisher) {
                    // 방송자일 경우 자신의 비디오와 오디오를 송출
                    const publisher = this.OV.initPublisher(undefined, {
                        audioSource: undefined, // 기본 마이크
                        videoSource: undefined, // 기본 웹캠a
                        publishAudio: true,
                        publishVideo: true,
                        resolution: "640x480",
                        frameRate: 30,
                    });

                    this.mainStreamManager = publisher; // 메인 화면에 방송자 스트림 표시
                    this.publisher = publisher; // 방송자 스트림 저장
                    this.session.publish(this.publisher); // 스트림 송출
                }
            });
        },
      
        async getToken(sessionId) {
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions/${sessionId}/connections`);
            return response.data;
        },
        async leaveSession() {
            if (this.session) {
                if (this.isPublisher) {
                    await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions/${this.mySessionId}/leave`); // 서버에 세션 종료 요청
                    // this.session.disconnect();
                }
                this.session.disconnect();
            }
            this.session = undefined;
            this.mainStreamManager = undefined;
            this.publisher = undefined;
            this.subscribers = [];
            this.OV = undefined;

            // 목록으로 나가는데 새로고침 
            window.location.href = '/live/list';
        },
    },
  };
</script>
<style scroped>
.live-btn {
    background-color: #BCC07B; 
    border-radius: 50px;
    margin-right: 8%;
}
.video-style {
    margin-left: 8%;
}
</style>

  