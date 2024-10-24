<template>
  <div class="chat-container">
    <div class="chat-room">
      <div class="title">
        실시간 채팅

        <!-- 티켓 아이콘: 쿠폰 등록 박스가 숨겨졌을 때 표시 -->
        <transition name="fade">
          <div 
            v-if="showTicketIcon"
            class="ticket-icon" 
            @click="toggleCouponBox"
            aria-label="쿠폰 등록 아이콘"
          >
            <v-icon class="mdi mdi-ticket-percent" style="font-size: 24px;"></v-icon>
          </div>
        </transition>

        <div class="participant-info">
          <v-icon class="mdi mdi-account-multiple" style="font-size: 18px"></v-icon>
          <span>{{ participantCount - 1 }}</span>
        </div>
      </div>
      
      <!-- 쿠폰 목록 모달 -->
      <div v-if="couponModalVisible" class="modal">
        <div class="modal-content">
          <h3>쿠폰 선택</h3>
          <br>
          <select v-model="selectedCouponId">
            <option disabled value="">쿠폰을 선택하세요</option>
            <option v-for="coupon in coupons" :key="coupon.id" :value="coupon.id">
              {{ coupon.couponName || coupon.name }}
            </option>
          </select>
          <div class="modal-buttons">
            <button @click="confirmSelectCoupon">선택</button>
            <button @click="closeCouponModal" class="close-button">닫기</button>
        </div>
        </div>
      </div>

      <!-- 쿠폰 등록 박스: message-list 외부에 고정 -->
      <transition name="fade">
        <div 
          v-if="showCouponBox" 
          class="coupon-register-box" 
          @click="handleCouponBoxClick"
          aria-label="쿠폰 박스"
        >
          <div v-if="isPublisher">
            <!-- 판매자용 내용 -->
            <div v-if="selectedCoupon">
              <div class="register-text">
                <span class="discount-percentage">{{ selectedCoupon.discountPercentage }}%</span> &nbsp; {{ selectedCoupon.couponName || selectedCoupon.name }}
              </div>
            </div>
            <div v-else>
              <!-- 쿠폰이 선택되지 않았을 때 기본 텍스트 -->
              <span class="register-text">쿠폰을 등록해주세요</span>
            </div>
          </div>
          <div v-else>
            <!-- 시청자용 내용 -->
            <div v-if="currentCoupon" class="coupon-info" @click="receiveCoupon" style="cursor: pointer;">
              <div class="register-text">
                <span class="discount-percentage">{{ currentCoupon.discountPercentage }}%</span> &nbsp; {{ currentCoupon.couponName }}
              </div>
            </div>
            <div v-else>
              <span class="register-text">쿠폰이 등록되지 않았습니다.</span>
            </div>
          </div>
          <button 
            class="close-btn" 
            @click.stop="hideCouponBox"
            aria-label="쿠폰 박스 닫기"
          >
            ✖
          </button>
        </div>
      </transition>

      <div class="message-list" ref="messageList">
        <div
          v-for="(message, index) in filteredMessages"
          :key="message.timestamp"
          class="message-item"
          @click="selectMessage(index)"
        >
          <div style="color: #7a7a7a; font-size: 14px;">
            {{ message.name }}{{ message.isOwner ? '📍' : '' }} &nbsp;&nbsp;&nbsp;&nbsp; 
            <span style="color: black;">{{ message.content }}</span>
          </div>
          <div v-if="isPublisher && selectedMessageIndex === index" class="dropdown-menu">
            <!-- memberId 또는 sellerId 중 하나를 선택하여 전달 -->
            <button @click.stop="openKickConfirmModal(message)" class="dropdown-item">
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

    <v-dialog v-model="kickSuccessModalVisible" max-width="350px">
      <v-card class="kick-modal">
        <v-card-text style="text-align: center;">성공적으로 강퇴되었습니다!</v-card-text>
        <v-card-actions>
          <v-btn class="kick-modal-btn" @click="closeKickSuccessModal" style="background-color: #BCC07B;">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="kickConfirmModalVisible" max-width="350px">
      <v-card class="kick-modal">
        <v-card-text style="text-align: center;">정말로 강퇴하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-btn class="kick-modal-btn" @click="confirmKick" style="background-color: #BCC07B;">확인</v-btn>
          <v-btn class="kick-modal-btn" @click="kickConfirmModalVisible = false" style="background-color: #e0e0e0;">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import axios from 'axios';
import '@mdi/font/css/materialdesignicons.css';

