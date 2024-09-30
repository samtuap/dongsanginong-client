import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MemberLoginPage from "@/views/member/login/MemberLoginPage.vue";
import KakaoCallback from "@/views/member/login/KakaoCallback.vue";
import GoogleCallback from "@/views/member/login/GoogleCallback.vue";

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
    name: "MemberLoginPage",
    component: MemberLoginPage,
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
