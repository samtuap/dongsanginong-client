import FarmNoticeCreate from "@/views/product/farmNotice/FarmNoticeCreate.vue";
import FarmNoticeUpdate from "@/views/product/farmNotice/FarmNoticeUpdate.vue";

export const FarmNoticeRouter = [
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
  ];
