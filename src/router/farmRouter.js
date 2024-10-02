import FarmCreate from "@/views/product/farm/FarmCreate.vue"
import FarmList from "@/views/product/farm/FarmList.vue";

export const farmRouter = [
    {
        path: '/farm/farm-create',
        name: 'farmCreate',
        component: FarmCreate
    },
    {
        path: '/farm',
        name: 'farmList',
        component: FarmList
    },
]