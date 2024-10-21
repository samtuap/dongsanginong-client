<template>
    <v-container>
        <div v-for="(notification, index) in notifications" :key="index">
            <p>{{ notification.title }}</p>
            <p>{{ notification.content }}</p>
        </div>
    </v-container>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            notifications: [],
        }
    },
    async created() {
        const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/notification`);
        console.log(res);
        this.notifications = res.data.content; 
    }
}
</script>
<style>
</style>