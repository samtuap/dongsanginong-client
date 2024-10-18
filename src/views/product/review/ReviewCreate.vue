<template>
  <v-dialog v-model="dialog" max-width="480" class="custom-dialog">
    <v-card class="custom-card">
      <v-card-title class="custom-title" style="margin-top: 20px;">
        리뷰 생성
      </v-card-title>
      <v-card-text>
        <div class="review-form">
          <!-- 리뷰 설명 -->
          <div class="input-section label-and-rating">
            <label for="rating-text">이 상품 어떠셨나요?</label>
            <!-- 별점 -->
            <v-rating v-model="review.rating" background-color="grey lighten-2" color="yellow" large length="5" rounded
              class="custom-rating" />
          </div>

          <!-- 후기에 대한 요약 -->
          <div class="input-section input-summary">
            <label for="summary">어떤 점이 좋았나요?</label>
            <input type="text" v-model="review.title" id="summary" placeholder="후기 요약" required class="custom-input" />
          </div>

          <!-- 후기에 대한 내용 -->
          <div class="input-section input-content" style="margin-top: -30px;">
            <textarea v-model="review.contents" id="content" placeholder="후기 내용을 입력하세요" required class="custom-input" />
          </div>

          <!-- 이미지 첨부 -->
          <div class="file-upload">
            <label for="file">사진 첨부</label>
            <div @click="$refs.fileInput.click()" class="file-upload-box">
              <v-icon>mdi-plus</v-icon>
            </div>
            <input type="file" ref="fileInput" class="hidden" @change="handleFileSelection" multiple />
          </div>

          <!-- 선택된 파일 미리보기 -->
          <div v-if="filePreviews.length">
            <h3>선택된 파일:</h3>
            <ul class="preview-list">
              <li v-for="(preview, index) in filePreviews" :key="index" class="preview-container">
                <div class="image-wrapper">
                  <img :src="preview.url" class="preview-image" alt="선택된 이미지" />
                  <v-btn icon @click="removeFile(index)" class="remove-btn">
                    <v-icon color="#BCC07B">mdi-close-circle</v-icon>
                  </v-btn>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 등록 및 닫기 버튼 -->
        <v-card-actions class="action-buttons">
          <v-spacer />
          <v-btn @click="validateAndSubmit" class="custom-button">
            등록
          </v-btn>
          <v-btn @click="showConfirmCloseModal" class="custom-cancel-button">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- 에러 모달 -->
  <v-dialog v-model="alertModal" max-width="260px">
    <v-card class="modal" style="padding: 10px; padding-right: 20px; text-align: center;">
      <v-card-text>{{ alertMessage }}</v-card-text>
      <v-btn @click="alertModal = false;" class="submit-btn">확인</v-btn>
    </v-card>
  </v-dialog>

  <!-- 성공 모달 -->
  <v-dialog v-model="successModal" max-width="260px">
    <v-card class="modal" style="padding: 10px; padding-right: 20px; text-align: center;">
      <v-card-text>등록이 완료되었습니다.</v-card-text>
      <v-btn @click="closeModals" class="submit-btn">확인</v-btn>
    </v-card>
  </v-dialog>

  <!-- 닫기 확인 모달 -->
  <v-dialog v-model="confirmCloseModal" max-width="210px">
    <v-card class="modal" style="text-align: center;">
      <v-card-text>정말 닫으시겠습니까?</v-card-text>
      <v-card-actions class="action-buttons" style="justify-content: center;">
        <v-btn @click="closeModalAndReset" class="custom-button">닫기</v-btn>
        <v-btn @click="confirmCloseModal = false" class="custom-cancel-button">취소</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    packageProductId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      review: {
        rating: 0,
        title: '',
        contents: '',
        imageUrls: [],
      },
      dialog: false,
      selectedPackageProductId: null, // 선택된 패키지 상품 ID를 저장
      selectedFiles: [],
      filePreviews: [],
      alertModal: false,
      alertMessage: '',
      successModal: false,
      confirmCloseModal: false, // 닫기 확인 모달 상태
    };
  },
  methods: {
    // openDialog 메서드가 packageProductId를 인자로 받도록 수정
    openDialog(packageProductId) {
      this.selectedPackageProductId = packageProductId; // 전달받은 ID 저장
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    showConfirmCloseModal() {
      this.confirmCloseModal = true;  // 닫기 버튼 클릭 시 확인 모달 열기
    },
    handleFileSelection(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        this.selectedFiles.push(file);
        const previewUrl = URL.createObjectURL(file);
        this.filePreviews.push({ url: previewUrl, file });
      });
      this.$refs.fileInput.value = null;
    },
    removeFile(index) {
      this.selectedFiles.splice(index, 1);
      this.filePreviews.splice(index, 1);
    },
    async uploadFiles() {
      const uploadedImageUrls = [];
      for (let file of this.selectedFiles) {
        const imageUrl = await this.uploadImage(file);
        uploadedImageUrls.push(imageUrl);
      }
      this.review.imageUrls = uploadedImageUrls;
    },
    async uploadImage(blob) {
      const accessToken = localStorage.getItem('accessToken');
      const body = {
        prefix: "review",
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

      const getUrlResult = await getUrl.text();
      const awsUrl = {
        data: `${getUrlResult.split("?")[0]}`,
        auth: `?${getUrlResult.split("?")[1]}`,
      };

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": blob.type,
        },
        body: blob,
      };
      await fetch(awsUrl.data + awsUrl.auth, options);

      return awsUrl.data;
    },
    async createReview() {
      await this.uploadFiles();

      const requestData = {
        title: this.review.title,
        contents: this.review.contents,
        rating: this.review.rating,
        imageUrls: this.review.imageUrls,
      };

      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/product-service/reviews/${this.selectedPackageProductId}/create`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === '이 상품에 대한 리뷰는 이미 존재합니다.') {
            this.alertMessage = errorData.message; // 에러 메시지를 모달에 출력
            this.alertModal = true;
          }
        } else {
          this.successModal = true; // 성공 시 성공 모달 열기
        }
      } catch (error) {
        console.error('리뷰 생성 실패:', error);
        this.alertMessage = '리뷰 생성 중 오류가 발생했습니다.';
        this.alertModal = true; // 에러 모달 열기
      }
    },
    validateAndSubmit() {
      if (!this.review.rating || !this.review.title || !this.review.contents) {
        this.alertMessage = "모든 필드를 입력해 주세요.";
        this.alertModal = true; // 에러 모달 열기
      } else {
        this.createReview();
      }
    },
    closeModals() {
      this.successModal = false;
      this.dialog = false; // 성공 후 모든 모달 닫기
    },
    closeModalAndReset() {
      // 확인 후 닫기 시 동작
      this.review.rating = 0;
      this.review.title = '';
      this.review.contents = '';
      this.selectedFiles = [];
      this.filePreviews = [];
      this.dialog = false; // 모달 닫기
      this.confirmCloseModal = false; // 닫기 확인 모달도 닫기
    }
  },
};
</script>

<style scoped>
.review-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
}

/* 간격 조정 */
.label-and-rating {
  display: flex;
  flex-direction: column;
  gap: -100px;
  /* 별점과 라벨 사이의 간격 줄임 */
}

.input-content {
  margin-bottom: 10px;
  /* 요약과 내용 간의 간격을 줄임 */
}

.input-summary {
  margin-bottom: 15px;
  margin-top: 5px;
}

.custom-input {
  width: 100%;
  padding: 0.4em;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
}

textarea.custom-input {
  resize: vertical;
  min-height: 100px;
}

/* 별 크기 10% 확대 */
::v-deep .custom-rating .v-icon {
  font-size: 40px !important;
  /* 별 크기를 40px로 설정 */
  width: 40px !important;
  /* 별의 너비 설정 */
  height: 40px !important;
  /* 별의 높이 설정 */
}

.file-upload-box {
  width: 80px;
  height: 80px;
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.hidden {
  display: none;
}

.preview-list {
  display: flex;
  gap: 10px;
  list-style-type: none;
  padding-left: 0;
}

.preview-container {
  position: relative;
}

.image-wrapper {
  width: 80px;
  height: 80px;
}

.preview-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: black;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-title {
  background-color: #BCC07B;
  border-radius: 30px;
  text-align: center;
  width: calc(97% - 30px);
  margin: 0 auto;
  padding: 10px;
}

.custom-button {
  background-color: #BCC07B;
  color: black;
  border-radius: 30px;
  padding: 10px 30px;
  font-size: 13px;
  font-weight: bold;
  line-height: 1.5;
}

.custom-cancel-button {
  background-color: #e0e0e0;
  color: black;
  border-radius: 30px;
  padding: 10px 30px;
  font-size: 13px;
  font-weight: bold;
  line-height: 1.5;
}

.modal {
  background-color: rgb(255, 255, 255);
  border: none;
  box-shadow: none;
  border-radius: 10px;
}

.submit-btn {
  margin-left: 10px;
  margin-top: 8px;
  background-color: #BCC07B;
  color: black;
  border-radius: 50px;
}

.open-modal-btn {
  background-color: #BCC07B;
  color: black;
  padding: 10px 20px;
  border-radius: 30px;
}
</style>
