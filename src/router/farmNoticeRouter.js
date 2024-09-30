import FarmNoticeCreate from "@/views/farmNotice/FarmNoticeCreate.vue";
import FarmNoticeUpdate from "@/views/farmNotice/FarmNoticeUpdate.vue";

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
  ];
