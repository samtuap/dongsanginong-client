import DeliveryManageList from "@/views/order/delivery/DeliveryManageList.vue"
import SellerSalesDetail from "@/views/product/seller/SellerSalesDetail.vue"
import CouponCreate from "@/views/order/coupon/CouponCreateList.vue"
import SellerSignUp from "@/views/product/seller/SellerSignUp.vue"
import SellerWithDraw from "@/views/product/seller/SellerWithDraw.vue"

export const sellerRouter = [

    {
        path: '/seller/sales-detail',
        name: 'sellerSalesDetail',
        component: SellerSalesDetail
    },
    {
        path: '/coupons/create',
        name: 'CouponCreate',
        component: CouponCreate
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
    {
        path: '/seller/withdraw',
        name: 'SellerWithdraw',
        component: SellerWithDraw
    },
]
