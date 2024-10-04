<template>
    <v-container>
        <!-- 🔖 LIVE LIST 화면 -->
        <template v-if="!session">
            <!-- 즐겨찾기 농장 중 진행중인 라이브 : seller에게는 나타나지 않음 -->
            <v-card style="border-radius: 15px; padding: 20px; max-width: 1200px; width: 100%; border-bottom: 1px solid #D4D4D4;" 
            rounded="0" flat v-if="!isSeller">
                <v-card-title>✨ Favorites</v-card-title>
                <v-card-text style="color: gray;">스크랩 된 농장의 라이브 목록입니다.</v-card-text>
                <div style="display: flex; justify-content: center; align-items:center;">
                    <v-btn icon="mdi-chevron-left" variant="plain" @click="prev"></v-btn>
                    <v-window v-model="onboarding" style="width: 1080px;">
                        <v-window-item v-for="n in windowCount" :key="`window-${n}`" :value="n">
                            <v-row class="d-flex justify-center">
                            <v-col v-for="live in paginatedLives(n)" :key="live.id" cols="12" md="3" class="d-flex justify-center">
                                <v-card variant="text" style="width:235px; height:360px;" @click="joinExistingSession(live.id)">                
                                <v-img
                                    class="live-image"
                                    width="235"
                                    height="300px"
                                    :src="live.liveImage"
                                    alt="Farm 썸네일"
                                    cover
                                />
                                <v-card-text style="text-align: center;">
                                    <span v-if="live.title.length > 10">[ {{ live.farmName }} ] {{ live.title.substring(0, 10) }}...</span>
                                    <span v-else>[ {{ live.farmName }} ] {{ live.title }}</span>
                                </v-card-text>
                                </v-card>
                            </v-col>
                            </v-row>
                        </v-window-item>
                    </v-window>
                    <v-btn icon="mdi-chevron-right" variant="plain" @click="next"></v-btn>

                </div>
                <v-card-actions style="justify-content: center;">
                    <v-item-group v-model="onboarding" class="text-center" mandatory>
                        <v-item v-for="n in windowCount" :key="`btn-${n}`" v-slot="{ isSelected, toggle }" :value="n">
                            <v-btn :color="isSelected ? 'yellow' : 'deep_green'" icon="mdi-circle-small"
                                @click="toggle"></v-btn>
                        </v-item>
                    </v-item-group>
                </v-card-actions>
            </v-card>
            
            <!-- 진행 중인 라이브 목록 (전체) -->
            <v-container style="width: 100%; text-align: center;">
                <h3>라이브 목록</h3>
                <v-btn v-if="isSeller" class="start-btn" @click="openModal">라이브 시작</v-btn>

                <v-container class="d-flex custom-card-container">
                    <v-row style="justify-content: center;">
                        <v-card v-for="live in liveList" :key="live.liveId" class="farm-card" md="2" variant="text" style="width:200px; height:360; margin: 10px; margin-bottom: 15px;"
                        @click="joinExistingSession(live.liveId)">
                            <v-img
                            class="farm-image"
                            width="180px"
                            height="280px"
                            :src="live.liveImage"
                                alt="Farm 썸네일" cover />
                            <v-card-text>
                                <span v-if="live.title.length > 10">[ {{ live.farmName }} ] {{ live.title.substring(0, 10) }}... </span>
                                <span v-else>[ {{ live.farmName }} ] {{live.title}}</span>
                            </v-card-text>
                        </v-card>
                    </v-row>
                </v-container>
            </v-container>

            <!-- 라이브 시작 모달창 : seller가 title과 썸네일 사진을 추가함 -->
            <v-dialog v-model="startLiveDialog" max-width="600px">
                <v-card class="live-modal">
                    <v-card-text style="display: flex; align-items: center; justify-content: center">
                        <img src="/live.png" width=40 alt="Logo" style="padding-bottom:2px;"/>
                        <strong>라이브 시작하기</strong>
                    </v-card-text>
                    <v-text-field
                            v-model="title"
                            placeholder="라이브 제목을 작성하세요."
                            hide-details
                            solo-inverted
                            flat
                            class="live-input"
                            prepend-inner-icon="mdi-emoticon-happy-outline"
                        ></v-text-field>
                        <v-file-input
                            label="썸네일 이미지를 추가하세요."
                            
                            accept="image/*"
                            @change="onThumbnailImageUpload"
                        />
                        <v-row class="modal-action">
                            <v-btn class="modal-btn" @click="startLive" style="background-color: #BCC07B;">시작</v-btn>
                            <v-btn class="modal-btn" @click="cancelLive" style="background-color: #e0e0e0;">취소</v-btn>
                        </v-row>
                </v-card>            
            </v-dialog>
        </template>


        <!-- 🔖 라이브 세션 화면 : 라이브가 실행되고 비디오가 출력되는 화면면 -->
        <template v-else>
            <div>
                <div id="session-header" style="display: flex; flex-direction: column; align-items: center;">
                    <h3 style="text-align: center;">{{ title }}</h3>
                    <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 10px;">
                        <v-btn class="live-btn" v-if="isPublisher" @click="leaveSession">라이브 종료</v-btn>
                        <v-btn class="live-btn" v-if="!isPublisher" @click="leaveSession">나가기</v-btn>
                    </div>
                </div>
                <div id="main-video" class="col-md-6" v-if="isPublisher">
                    <user-video :stream-manager="mainStreamManager" />
                </div>
                <div id="video-container" class="col-md-6" v-if="!isPublisher">
                    <user-video :stream-manager="publisher" @click="updateMainVideoStreamManager(publisher)" />
                    <user-video v-for="sub in subscribers" :key="sub.stream.connection.connectionId" :stream-manager="sub"
                    @click="updateMainVideoStreamManager(sub)" />
                </div>
            </div>
        </template>

    </v-container>
