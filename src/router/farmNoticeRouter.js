import FarmNoticeCreate from "@/views/product/farmNotice/FarmNoticeCreate.vue";
import FarmNoticeUpdate from "@/views/product/farmNotice/FarmNoticeUpdate.vue";
import FarmNoticeList from "@/views/product/farmNotice/FarmNoticeList.vue";

export const farmNoticeRouter = [
    {
        path: '/farm/notice/create',
        name: 'FarmNoticeCreate',
        component: FarmNoticeCreate
    },
    {
        path: '/farm/notice/update',
        name: 'FarmNoticeUpdate',
        component: FarmNoticeUpdate
    },
    {
        path: '/farm/:id/notice/list',
        name: 'FarmNoticeList',
        component: FarmNoticeList,
    },
  ];