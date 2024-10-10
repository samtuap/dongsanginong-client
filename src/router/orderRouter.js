import PaymentView from "@/views/order/payment/PaymentView.vue";
export const orderRouter = [
  {
    path: "/package/:productId/payment",
    name: "PaymentView",
    component: PaymentView
  }
];
