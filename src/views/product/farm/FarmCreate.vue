<template>
  <div class="farm-create-page">
    <h2 class="title">농장 정보 입력</h2>

    <!-- 배너 이미지 업로드 -->
    <div class="image-upload banner-upload">
      <img :src="bannerImageUrl || defaultBanner" alt="배너 이미지" class="banner-image" @click="triggerBannerUpload" />
      <input type="file" @change="onBannerImageUpload" class="image-input" ref="bannerInput" accept="image/*" />

      <!-- 배너 이미지 위에 + 모양 버튼 추가 -->
      <div class="upload-button banner-upload-button" @click="triggerBannerUpload">+</div>

      <!-- 프로필 이미지 업로드: 배너 이미지 위에 겹치도록 변경 -->
      <div class="profile-upload-wrapper">
        <img :src="profileImageUrl || defaultProfile" class="profile-image" @click="triggerProfileUpload" />
        <input type="file" @change="onProfileImageUpload" class="image-input" ref="profileInput" accept="image/*" />

        <!-- 프로필 이미지 위에 + 모양 버튼 추가 -->
        <div class="upload-button profile-upload-button" @click="triggerProfileUpload">+</div>
      </div>
    </div><br>

    <input type="text" v-model="farmName" placeholder="농장 이름을 입력해주세요." class="farm-name-input" /><br>

    <!-- 선택한 카테고리 공간 -->
    <div class="selected-category-space">
      <h4 class="left-align">선택된 카테고리</h4><br />
      <div v-show="true" class="selected-categories">
        <span v-for="categoryId in selectedCategories" :key="categoryId" class="category-chip">
          {{ getCategoryName(categoryId) }}
          <button @click="removeCategory(categoryId)">
            <span style="font-size: 12px;">X</span></button>
        </span>
      </div>
    </div>
    <br />

    <!-- 농장 카테고리 선택 -->
    <div class="category-selection">
      <h4 class="left-align">농장 카테고리 선택</h4><br />
      <div class="category-list">
        <button v-for="category in categories" :key="category.id"
                @click="selectCategory(category.id)"
                class="category-button"
                :class="{selected: selectedCategories.includes(category.id)}">
          {{ category.title }}
        </button>
      </div>
    </div>
    <br />

    <!-- 농장 설명 -->
    <div class="farm-intro">
      <h4 class="left-align">농장 설명을 적어주세요.</h4><br />
      <textarea v-model="farmIntro" class="intro-textarea"></textarea>
    </div>

    <!-- 제출 버튼 -->
    <button @click="submitFarm" class="submit-button">저장</button>
  </div>

  <!-- Cropper Modal -->
  <v-dialog v-model="cropModal" max-width="800px">
    <v-card class="modal" style="padding: 10px; text-align: center;">
      <v-card-text>
        <div class="cropper-container flex">
          <div class="cropper-image-container w-3/4">
            <img ref="cropperImage" :src="cropImageSrc" alt="Cropper Image" style="max-width: 100%;" />
          </div>
          <div class="cropper-preview-container w-1/4">
            <h4>프리뷰</h4>
            <div class="preview overflow-hidden w-full h-32 bg-gray-200"></div>
          </div>
        </div>

        <div v-if="loading" class="loading-message" style="color: gray; margin-top: 20px;">
          이미지를 처리하고 있습니다...
        </div>
      </v-card-text>
      <div class="cropper-controls">
        <button @click="saveCrop" class="cropper-control-btn save-btn" :disabled="loading">저장</button>
        <button @click="cancelCrop" class="cropper-control-btn cancel-btn" :disabled="loading">취소</button>
      </div>
    </v-card>
  </v-dialog>

  <!-- 완료 모달 -->
  <v-dialog v-model="alertModal" max-width="260px">
    <v-card class="modal" style="padding: 15px; padding-right: 20px; text-align: center;">
      <v-card-text>완료되었습니다.</v-card-text>
      <v-btn @click="closeModalAndRedirect" class="submit-btn" style="margin-top: -2px;">close</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  data() {
    return {
      farmName: '',
      farmIntro: '',
      bannerImageUrl: '', // 업로드된 배너 이미지 URL
      profileImageUrl: '', // 업로드된 프로필 이미지 URL
      projectImageFile: null, // 업로드할 이미지 파일
      categories: [], // 카테고리 목록
      selectedCategories: [], // 선택한 카테고리
      defaultBanner: '/baseBannerImage.png', // 기본 배너 이미지
      defaultProfile: '', // 기본 프로필 이미지
      alertModal: false,

      // Cropper 관련 데이터
      cropModal: false,
      cropImageSrc: '',
      cropper: null,
      loading: false,
    };
  },
  created() {
    // 카테고리 목록 불러오기 (API 요청)
    this.loadCategories();
  },
  methods: {
    async uploadImage(blob) {
      const accessToken = localStorage.getItem('accessToken');
      const body = {
        prefix: "Farm",
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

    async onBannerImageUpload(event) {
      const file = event?.target?.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.cropImageSrc = e.target.result;
          this.cropModal = true;
        };
        reader.readAsDataURL(file);
        this.projectImageFile = file;
      }
    },

    async onProfileImageUpload(event) {
      this.projectImageFile = event?.target?.files[0];
      this.profileImageUrl = await this.uploadImage(this.projectImageFile);
    },

    triggerProfileUpload() {
      this.$refs.profileInput.click();
    },

    triggerBannerUpload() {
      this.$refs.bannerInput.click();
    },

    async loadCategories() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/categories`); // 카테고리 API
        this.categories = response.data;
      } catch (error) {
        console.error('카테고리 불러오기 실패:', error);
      }
    },

    selectCategory(categoryId) {
      if (!this.selectedCategories.includes(categoryId)) {
        this.selectedCategories.push(categoryId);
      }
    },

    removeCategory(categoryId) {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    },

    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.title : '';
    },

    closeModalAndRedirect() {
      this.alertModal = false; // 모달을 닫기
      this.$router.push('/'); // 페이지 이동
    },

    async submitFarm() {
      try {
        const farmData = {
          farmName: this.farmName,
          farmIntro: this.farmIntro,
          bannerImageUrl: this.bannerImageUrl, // 업로드된 배너 이미지 URL
          profileImageUrl: this.profileImageUrl, // 업로드된 프로필 이미지 URL
          categories: this.selectedCategories,
        };

        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/product-service/farm/create`, farmData);
        this.alertModal = true; // 모달을 표시
      } catch (error) {
        console.error('농장 생성 실패:', error);
        alert(error.response?.data?.message || "농장 생성 중 문제가 발생했습니다.");
      }
    },

    // Cropper Methods
    initializeCropper() {
      const image = this.$refs.cropperImage;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 3 / 1, // 고정된 비율 설정 (예: 1200x400)
        viewMode: 2, // Crop 박스가 캔버스 내에 제한되도록 설정
        dragMode: 'crop', // 초기 드래그 모드를 'crop'으로 설정
        preview: '.preview', // 프리뷰 클래스 지정
        autoCrop: true, // 자동 크롭 활성화
        autoCropArea: 1.0, // 자동 크롭 영역 크기 (80%)
        movable: false, // 이미지 이동 비활성화
        zoomable: false, // 이미지 확대/축소 비활성화
        rotatable: false, // 이미지 회전 비활성화
        scalable: false, // 이미지 스케일링 비활성화
        cropBoxMovable: true, // 크롭 박스 이동 가능
        cropBoxResizable: false, // 크롭 박스 크기 조절 불가
        modal: true, // 모달 배경 표시
        guides: true, // 크롭 박스 가이드 표시
        center: true, // 중앙 표시기 표시
        highlight: true, // 크롭 박스 강조 표시
        background: true, // 그리드 배경 표시
        responsive: true, // 창 크기 변경 시 반응형 처리
        checkCrossOrigin: true, // 크로스 오리진 이미지 체크
        checkOrientation: true, // 이미지의 Exif Orientation 정보 체크
        ready() {
          console.log("Cropper is ready");
          // 크롭 박스를 중앙에 고정
          const cropperData = this.cropper.getCropBoxData();
          const containerData = this.cropper.getContainerData();
          this.cropper.setCropBoxData({
            left: (containerData.width - cropperData.width) / 2,
            top: (containerData.height - cropperData.height) / 2,
            width: cropperData.width,
            height: cropperData.height
          });
        },
      });
    },

    saveCrop() {
      if (this.cropper) {

        this.loading = true;

        const dpr = window.devicePixelRatio || 1;

        // getCroppedCanvas를 사용하여 크롭된 이미지의 캔버스를 가져옵니다.
        const croppedCanvas = this.cropper.getCroppedCanvas({
          width: this.cropper.getCroppedCanvas().width * dpr,
          height: this.cropper.getCroppedCanvas().height * dpr,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
          // 크롭 박스의 원본 해상도를 유지하도록 설정 (너비와 높이를 지정하지 않음)
        });

        // 캔버스가 정상적으로 생성되었는지 확인
        if (croppedCanvas) {
          const ctx = croppedCanvas.getContext('2d');
          ctx.scale(dpr, dpr);

          croppedCanvas.toBlob(async (blob) => {
            // PNG 포맷 사용하여 이미지 품질 유지
            const croppedFile = new File([blob], this.projectImageFile.name, { type: 'image/png' });
            const uploadedUrl = await this.uploadImage(croppedFile);
            this.bannerImageUrl = uploadedUrl;
            this.loading = false;
            this.cropModal = false;
            this.cropper.destroy();
            this.cropper = null;
          }, 'image/png', 1);
        }
      }
    },

    cancelCrop() {
      this.cropModal = false;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
    },

    zoomIn() {
      if (this.cropper) {
        this.cropper.zoom(0.2);
      }
    },

    zoomOut() {
      if (this.cropper) {
        this.cropper.zoom(-0.2);
      }
    },

    resetCrop() {
      if (this.cropper) {
        this.cropper.reset();
      }
    },
  },
  watch: {
    cropModal(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.initializeCropper();
        });
      } else {
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = null;
        }
      }
    },
  },
};
</script>

