import FarmCreate from "@/views/product/farm/FarmCreate.vue"
import FarmList from "@/views/product/farm/FarmList.vue";
import FarmPackageList from "@/views/product/farm/FarmPackageList.vue";
import FarmInfoUpdate from "@/views/product/farm/FarmInfoUpdate.vue";
import farmListSample from "@/views/product/farm/farmListSample.vue";


export const farmRouter = [
    {
        path: '/farm/farm-create',
        name: 'farmCreate',
        component: FarmCreate
    },
    {
        path: '/farm/list',
        name: 'farmList',
        component: FarmList
    },
    {
        path: '/farm/:farmId/packages',
        name: 'farmPackages',
        component: FarmPackageList
    },
    {
        path: '/my-farm/update',
        name: 'FarmInfoUpdate',
        component: FarmInfoUpdate
    },
    {
        path: '/farm',
        name: 'farmListSample',
        component: farmListSample
    },
]

