<template>
  <div v-if="streamManager" class="user-video">
    <ov-video :stream-manager="streamManager" class="video-element" />
  </div>
</template>

<script>
import OvVideo from './OvVideo';

export default {
	name: 'UserVideo',

	components: {
		OvVideo,
	},

	props: {
		streamManager: Object,
	},

	computed: {
		clientData () {
			const { clientData } = this.getConnectionData();
			return clientData;
		},
	},

	methods: {
		getConnectionData () {
			const { connection } = this.streamManager.stream;
			return JSON.parse(connection.data);
		},
	},
};
</script>
<style scoped>
.user-video {
  width: 110%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-element {
  width: 110%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #e0e0e0;
}
</style>