<style scoped>
.farm-create-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.image-upload {
  margin-bottom: 20px;
  text-align: center;
  position: relative; /* 배너 위에 프로필을 겹치기 위해 상대 위치 지정 */
}

.banner-upload img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  position: relative;
  border: 1px solid #ccc;
  image-rendering: crisp-edges;
}

.profile-upload-wrapper {
  position: absolute;
  bottom: -70px;
  left: 10%;
  transform: translateX(-50%); /* 가로 중앙 정렬 */
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #5f5f5f; /* 배경색 */
  border: 1px solid #ccc;
}

.profile-upload-wrapper img {
  background-color: #5f5f5f;
  width: 110%;
  height: 110%;
  object-fit: cover;
}

.image-input {
  display: none;
}

/* + 모양 버튼 스타일 */
.upload-button {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: lightgray;
  color: white;
  font-size: 24px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
  line-height: 30px;
}

.banner-upload-button {
  top: 120px;
  right: 370px;
}

.profile-upload-button {
  bottom: 43px;
  right: 44px;
}

.farm-name-input {
  width: calc(100% - 150px); /* 프로필 이미지와 수평을 맞추기 위해 너비를 조정 */
  padding: 10px;
  font-size: 16px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-left: 152px; /* 프로필 이미지 크기에 맞게 왼쪽으로 마진을 설정 */
  position: relative; /* 상대 위치 설정 */
  top: -30px; /* 위로 이동 */
}

