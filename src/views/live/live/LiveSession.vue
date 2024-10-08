<template>
  <!-- 강퇴 확인 모달 -->
  <div v-if="kickModalVisible" class="kick-modal-overlay"></div> 
    <div v-if="kickModalVisible" class="kick-modal">
      <p>강퇴되었습니다.<br> 이 방에 입장할 수 없습니다.</p>
      <button @click="redirectToHome" class="submit-btn">홈으로</button>
    </div>
    <!-- 🔖 라이브 세션 화면 -->  
    <div v-if="!kickModalVisible" class="live-container">
      <div class="video-section">
       <div id="session-header" style="display: flex; justify-content: space-between; align-items: center; padding-top: 30px;">
          <h3>{{ title }}</h3>
          <v-btn class="live-btn" v-if="isPublisher" @click="showExitModal">라이브 종료</v-btn>
          <v-btn class="live-btn" v-if="!isPublisher" @click="showExitModal">나가기</v-btn>
        </div>

      <div id="main-video" class="video-style" v-if="isPublisher">
        <user-video :stream-manager="mainStreamManager" />
      </div>
  
      <div id="video-container" class="video-style" v-if="!isPublisher">
        <user-video :stream-manager="publisher" @click="updateMainVideoStreamManager(publisher)" />
        <user-video 
          v-for="sub in subscribers" 
          :key="sub.stream.connection.connectionId" 
          :stream-manager="sub" 
          @click="updateMainVideoStreamManager(sub)" />
        </div>
      </div>

      <div class="chat-section">
        <ChatBox ref="chatBox" :liveId="mySessionId" :isPublisher="isPublisher" :title="title" />  <!-- ☀️ -->
      </div>
    </div>

    <!-- 라이브 종료(publisher) 확인 모달창 -->
    <v-dialog v-model="exitModalVisible" max-width="350px">
        <v-card class="end-modal">
            <v-card-text style="text-align: center;">라이브를 정말 종료하시겠습니까?</v-card-text>
            <v-card-actions>
                <v-btn class="modal-btn" @click="confirmExit" style="background-color: #BCC07B;">종료</v-btn>
                <v-btn class="modal-btn" @click="cancelExit" style="background-color: #e0e0e0;">취소</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </template>
  
<script>
import axios from 'axios';
import { OpenVidu } from "openvidu-browser";
import UserVideo from "@/components/video/UserVideo"; //⭐
import ChatBox from '../chat/ChatBox.vue';

export default {
    components: {
      UserVideo, //⭐
      ChatBox
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
        memberId: "",
        sellerId: "",

        exitModalVisible: false,
        nextRoute: null,
        kickModalVisible: false,
      };
    },
    async created() {
        const { sessionId } = this.$route.params;
        const title = this.$route.query.title;
        const isPublisher = this.$route.query.isPublisher === 'true'; // 방송자인지 시청자인지 구분 
        this.memberId = localStorage.getItem('memberId') || null;
        this.sellerId = localStorage.getItem('sellerId') || null;
        

        this.title = title;
        this.isPublisher = isPublisher;
        this.mySessionId = sessionId;

        await this.checkIfKicked();

        if (!this.kickModalVisible) {
          this.joinSession(sessionId);
        }
    },
    mounted() { // ☀️
    window.addEventListener('beforeunload', this.disconnectOnPageLeave);
    },
    beforeUnmount() { // ☀️
    window.removeEventListener('beforeunload', this.disconnectOnPageLeave);
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

        updateMainVideoStreamManager(streamManager) {
            this.mainStreamManager = streamManager; // 메인 비디오 스트림을 업데이트
        },

        showExitModal() {
            this.exitModalVisible = true;
        },
        confirmExit() {
            this.exitModalVisible = false;
            this.leaveSession();
        },
        cancelExit() {
            this.exitModalVisible = false;
        },
        disconnectOnPageLeave() { // ☀️
          if (this.stompClient) {
              this.stompClient.disconnect();
          }
        },
        async leaveSession() {
            if (this.session) {
                if (this.isPublisher) {
                    await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions/${this.mySessionId}/leave`); // 서버에 세션 종료 요청
                }
                this.session.disconnect();
            }

            if (this.stompClient) { // ☀️
              console.log("WebSocket 연결 끊기 시도");
              this.stompClient.disconnect(() => {
                console.log("WebSocket 연결 끊김")
              }, { sessionId: this.liveId })
            }

            this.session = undefined;
            this.mainStreamManager = undefined;
            this.publisher = undefined;
            this.subscribers = [];
            this.OV = undefined;

            if (this.$refs.chatBox) { // ☀️
              this.$refs.chatBox.disconnect();
            }

            // 목록으로 나가는데 새로고침 
            window.location.href = '/live/list';
        },

        async checkIfKicked() {
          console.log('Check if kicked: memberId:', this.memberId);
          try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/chat/${this.mySessionId}/isKicked/${this.memberId}`);
            console.log("check", response)
            if (response.data === true) {
              this.kickModalVisible = true; // 강퇴된 경우 모달 표시
            }
          } catch (error) {
            console.error("강퇴 상태 확인 에러:", error);
          }
        },

      redirectToHome() {
        this.$router.push('/');
      },
    },
    beforeRouteLeave(to, from, next) {
        if (!this.exitModalVisible) {
            this.exitModalVisible = true;
            this.leaveSession(); // ☀️
            next(false); 
        } else {
            next(); 
        }
    },
};
</script>
<style scoped>
.live-btn {
    background-color: #BCC07B; 
    border-radius: 50px;
    margin-right: 8%;
}
.video-style {
    width: 100%;
    margin-bottom: 20px;
}
.modal-btn {
    border-radius: 50px;
    margin-left: 10px; 
}
.end-modal {
    padding: 10px;
}
.live-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}
.video-section {
  flex: 2; /* 비디오가 더 많은 공간을 차지하도록 설정 */
  margin-right: 10px;
}
.chat-section {
  flex: 1; /* 채팅은 비디오의 절반 정도 공간 차지 */
}
.kick-modal {
  background-color: rgb(255, 255, 255);
  border: none;
  box-shadow: none;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 300px;
}

.kick-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검은 배경 */
  z-index: 9998; /* 모달 바로 아래에 */
}

.submit-btn {
  margin-left: 10px;
  margin-top: 8px;
  margin-left: -10px;
  background-color: #BCC07B;
  color: black;
  border-radius: 50px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #a8b05b;
}

</style>
  