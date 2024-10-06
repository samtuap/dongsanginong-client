<template>
    <div class="chat-container">
      <div class="chat-room">
        <h3>{{ liveId }} 채팅방</h3>
        <div class="message-list">
          <div
            v-for="message in messages"
            :key="message.timestamp"
            class="message-item"
          >
            <!-- 방송자(sellerId가 개설자와 동일한 경우)를 비교하여 왕관 표시 -->
            <strong :style="{ color: message.sellerId === currentSellerId ? 'red' : 'black' }">
              {{ message.sellerId === currentSellerId ? '👑 ' : '' }}{{ message.name }}:
            </strong>
            {{ message.content }}
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
  
  export default {
    props: {
      liveId: {
        type: String,
        required: true,
      },
      currentSellerId: {
        type: String, // 개설자의 sellerId를 받음
        required: true
      }
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
        isPublisher: false,
      };
    },
    async mounted() {
      this.token = localStorage.getItem('accessToken');
      this.memberId = localStorage.getItem('memberId');
      this.sellerId = localStorage.getItem('sellerId');
      this.senderName = localStorage.getItem('username');
  
      console.log('Token:', this.token);
      console.log('memberId:', this.memberId, 'sellerId:', this.sellerId, 'senderName:', this.senderName, 'isPublisher:', this.isPublisher);
  
      this.enterChatRoom();
    },
    methods: {
      enterChatRoom() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
  
        this.messages = [];
        const socket = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/live-service/ws`);
        this.stompClient = Stomp.over(socket);
  
        const headers = {
          Authorization: `Bearer ${this.token}`,
          memberId: this.memberId,
          sellerId: this.sellerId,
          sessionId: this.liveId
        };
  
        this.stompClient.connect(
          headers,
          () => {
            this.subscription = this.stompClient.subscribe(`/topic/live/${this.liveId}`, (message) => {
              const receivedMessage = JSON.parse(message.body);
              console.log('Received Message:', receivedMessage);
              this.messages.push(receivedMessage);
            });
          },
          (error) => {
            console.error('WebSocket connection error:', error);
          }
        );
      },
  
      sendMessage() {
        if (this.stompClient && this.chatMessage.trim() !== '') {
          const message = {
            memberId: this.memberId,
            sellerId: this.sellerId,
            liveId: this.liveId,
            content: this.chatMessage,
            name: this.senderName,
            isSeller: this.isPublisher,  // 방송자 여부 추가
            type: 'TEXT',
          };
  
          this.stompClient.send(`/app/chat/${this.liveId}/sendMessage`, JSON.stringify(message));
          this.chatMessage = '';
          console.log("currentSellerId:", this.currentSellerId);
          console.log("Sending message with sellerId:", this.sellerId);
          console.log("Received message sellerId:", message.sellerId);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chat-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .chat-room {
    margin-top: 20px;
  }
  
  .message-list {
    margin-bottom: 20px;
    max-height: 300px;
    overflow-y: scroll;
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 5px;
  }
  
  .message-item {
    margin-bottom: 10px;
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
  </style>
  