export default {
  props: {
    liveId: {
      type: String,
      required: true,
    },
    isPublisher: {
      type: Boolean,
      required: true,
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
      isKicked: false,
      selectedMessageIndex: null,
      kickSuccessModalVisible: false,
      kickConfirmModalVisible: false,
      messageToKick: null,
      kickedUserIds: [],
      participantCount: 0,
      couponModalVisible: false,
      coupons: [],
      currentCoupon: null,
      couponPopupVisible: false,
      showCouponRegister: true,
      showTicketIcon: false,
      showViewerCoupon: false,
      viewerCoupon: null,
      selectedCoupon: null,
      showCouponBox: true,
      selectedCouponId: '',
    };
  },
  async mounted() {
    this.token = localStorage.getItem('accessToken');
    this.memberId = localStorage.getItem('memberId') || null;
    this.sellerId = localStorage.getItem('sellerId') || null;
    this.senderName = localStorage.getItem('username');

    console.log('Token:', this.token);
    console.log('memberId:', this.memberId, 'sellerId:', this.sellerId, 'senderName:', this.senderName, 'isPublisher:', this.isPublisher);

    await this.checkIfKicked();

    if (!this.isKicked) {
      this.enterChatRoom();
    }

    if (!this.isPublisher) {
      await this.fetchCurrentCoupon();
    }
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
    this.removeClickOutsideListener();
  },
  computed: {
    filteredMessages() {
      return this.messages.filter(message => {
        const userId = message.memberId || message.sellerId;
        return !this.kickedUserIds.includes(userId);
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
        }, { sessionId: this.liveId });
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
          this.getParticipantCount();
          
          // 단일 쿠폰 브로드캐스트 구독
          this.stompClient.subscribe(`/topic/live/${this.liveId}/coupon`, (message) => {
            const receivedCoupon = JSON.parse(message.body);
            console.log('Received Coupon:', receivedCoupon);
            this.currentCoupon = receivedCoupon;
          });

          // 기존 채팅 메시지 구독
          this.stompClient.subscribe(`/topic/live/${this.liveId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            console.log('Received Message:', receivedMessage);
            // 쿠폰 메시지를 이미 별도로 구독하고 있으므로, 여기서는 텍스트 메시지만 처리
            this.messages.push(receivedMessage);
          });

          // 참여 인원을 받기 위한 구독
          this.stompClient.subscribe(`/topic/live/${this.liveId}/participants`, (message) => {
            const count = parseInt(message.body);
            this.participantCount = count;
          });

          // 강퇴 메시지를 받기 위한 구독
          const userId = this.memberId || this.sellerId;
          if (userId) {
            this.stompClient.subscribe(`/topic/live/${this.liveId}/kick`, (message) => {
              try {
                console.log('Kick message received:', message.body);
                const kickMessage = JSON.parse(message.body);
                console.log("kickMessage", kickMessage);
                if (kickMessage.kicked) {
                  this.handleKicked();
                }
                const kickedUserId = kickMessage.userId;
                if (kickedUserId === Number(userId)) {
                  this.kickedUserIds.push(kickedUserId);
                  this.messages = this.messages.filter(
                    msg => (msg.memberId || msg.sellerId) !== kickedUserId
                  );
                  this.$emit('kicked');
                  this.stompClient.disconnect(() => {
                    console.log("Kicked user WebSocket disconnected");
                  });
                }
              } catch (e) {
                console.error("Failed to parse kick message:", e);
              }
            });
          }
        },
        (error) => {
          console.error('WebSocket connection error:', error);
        }
      );
    },

    handleKicked() {
      console.log("User has been kicked");
      this.$emit('kicked');
    },

    disconnect() {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.disconnect(() => {
          console.log("WebSocket disconnected");
        });
      }
    },
    async checkIfKicked() {
      const userId = this.memberId || this.sellerId;
      if (userId) {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/chat/${this.liveId}/isKicked/${userId}`);
          this.isKicked = response.data;
          if (this.isKicked) {
            this.$emit('kicked');
          }
        } catch (error) {
          console.error('Error checking kick status:', error);
        }
      } else {
        this.isKicked = false;
      }
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

    async getParticipantCount() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/live/${this.liveId}/participants`);
        this.participantCount = response.data;
      } catch (error) {
        console.error('Error getting participant count:', error);
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
        this.removeClickOutsideListener();
      } else {
        this.selectedMessageIndex = index;
        this.addClickOutsideListener();
      }
    },

    openKickConfirmModal(message) {
      this.messageToKick = message;
      this.kickConfirmModalVisible = true;
      this.selectedMessageIndex = null;
      this.removeClickOutsideListener();
    },

    closeKickConfirmModal() {
      this.kickConfirmModalVisible = false;
      this.messageToKick = null;
    },

    confirmKick() {
      if (this.messageToKick) {
        this.kickUser(this.messageToKick.memberId, this.messageToKick.sellerId);
        this.kickConfirmModalVisible = false;
        this.selectedMessageIndex = null;
      }
    },

    isUserKicked(message) {
      const userId = message.memberId || message.sellerId;
      return this.kickedUserIds.includes(userId);
    },

    // userId과 sellerId를 함께 받아 적절한 userId 설정
    kickUser(memberId, sellerId) {
      const userId = memberId !== null ? memberId : sellerId;
      if (userId == null) {
        console.error("Cannot kick user: userId is null");
        return;
      }

      console.log("강퇴 요청 userId:", userId); // userId 값을 출력하여 확인
      axios.post(`${process.env.VUE_APP_API_BASE_URL}/live-service/chat/${this.liveId}/kick/${userId}`, null, {
        headers: {
          sellerId: Number(this.sellerId),
          Authorization: `Bearer ${this.token}`
        }
      })
        .then(() => {
          console.log(`${userId} 강퇴됨`);
          this.kickedUserIds.push(userId);
          this.showKickSuccessModal();
        })
        .catch(error => {
          console.error("강퇴 에러:", error);
        });
    },

    handleClick(message, event) {
      if(message.isOwner) {
        event.stopPropagation();
        return;
      }
    },

    showKickSuccessModal() {
      this.kickSuccessModalVisible = true;
      setTimeout(() => {
        this.kickSuccessModalVisible = false;
      }, 3000);
    },
    closeKickSuccessModal() {
      this.kickSuccessModalVisible = false;
    },

    // 쿠폰 모달 열기
    openCouponModal() {
      this.couponModalVisible = true;
      this.fetchCoupons();
    },
    // 쿠폰 목록 가져오기
    fetchCoupons() {
      axios.get(`${process.env.VUE_APP_API_BASE_URL}/order-service/coupon/list`, {
        headers: {
          sellerId: this.sellerId,
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then(response => {
        console.log('Coupons API Response:', response.data);
        this.coupons = response.data;
      })
      .catch(error => {
        console.error('Error fetching coupons:', error);
      });
    },
    // 쿠폰 선택 처리
    selectCoupon(coupon) {
      console.log('선택한 쿠폰:', coupon);
      // WebSocket을 통해 시청자들에게 쿠폰 정보 전송
      const message = {
        type: 'COUPON',
        couponId: coupon.id,
        couponName: coupon.couponName || coupon.name,
        // 필요한 다른 쿠폰 정보들
      };
      // 백엔드의 @MessageMapping("/chat/{sessionId}/sendMessage")와 일치하도록 수정
      this.stompClient.send(`/app/chat/${this.liveId}/sendMessage`, JSON.stringify(message));
      this.selectedCoupon = coupon;
      this.couponModalVisible = false;
    },
    // 쿠폰 모달 닫기
    closeCouponModal() {
      this.couponModalVisible = false;
    },
    // 쿠폰 팝업 표시
    showCouponPopup(couponMessage) {
      // 쿠폰 정보를 저장하고 팝업을 표시
      this.currentCoupon = couponMessage;
      this.couponPopupVisible = true;
    },
    // 쿠폰 받기 처리
    receiveCoupon() {
      const userId = this.memberId || this.sellerId;
      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }
      axios.post(`${process.env.VUE_APP_API_BASE_URL}/order-service/coupon/${this.currentCoupon.couponId}/download`, null, {
        headers: {
          myId: userId,
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then(() => {
        alert('쿠폰이 발급되었습니다!');
        this.showCouponBox = false;
      })
      .catch(error => {
        console.error('Error downloading coupon:', error);
        alert(error.response.data);
      });
    },

    hideCouponRegister() {
      this.showCouponRegister = false;
      this.showTicketIcon = true;
    },

    showCouponRegisterBox() {
      this.showCouponRegister = true;
      this.showTicketIcon = false;
    },

    // 시청자 쿠폰 정보 가져오기
    async fetchViewerCoupon(couponId) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/order-service/coupon/${couponId}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.viewerCoupon = response.data;
        this.showViewerCoupon = true;
      } catch (error) {
        console.error('Error fetching viewer coupon:', error);
      }
    },

    toggleCouponBox() {
      this.showCouponBox = true;
      this.showTicketIcon = false;
    },

    handleCouponBoxClick() {
      if (this.isPublisher) {
        this.openCouponModal();
      } else {
        // 시청자용 동작 필요 시 추가
      }
    },

    hideCouponBox(event) {
      event.stopPropagation();
      this.showCouponBox = false;
      this.showTicketIcon = true;
    },

    async fetchCurrentCoupon() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/live-service/live/${this.liveId}/coupon`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.currentCoupon = response.data;
      } catch (error) {
        console.error('Error fetching current coupon:', error);
        this.currentCoupon = null;
      }
    },

    confirmSelectCoupon() {
      const coupon = this.coupons.find(c => c.id === this.selectedCouponId);
      if (coupon) {
        this.selectCoupon(coupon);
        this.selectedCouponId = ''; // 선택 초기화
      } else {
        alert('유효한 쿠폰을 선택해주세요.');
      }
    },

    handleClickOutside(event) {
      if (this.selectedMessageIndex !== null) {
        const selectedMessageElement = this.$refs.messageList.children[this.selectedMessageIndex];
        if (selectedMessageElement) {
          const isInsideDropdown = selectedMessageElement.querySelector('.dropdown-menu').contains(event.target);
          const isInsideMessageItem = selectedMessageElement.contains(event.target);
          if (!isInsideDropdown && !isInsideMessageItem) {
            this.selectedMessageIndex = null;
            this.removeClickOutsideListener();
          }
        }
      }
    },

    // 전역 클릭 리스너 추가
    addClickOutsideListener() {
      document.addEventListener('click', this.handleClickOutside);
    },

    // 전역 클릭 리스너 제거
    removeClickOutsideListener() {
      document.removeEventListener('click', this.handleClickOutside);
    },
  },
};
</script>

