import LiveList from '@/views/live/live/LiveList.vue'
// import LiveStream from '@/views/live/live/LiveStream.vue';

export const liveRouter = [

    {
        path: '/live/list',
        name: 'LiveList',
        component: LiveList
    },
    // {
    //     path: '/live/stream/:sessionId',
    //     name: 'LiveStream',
    //     component: LiveStream,
    //   }
]
