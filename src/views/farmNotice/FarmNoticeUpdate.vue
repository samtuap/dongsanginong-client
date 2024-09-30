<template>
    <div>
      <h1>공지사항 수정</h1>
      <v-btn @click="dialog = true">공지 수정</v-btn> <!-- 버튼 클릭 시 모달 열림 -->
  
      <!-- 모달 -->
      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-card-title>
            <span class="headline">커뮤니티</span>
          </v-card-title>
          <v-card-text>
            <form @submit.prevent="updateNotice">
              <div>
                <input 
                  type="text" 
                  v-model="notice.title" 
                  id="title" 
                  placeholder="제목을 입력하세요" 
                  required 
                  class="custom-input" />
              </div>
              <div>
                <textarea 
                  v-model="notice.content" 
                  id="content" 
                  placeholder="내용을 입력하세요" 
                  required 
                  class="custom-input"></textarea>
              </div>
              <div> <!-- 갓세정님께 이미지 받는법 배워서 변경 예정 -->
                <input 
                  type="text" 
                  v-model="notice.imageUrls" 
                  id="imageUrls" 
                  placeholder="이미지 URL들을 쉼표로 구분하여 입력하세요"
                  class="custom-input" />
              </div>
            </form>
          </v-card-text>
          
          <v-card-actions class="action-buttons">
            <v-spacer />
            <v-btn 
              color="light_green" 
              class="custom-button"
              @click="updateNotice"
            >
              수정
            </v-btn>
            <v-btn 
              color="light_green" 
              class="custom-button"
              text 
              @click="dialog = false"
            >
              닫기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- 결과 모달 -->
      <v-dialog v-model="resultDialog" max-width="290">
        <v-card>
          <v-card-title>
            <span class="headline">커뮤니티</span>
          </v-card-title>
          <v-card-text>
            <p>{{ message }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="resultDialog = false">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        notice: {
          title: '',
          content: '',
          imageUrls: ''
        },
        dialog: false, // 공지사항 수정 모달 상태
        resultDialog: false, // 결과 모달 상태
        message: '' // 결과 메시지
      };
    },
    methods: {
      async updateNotice() {
        const requestData = {
          title: this.notice.title,
          content: this.notice.content,
          imageUrls: this.notice.imageUrls ? this.notice.imageUrls.split(',').map(url => url.trim()) : []
        };
  
        const token = localStorage.getItem('Bearer Token');
        const noticeId = 6; // 수정할 공지의 ID(추후 공지 디테일목록이 나오면 그떄 변경 예정)
  
        try {
          const response = await axios.put(`http://localhost:8080/product-service/farm/notice/${noticeId}/update`, requestData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Notice updated:', response.data);
          this.message = '공지사항이 성공적으로 수정되었습니다.'; // 성공 메시지 설정
        } catch (error) {
          console.error('Error updating notice:', error.response ? error.response.data : error.message);
          this.message = '공지사항 수정에 실패했습니다.'; // 실패 메시지 설정
        } finally {
          this.dialog = false; // 공지사항 수정 모달 닫기
          this.resultDialog = true; // 결과 모달 열기
        }
      },
    },
  };
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
  
  button {
    margin-top: 1em;
  }
  
  .custom-input {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ccc; /* 테두리 추가 */
    border-radius: 4px; /* 모서리 둥글게 */
    box-sizing: border-box;
    font-size: 1em;
  }
  
  textarea.custom-input {
    resize: vertical; /* 텍스트 영역 크기 조정 가능 */
    min-height: 300px; /* 텍스트 영역 최소 높이 설정 */
  }
  
  .action-buttons {
    margin-bottom: 30px; /* 버튼들을 30px 위로 올림 */
    gap: 10px; /* 버튼 간격 조정 */
  }
  
  .custom-button {
    color: black !important; /* 텍스트 색상 검정으로 설정 */
    transition: background-color 0.3s ease; /* 배경색 변경 시 부드럽게 전환 */
    border-radius: 50px; /* 모서리 둥글기 50px로 설정 */
  }
  
  .custom-button:hover {
    background-color: #BCC07B; /* 마우스 호버 시 배경색 변경 */
  }
  </style>
  