<style scoped>
.chat-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 87vh;
  background-color: white;
  padding-top: 5%;
  padding-left: 4%;
}

.chat-room {
  flex: 1;
  margin-bottom: 10px;
  padding-top: 14px;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 10px;
  position: relative; /* 부모 컨테이너에 상대 위치 설정 */
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 3%;
  font-size: 15px;
}

.participant-info {
  display: flex;
  align-items: center;
  margin-right: 10px;
  min-width: 40px;
  justify-content: flex-end;
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

.coupon-register-box {
  position: absolute;
  top: 60px;
  right: 20px;
  width: 420px;
  height: 60px;
  padding: 15px;
  background-color: white;
  border: 2px solid white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  z-index: 999;
  transform-origin: top right; /* 애니메이션 시작점 설정 */
}

.coupon-register-box:hover {
  background-color: rgba(249, 249, 249, 1);
}

.register-btn {
  padding: 6px 12px;
  background-color: #BCC07B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.register-btn:hover {
  background-color: #a8b05b;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #888;
}

.close-btn:hover {
  color: #555;
}

.message-item {
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
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

.unclickable {
  pointer-events: none;  /* 개설자는 클릭 이벤트 비활성화 */
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  border-radius: 8px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
}

.modal-content select {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
}

.modal-buttons button {
  padding: 8px 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
}

.modal-buttons button.close-button {
  background-color: #cccccc;
  color: black;
}

.modal-buttons button.close-button:hover {
  background-color: #8e8e8e;
}

.modal-buttons button:not(.close-button) {
  background-color: #BCC07B;
  color: #000000;
}

.modal-buttons button:not(.close-button):hover {
  background-color: #a8b05b;
}
.mdi-account-multiple {
  width: 5px;
  height: 5px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.ticket-icon {
  position: absolute;
  top: 60px;
  right: 20px;
  z-index: 1000;
  cursor: pointer;
}
.register-text {
  font-size: 16px;
  color: #333;
  margin-right: 10px;
  flex-grow: 1;
}
.coupon-info {
  display: flex;
  align-items: center;
}
.discount-percentage {
  background-color: #BCC07B;
  padding: 4px;
  border-radius: 50px;
  color: black;
}
.coupon-box-transition-enter-active,
.coupon-box-transition-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.coupon-box-transition-enter,
.coupon-box-transition-leave-to {
  transform: scale(0);
  opacity: 0;
  transform-origin: top right;
}
.kick-modal {
  background-color: rgb(255, 255, 255);
  border: none;
  box-shadow: none;
  border-radius: 10px;
}
.kick-modal-btn {
  margin-left: 2px;
  margin-top: -10px;
  border-radius: 50px;
  width: 50px;
  color: black;
}
</style>
