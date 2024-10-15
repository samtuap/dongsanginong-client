import AllProductList from "@/views/product/package/AllProductList.vue";
import FarmPackageDetail from "@/views/product/farm/FarmPackageDetail.vue"
export const productRouter = [
  {
    path: "/product",
    name: "AllProductList",
    component: AllProductList,
  },

  {
    path: '/product/:packageId',
    name: 'FarmPackageDetail',
    component: FarmPackageDetail
},
];
