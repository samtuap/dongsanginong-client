<template>
  <div class="chat-container">
    <div class="chat-room">
      <h3>{{ title }} 채팅방</h3>
      <div class="message-list" ref="messageList">
        <div
          v-for="(message, index) in messages"
          :key="message.timestamp"
          class="message-item"
          @click="selectMessage(index)"
        >
          <strong :style="{ color: message.isOwner ? '#d9534f' : '#5bc0de' }">
            {{ message.isOwner ? '👑 ' : '' }}{{ message.name }}:
          </strong>
          {{ message.content }}

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
        <button @click="sendMessage">전송</button>
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
  background-color: #f8f9fa;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 8px;
}

.chat-room {
  margin-top: 20px;
}

.message-list {
  background-color: #ffffff;
  margin-bottom: 10px;
  max-height: 550px;
  height: 532px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.message-item {
  margin-bottom: 10px;
  cursor: pointer;
}

.chat-input {
  display: flex;
  align-items: center;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
}

.chat-input button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

.chat-input button:hover {
  background-color: #218838;
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