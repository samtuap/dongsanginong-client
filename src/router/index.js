import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

import MemberSignIn from "@/views/member/login/MemberSignIn.vue";
import KakaoCallback from "@/views/member/login/KakaoCallback.vue";
import GoogleCallback from "@/views/member/login/GoogleCallback.vue";
import { farmNoticeRouter } from "./farmNoticeRouter";
import { couponRouter } from "./couponRouter";
import { sellerRouter } from '@/router/sellerRouter';
import MemberSignUp from "@/views/member/login/MemberSignUp.vue";


const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/sign-in",
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
    path: "/sign-up",
    name: "MemberSignUp",
    component: MemberSignUp,
  },

  ...farmNoticeRouter,
  ...couponRouter,
  ...sellerRouter,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
