<script setup lang="ts">
import VideIotServer from 'videiot-server';

const videiotApi = VideIotServer.getInstance();

const appId = '3d534491d3964a54b7f2db5e383bdf9d';
const secretKey = '3b71de1385404987';
// const baseUrl: string = 'https://openapi.videiot.cn:8081';
const baseUrl: string = 'http://localhost:5173/api';
videiotApi.init(baseUrl);

const addDevice = () => {
videiotApi.login(appId, secretKey);
  videiotApi.addDevice({
    protocol: 1
  });
};
</script>

<template>
  <div>
    <ul>
      <li><button type="button" @click="addDevice">添加设备列表</button></li>
    </ul>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
