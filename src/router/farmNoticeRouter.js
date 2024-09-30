import FarmNoticeList from "@/views/product/farmNotice/FarmNoticeList.vue";

export const farmNoticeRouter = [
    {
        path: '/farm/:id/notice/list',
        name: 'FarmNoticeList',
        component: FarmNoticeList,
    },
]