.selected-category-space {
  margin-bottom: 20px;
  text-align: center;
}

.selected-categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
  background-color: #f0f0f0;  
  border-radius: 8px;
  border: 1px solid #ccc;
  min-height: 70px; /* 초기 높이를 설정합니다 */
  overflow: visible; /* 스크롤이 생기지 않게 설정합니다 */
}

.category-chip {
  background-color: #BCC07B;
  padding: 5px 10px;
  border-radius: 20px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 양쪽에 텍스트와 버튼을 배치 */
  color: white;
}

.category-chip button {
  margin-left: 8px;
  background-color: #FFE2A6;
  border: none;
  border-radius: 50%;
  color: black;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center; /* X 버튼을 중앙에 위치 */
}

.category-selection {
  margin-bottom: 20px;
  text-align: center;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.category-button {
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #e0e0e0;
  padding: 5px 10px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.category-button.selected {
  background-color: #BCC07B;
  color: black;
}

.farm-intro {
  margin-bottom: 20px;
  text-align: center;
}

.intro-textarea {
  width: 100%;
  height: 200px;
  padding: 10px;
  font-size: 16px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.submit-button {
  background-color: #bcc07b;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}

.profile-image {
  top: -2%;
  right: 2%;
}

.left-align {
  text-align: left;
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

/* Cropper Controls */
.cropper-controls {
  display: flex;
  justify-content: center;
  gap: 10px; /* 버튼 사이의 간격을 추가 */
  margin-top: 10px;
}

.cropper-control-btn {
  color: black;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn {
  background-color: #bcc07b;
}

.save-btn:hover {
  background-color: #a8b05b;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: black;
}

.cancel-btn:hover {
  background-color: #c0c0c0;
}
/* Cropper Modal Layout */
.cropper-container {
  display: flex;
  justify-content: space-between;
}

.cropper-image-container {
  flex: 3;
}

.cropper-preview-container {
  flex: 1;
  text-align: center;
}

.preview {
  width: 100%;
  height: 200px; /* 프리뷰 높이 조정 */
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #e0e0e0;
  overflow: hidden; /* 이미지가 컨테이너를 벗어나지 않도록 설정 */
}

.loading-message {
  font-size: 14px;
  color: #666;
}
</style>
