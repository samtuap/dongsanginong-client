import MemberSignIn from "@/views/member/login/MemberSignIn.vue";
import KakaoCallback from "@/views/member/login/KakaoCallback.vue";
import GoogleCallback from "@/views/member/login/GoogleCallback.vue";
import MemberSignUp from "@/views/member/login/MemberSignUp.vue";
import MemberMyPage from "@/views/member/myPage/MemberMyPage.vue";
import MemberPhoneUpdate from "@/views/member/myPage/MemberPhoneUpdate.vue";

export const memberRouter = [
  {
    path: "/member/sign-in",
    name: "MemberSignIn",
    component: MemberSignIn,
  },
  {
    path: "/oauth/redirect/kakao",
    name: "KakaoCallback",
    component: KakaoCallback,
  },
  {
    path: "/oauth/redirect/google",
    name: "GoogleCallback",
    component: GoogleCallback,
  },
  {
    path: "/member/sign-up",
    name: "MemberSignUp",
    component: MemberSignUp,
  },
  {
    path: "/member/my-page",
    name: "MemberMyPage",
    component: MemberMyPage,
  },
  {
    path: "/member/update/phone",
    name: "MemberPhoneUpdate",
    component: MemberPhoneUpdate,
  },
];
