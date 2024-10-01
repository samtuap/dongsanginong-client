import SellerSalesDetail from "@/views/product/seller/SellerSalesDetail.vue"
import CouponCreate from "@/views/order/coupon/CouponCreateList.vue"

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
    }
]