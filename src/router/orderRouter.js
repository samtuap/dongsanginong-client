import PaymentView from "@/views/order/payment/PaymentView.vue";
import PaymentResultView from "@/views/order/payment/PaymentResultView.vue";
export const orderRouter = [
  {
    path: "/package/:packageId/payment",
    name: "PaymentView",
    component: PaymentView
  },
  {
    path: "/order/:orderId",
    name: "PaymentResultView",
    component: PaymentResultView
  }
];
