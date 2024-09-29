import FarmNoticeList from "@/views/product/farmNotice/FarmNoticeList.vue";

export const FarmNoticeRouter = [
    {
        path: '/farm/:id/notice/list',
        name: 'FarmNoticeList',
        component: FarmNoticeList,
    },

]