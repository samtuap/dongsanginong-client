import SellerSalesDetail from "@/views/product/seller/SellerSalesDetail.vue"
import SellerSignUp from "@/views/product/seller/SellerSignUp.vue"
export const sellerRouter = [

    {
        path: '/seller/sales-detail',
        name: 'sellerSalesDetail',
        component: SellerSalesDetail
    },
    {
        path: '/seller/sign-up',
        name: 'sellerSignUp',
        component: SellerSignUp
    },
]