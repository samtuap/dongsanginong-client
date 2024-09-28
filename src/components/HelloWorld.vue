<template>
  <v-container>
    <v-row>
      <v-btn color="deep_green">deep_green</v-btn>
      <v-btn color="light_green">light_green</v-btn>
      <v-btn color="yellow">yellow</v-btn>
      <v-btn color="light_orange">light_orange</v-btn>
      <v-btn color="deep_orange">deep_orange</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  async created() {
    console.log("created");
    try {
      const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/healthcheck`);
      console.log(res);
    } catch(e) {
      console.log(e);
    }
  },
  data: () => ({
    ecosystem: [
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader/tree/next',
      },
      {
        text: 'github',
        href: 'https://github.com/vuetifyjs/vuetify/tree/next',
      },
      {
        text: 'awesome-vuetify',
        href: 'https://github.com/vuetifyjs/awesome-vuetify',
      },
    ],
    importantLinks: [
      {
        text: 'Chat',
        href: 'https://community.vuetifyjs.com',
      },
      {
        text: 'Made with Vuetify',
        href: 'https://madewithvuejs.com/vuetify',
      },
      {
        text: 'Twitter',
        href: 'https://twitter.com/vuetifyjs',
      },
      {
        text: 'Articles',
        href: 'https://medium.com/vuetify',
      },
    ],
    whatsNext: [
      {
        text: 'Explore components',
        href: 'https://vuetifyjs.com',
      },
      {
        text: 'Roadmap',
        href: 'https://vuetifyjs.com/introduction/roadmap/',
      },
      {
        text: 'Frequently Asked Questions',
        href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
      },
    ],
  }),
}
</script>
