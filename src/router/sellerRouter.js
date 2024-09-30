import DeliveryManageList from "@/views/order/delivery/DeliveryManageList.vue"
import SellerSalesDetail from "@/views/product/seller/SellerSalesDetail.vue"
import SellerSignUp from "@/views/product/seller/SellerSignUp.vue"
export const sellerRouter = [

    {
        path: '/seller/sales-detail',
        name: 'sellerSalesDetail',
        component: SellerSalesDetail
    },
    {
        path: '/seller/delivery-management',
        name: 'DeliveryManageList',
        component: DeliveryManageList
    },
    {
        path: '/seller/sign-up',
        name: 'sellerSignUp',
        component: SellerSignUp
    },
]
