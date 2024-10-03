import FarmList from "@/views/product/farm/FarmList.vue";
import FarmDetailDescription from "@/views/product/farm/FarmDetailDescription.vue";

export const farmRouter = [

    {
        path: '/farm',
        name: 'farmList',
        component: FarmList
    },
    {
        path: '/farm/:farmId',
        name: 'farmDetailDescription',
        component: FarmDetailDescription
    },
]
