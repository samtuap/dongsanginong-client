<template>
    <footer app absolute="false" class="footer">
      <div class="inner">
        <div class="copyright">
          <div class="logo"></div>
          <p class="addr">
            <span class="gray">(03045) 서울 동작구 보라매로 87</span>
            대표전화 02.1234.5678<span class="gap"></span>대표팩스 02.5678.1234<span
              class="gap"
            ></span
            >이메일 dongsanginong@gmail.com
          </p>
          <p class="copy">Copyright 2024 © dongsanginong. all rights reserved.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "FooterComponent",
    data() {
      return {
        // logo: require("@/assets/images/ico_logo.png"),
        isLogin: false, // 초기값 설정
      };
    },
  };
  </script>
  
  <style scoped>
  .footer {
    margin: 0;
    /*border-top: 1px solid #afafaf !important;*/
    padding: 0 !important;
    z-index: 0 !important;
    background-color:#ffffff;
  }
  .footer .inner {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    padding: 30px 20px;
    justify-content: space-between;
    align-items: flex-end;
  }
  .footer .inner .copyright .logo {
    width: 192px;
    height: 34px;
    /*background: url("../assets/images/ico_logo.png") 50% 50% no-repeat;*/
    background-size: contain;
  }
  .footer .inner .copyright .addr {
    margin: 16px 0 0;
    font-size: 12px;
    font-weight: 400;
  }
  .footer .inner .copyright .addr .gray {
    color: #777;
    display: block;
    margin: 0 0 2px;
  }
  .footer .inner .copyright .addr .gap {
    margin: 0 10px;
  }
  .footer .inner .copyright .copy {
    color: #777;
    display: block;
    margin: 5px 0 0;
    font-size: 12px;
    font-weight: 400;
  }
  .footer .inner .info {
    margin-left: auto;
  }
  .footer .inner .info .link {
    display: flex;
    gap: 20px;
  }
  .footer .inner .info .link li a {
    font-size: 12px;
    font-weight: 400;
    color: #777;
  }
  .footer .inner .info .link li a.active {
    color: #000;
  }
  .footer .inner .info .tel {
    margin: 50px 0 0;
  }
  .footer .inner .info .tel dl {
    display: flex;
    justify-content: flex-end;
    margin: 0 0 5px;
  }
  .footer .inner .info .tel dl dt {
    margin-right: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #777;
  }
  .footer .inner .info .tel dl dd {
    margin-right: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #222;
  }
  .footer .inner .info .tel dl dd:last-child {
    margin: 0;
  }
  </style>