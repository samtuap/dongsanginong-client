import PaymentView from "@/views/order/payment/PaymentView.vue";
export const orderRouter = [
  {
    path: "/package/:packageId/payment",
    name: "PaymentView",
    component: PaymentView
  }
];
