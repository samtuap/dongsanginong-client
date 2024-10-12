<template>
  <div class="chat-container">
    <div class="chat-room">
      <div class="title">실시간 채팅 ▽ </div>
      <div class="message-list" ref="messageList">
        <div
          v-for="(message, index) in messages"
          :key="message.timestamp"
          class="message-item"
          @click="selectMessage(index)"
        >
          <div style="color: #7a7a7a; font-size: 14px;">
            {{ message.name }}{{ message.isOwner ? '📍' : '' }} &nbsp;&nbsp;&nbsp;&nbsp; 
            <span style="color: black;">{{ message.content }}</span>
          </div>
          <div v-if="isPublisher && selectedMessageIndex === index" class="dropdown-menu">
            <button @click="kickUser(message.memberId)" class="dropdown-item">
              강퇴하기
            </button>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input
          v-model="chatMessage"
          @keyup.enter="sendMessage"
          placeholder="메시지를 입력하세요"
        />
        <button class="send-btn" @click="sendMessage">
          <i class="mdi mdi-send"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import axios from 'axios';

export default {
  props: {
    liveId: {
      type: String,
      required: true,
    },
    currentSellerId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chatMessage: '',
      messages: [],
      stompClient: null,
      subscription: null,
      memberId: null,
      sellerId: null,
      senderName: null,
      token: null,
      isPublisher: false, // 초기값 false
      isKicked: false,
      selectedMessageIndex: null, // 선택한 메시지 인덱스
    };
  },
  async mounted() {
    this.token = localStorage.getItem('accessToken');
    this.memberId = localStorage.getItem('memberId') || null;
    this.sellerId = localStorage.getItem('sellerId') || null;
    this.senderName = localStorage.getItem('username');

    console.log('Token:', this.token);
    console.log('memberId:', this.memberId, 'sellerId:', this.sellerId, 'senderName:', this.senderName, 'isPublisher:', this.isPublisher);

    await this.checkIfKicked(); // 강퇴 여부 확인

    if (!this.isKicked) {
      this.enterChatRoom();  // 강퇴되지 않았을 경우에만 방 입장
    }

    // isPublisher 자동 설정: 현재 사용자가 방의 소유자인지 확인
    const isPublisherParam = this.$route.query.isPublisher;
    this.isPublisher = isPublisherParam === 'true';
    console.log('isPublisher from URL:', this.isPublisher);
  },
  updated() {
    this.scrollToBottom();
  },
  beforeUnmount() {
    if (this.stompClient && this.stompClient.connected) {
      console.log("Disconnecting WebSocket connection");
      this.stompClient.disconnect(() => {
        console.log("WebSocket disconnected");
      });
    }
  },
  methods: {
    enterChatRoom() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      if (this.stompClient && this.stompClient.connected) {
        console.log("WebSocket 연결 끊기 시도");
        this.stompClient.disconnect(() => {
          console.log('기존 WebSocket 연결 해제됨');
        }, { sessionId: this.mySessionId});
      } else {
        console.log("WebSocket 연결이 이미 끊어졌거나 연결되지 않음");
      }

      this.messages = [];
      const socket = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/live-service/ws`);
      this.stompClient = Stomp.over(socket);

      const headers = {
        Authorization: `Bearer ${this.token}`,
        memberId: this.memberId || '',
        sellerId: this.sellerId || '',
        sessionId: this.liveId
      };

      console.log('WebSocket Headers:', headers);

      this.stompClient.connect(
        headers,
        () => {
          console.log("WebSocket 연결 성공");
          this.subscription = this.stompClient.subscribe(`/topic/live/${this.liveId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            console.log('Received Message:', receivedMessage);
            this.messages.push(receivedMessage);
          });

          // 강퇴 메시지를 받기 위한 구독
          this.stompClient.subscribe(`/topic/kick/${this.memberId}`, (message) => {
            try {
              const kickMessage = JSON.parse(message.body);
              console.log("kickMessage", kickMessage);
              if (kickMessage.memberId === Number(this.memberId)) {
                alert(kickMessage.message);
                this.stompClient.disconnect(() => {
                  console.log("Kicked user WebSocket disconnected");
                  this.$router.push("/");
                });
              }
            } catch (e) {
              console.error("Failed to parse kick message:", e);
            }
          });
        },
        (error) => {
          console.error('WebSocket connection error:', error);
        }
      );
    },

    disconnect() {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.disconnect(() => {
          console.log("WebSocket disconnected");
        });
      }
    },
    async checkIfKicked() {
      if (this.memberId) {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/chat/${this.liveId}/isKicked/${this.memberId}`);
          this.isKicked = response.data;
        } catch (error) {
          console.error('Error checking kick status:', error);
        }
      } else {
        this.isKicked = false;
      }
    },

    redirectToHome() {
      this.$router.push('/');
    },

    sendMessage() {
      if (this.stompClient && this.stompClient.connected && this.chatMessage.trim() !== '') {
        const message = {
          memberId: this.memberId,
          sellerId: this.sellerId,
          sessionId: this.liveId,
          content: this.chatMessage,
          name: this.senderName,
          isOwner: this.isPublisher,
          type: 'TEXT',
        };

        this.stompClient.send(`/app/chat/${this.liveId}/sendMessage`, JSON.stringify(message));
        this.chatMessage = '';
      } else {
        console.error('WebSocket is not connected yet');
      }
    },
    scrollToBottom() {
      const messageList = this.$refs.messageList;
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    },

    selectMessage(index) {
      if (this.selectedMessageIndex === index) {
        this.selectedMessageIndex = null;
      } else {
        this.selectedMessageIndex = index;
      }
    },

    kickUser(userId) {
      axios.post(`${process.env.VUE_APP_API_BASE_URL}/live-service/chat/${this.liveId}/kick/${userId}`, null, {
        headers: {
          sellerId: Number(this.sellerId),
          Authorization: `Bearer ${this.token}`
        }
      })
        .then(() => {
          console.log(`${userId} 강퇴됨`);
        })
        .catch(error => {
          console.error("강퇴 에러:", error);
        });
    },
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 87vh;
  background-color: white;
  padding-top: 5%;
}

.chat-room {
  flex: 1;
  margin-bottom: 10px;
  padding-top: 12px;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 10px;
}

.title {
  margin-left: 3%;
  font-size: 15px;
}

.message-list {
  max-height: calc(100vh - 240px);
  height: 85%;
  overflow-y: auto;
  background-color: #f7f7f7;
  padding: 20px;
  margin-top: 15px;
  font-size: 14px;
}

.message-item {
  margin-bottom: 10px;
  cursor: pointer;
}

.chat-input {
  display: flex;
  align-items: center;
  height: 8%;
  margin-left: 2%;
  margin-top: 1%;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  margin-right: 10px;
}

.chat-input button {
  background-color: white;
  color: black;
  /* border: 1px solid #e0e0e0; */
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 50px;
  margin-right: 2%;
}

.chat-input button:hover {
  background-color: #e0e0e0;
}
.send-btn {
  font-size: 22px; 
}
.dropdown-menu {
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
}

.dropdown-item {
  padding: 5px 10px;
  background-color: #fff;
  border: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}
</style>