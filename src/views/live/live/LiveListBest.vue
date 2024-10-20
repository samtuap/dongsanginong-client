<template>
    <v-container>
        <div>
            <v-container class="d-flex custom-card-container">
            <v-row class="justify-start">
              <v-card 
                v-for="live in liveListBest" 
                :key="live.liveId" 
                class="live-card" 
                md="2" 
                variant="text" 
                style="width:200px; height:340px; margin: 10px; margin-bottom: 15px;" 
                @click="joinExistingSession(live.liveId)">
                <div v-if="live.participantCount !== null && live.participantCount !== undefined" class="viewer-count">
                  {{ live.participantCount - 1}}명 시청 중
                </div>
                <!-- 프리뷰 라이브 -->
                <video
                  v-if="live.isPreviewing"
                  :ref="'videoPlayer-' + live.liveId"
                  muted
                  autoplay
                  loop
                  class="live-video-preview"
                  style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;"
                ></video>
                <!-- 썸네일 -->
                <v-img
                  width="100%"
                  height="280px"
                  :src="live.liveImage"
                  alt="live 썸네일" 
                  cover
                />
                <v-card-text>
                  <span v-if="live.title.length > 10">
                    [ {{ live.farmName }} ] {{ live.title.substring(0, 10) }}... 
                  </span>
                  <span v-else>[ {{ live.farmName }} ] {{ live.title }}</span>
                </v-card-text>
              </v-card>
            </v-row>
          </v-container>
        </div>
    </v-container>

</template>

<script>
import axios from 'axios';
import { OpenVidu } from "openvidu-browser";
export default {
    props: {
      autoStart: {
        type: Boolean,
        default: false
      }
    },
    data() {
        return {
            liveListBest: [],
        }
    },
    created() {
        this.fetchLiveListBest();
        if (this.autoStart) {
          setTimeout(() => {
            this.playPreviewAll();
          }, 1000); // 필요한 경우 지연 시간 조정
        }
    },
    methods: {
        async fetchLiveListBest() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/live/active/best`);
                console.log(">>>>response : ", response.data.content);

                this.liveListBest = response.data.content;
                this.liveListBest.forEach(live => {
                    Object.assign(live, { isPreviewing: false, session: null});
                }); // ispreviewing 필드 live에 추가 
                
            } catch(e) {
                console.log(e.message);
            }
        },
        // 시청자: 기존 세션에 접속
        async joinExistingSession(liveId) {
            console.log("시청자 세션 : ", liveId);
            this.isPublisher = false; // 시청자 설정
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions/${liveId}/sessionId`);
                console.log(response.data.sessionId);
                this.mySessionId = response.data.sessionId;
                console.log("join 세션id : ", this.mySessionId);

                // 세션 접속 후 LiveStream.vue로 이동
                this.$router.push({
                    path: `/live/${response.data.sessionId}`,
                    query: { title: response.data.title, 
                             isPublisher: false,
                             farmName: response.data.farmName,
                             profileImageUrl: response.data.profileImageUrl }
                });
            } catch (error) {
                console.error('세션 ID 가져오기 오류:', error);
            }
        },
        // 목록 뿌려지자마자 1.5초 뒤에 전체 프리뷰 뿌려짐 
        async playPreviewAll() {
          for (const live of this.liveListBest) {
            if (!live.isPreviewing) {
              this.playPreview(live);
            }
          }
        },
        // 모든 프리뷰 중단
        stopAllPreviews() {
          for (const live of this.liveListBest) {
            if (live.isPreviewing) {
              live.isPreviewing = false;
              console.log(">>>>>>>>>" + live.liveId + "번 라이브 중단됨");

              if (live.session) {
                live.session.disconnect();
                live.session = null;
              }
            }
          }
        },
        async playPreview(live) {
          console.log(">>>>>>>" + live.liveId + "번째 라이브 시작");
          try {
            live.isPreviewing = true;
            await this.$nextTick();

            const token = await this.getToken(live.sessionId);
            console.log(">>>>>>>>> token: " + token + " >>>>>>>>>> sessiongId" + live.sessionId);

            const OV = new OpenVidu();
            const session = OV.initSession();
            session.on('streamCreated', ({ stream }) => {
              const videoRef = this.$refs['videoPlayer-' + live.liveId];
              const videoElement = videoRef ? videoRef[0] : null;
              console.log(">>>>>>>>>video element: ", videoElement)

              if (videoElement) {
                const subscriber = session.subscribe(stream, undefined);
                subscriber.addVideoElement(videoElement);
              } else {
                console.warn('경고: Video element is not yet available for preview.');
              }
            });

            await session.connect(token, { clientData: 'Preview' }).then(() => {
              console.log("세션 연결됨 > Current connections: ", session.remoteConnections);
            }).catch(error => {
              console.error("세션 연결 실패:", error);
            });

          } catch (error) {
              console.error('영상 미리보기 오류:', error);
          }
      },
      async getToken(sessionId) {
        try {
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions/${sessionId}/connections`);
          return response.data;
        } catch (error) {
          console.error('Error fetching token for preview:', error);
        }
      }
    },
    unmounted() {
      this.stopAllPreviews();
    }
}
</script>

<style scoped>
.viewer-count {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.7); /* 배경을 반투명하게 설정 */
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    z-index: 1; /* 이미지를 덮도록 설정 */
}
</style>