</template>

<script>
import axios from 'axios';
import { OpenVidu } from "openvidu-browser";
import UserVideo from "@/components/video/UserVideo";

export default {
    components: {
        UserVideo, // 사용자 비디오 컴포넌트
    },
    data() {
        return {
            isSeller: false,
            favoritesLiveList: [], 
            onboarding: 1,
            windowCount: 3,
            liveList: [],

            startLiveDialog: false,
            // OpenVidu 관련 객체
            OV: undefined,
            session: undefined, // 현재 세션
            mainStreamManager: undefined, // 메인 화면에 표시할 스트림 관리자
            publisher: undefined, // 방송자 스트림 관리자
            subscribers: [], // 구독자들

            mySessionId: '', // 세션 ID
            myUserName: "Participant" + Math.floor(Math.random() * 100),
            isPublisher: false, // 방송자 여부

            title: "",
            liveImage: "",
            file: null,
        };
    },
    async created() {
        // 즐겨찾기 뿌리기
        const role = localStorage.getItem('role');
        if (role === 'SELLER') {
            this.isSeller = true;
        } else {
            this.isSeller = false;
            
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/favorites/farm/live/list`, {
                    headers: {
                        myId: localStorage.getItem('memberId')
                    }
                });

                this.favoritesLiveList = response.data;
                this.windowCount = Math.ceil(this.favoritesLiveList.length / 4);
            } catch (e) {
                console.log(e.message);
            }
        }

        // 전체 라이브 목록 뿌리기 
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/live/active`);
            this.liveList = response.data;
        } catch(e) {
            console.log(e);
        }
    },
    methods: {
        // 썸넬 이미지 등록 
        async handleImageUpload(blob) {
            const accessToken = localStorage.getItem('accessToken');
            const body = {
                prefix: "Live",
                url: `${blob?.name}`,
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const getUrl = await fetch(`${process.env.VUE_APP_API_BASE_URL}/product-service/api/upload/presigned-url`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            });

            const urlContentType = getUrl.headers.get("content-type");
            let getUrlResult;
            if (urlContentType && urlContentType.includes("application/json")) {
                getUrlResult = await getUrl.json(); // JSON으로 파싱
            } else {
                getUrlResult = await getUrl.text(); // 텍스트로 파싱
            }

            const awsUrl = {
                data: `${getUrlResult.split("?")[0]}`,
                auth: `?${getUrlResult.split("?")[1]}`,
            };

            // 파일을 S3에 업로드
            const options = {
                method: "PUT", // PUT 메서드 사용
                headers: {
                "Content-Type": blob.type, // Blob의 MIME 타입 설정
                },
                body: blob, // 업로드할 파일 데이터
            };
            await fetch(awsUrl.data + awsUrl.auth, options);

            return awsUrl.data;
        },
        async onThumbnailImageUpload(event) {
            const file = event?.target?.files[0];
            this.liveImage = await this.handleImageUpload(file);
        },
        // 즐찾 리스트 슬ㄹㅏ이더 
        paginatedLives(page) {
            const livePerPage = 4; 
            const start = (page - 1) * livePerPage;
            const end = start + livePerPage;
            return this.favoritesLiveList.slice(start, end); 
        },
        next() {
            this.onboarding = this.onboarding + 1 > this.windowCount ? 1 : this.onboarding + 1;
        },
        prev() {
            this.onboarding = this.onboarding - 1 <= 0 ? this.windowCount : this.onboarding - 1;
        },
        // 라이브 시작하기 위해 title, 썸네일 추가하는 모달창 
        openModal() {
            this.startLiveDialog = true;
        },
        cancelLive() {
            this.startLiveDialog = false; 
            this.title = "";
            this.liveImage = "";
        },
        // 방송자: 라이브 시작
        async startLive() {
            if (this.title && this.liveImage) {
                const liveData = {
                    title: this.title,
                    liveImage: this.liveImage
                };
                try {
                    const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions`, liveData, {
                        headers: {
                        'sellerId': localStorage.getItem('sellerId'),
                        },
                    });
                    // 세션 ID 받아오기
                    this.mySessionId = response.data.sessionId;
                    this.isPublisher = true; // 방송자로 설정
                    
                    // 모달창 닫고 초기화 
                    this.startLiveDialog = false; 
                    this.title = "";
                    this.liveImage = "";
                    this.joinSession(response.data.title); // 방송 시작
                } catch (error) {
                    console.error('라이브 시작 오류:', error);
                }
            }
        },

        // 시청자: 기존 세션에 접속
        async joinExistingSession(liveId) {
            console.log("시청자 세션 : ", liveId);
            this.isPublisher = false; // 시청자 설정

            // 시청할 세션 ID 가져오기
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions/${liveId}/sessionId`);
                console.log(response.data.sessionId);
                this.mySessionId = response.data.sessionId;
                console.log("join 세션id : ", this.mySessionId)
                this.joinSession(response.data.title); // 세션에 접속
            } catch (error) {
                console.error('세션 ID 가져오기 오류:', error);
            }
        },

        // OpenVidu 세션에 접속
        async joinSession(title) {
            this.OV = new OpenVidu(); // 새로운 OpenVidu 객체 생성
            this.session = this.OV.initSession(); // 세션 초기화
            this.title = title;

            // 스트림이 생성될 때마다 실행되는 콜백
            this.session.on("streamCreated", ({ stream }) => {
                const subscriber = this.session.subscribe(stream);
                this.subscribers.push(subscriber); // 구독자를 리스트에 추가
            });

            // 스트림이 종료될 때 실행되는 콜백
            this.session.on("streamDestroyed", ({ stream }) => {
                const index = this.subscribers.indexOf(stream.streamManager);
                if (index >= 0) {
                this.subscribers.splice(index, 1); // 종료된 스트림을 구독자 리스트에서 제거
                }
            });

            // 백엔드에서 토큰을 받아 세션에 연결
            const token = await this.getToken(this.mySessionId);
            this.session.connect(token, { clientData: this.myUserName }).then(() => {
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

        // 세션 종료 : 라이브에서 떠나기 
        async leaveSession() {
            if (this.session) {
                if (this.isPublisher) {
                    await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions/${this.mySessionId}/leave`); // 서버에 세션 종료 요청
                    this.session.disconnect();
                }
            }
            this.session = undefined;
            this.mainStreamManager = undefined;
            this.publisher = undefined;
            this.subscribers = [];
            this.OV = undefined;

            // 목록으로 나가는데 새로고침 
            window.location.href = '/live/list';
        },

        // 백엔드에서 토큰 받아오기
        async getToken(sessionId) {
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/live-service/api/sessions/${sessionId}/connections`);
            return response.data; // 서버에서 생성된 토큰 반환
        },
    }
}
</script>

<style scoped>
.start-btn {
    background-color: #BCC07B; 
    border-radius: 50px;
    float: right;
    margin-right: 30px;
    font-weight: 700;
}
.live-modal {
    height: 350px;
    padding: 15px;
}
.live-btn {
    background-color: #BCC07B; 
    border-radius: 50px;
}
.modal-action {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-right: 10px;
}
.modal-btn {
    border-radius: 50px;
    margin-left: 10px; 
}
</style>