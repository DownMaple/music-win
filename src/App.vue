<template>
  <a-config-provider :locale="zhCN">
    <div class="app">
      <router-view/>
    </div>
  </a-config-provider>

</template>
<script setup>
import {onMounted} from "vue";
import {useWinStore} from "@/store/modules/system.ts";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
// 解决切换白屏问题
// const route = useRoute();
// const key = computed(() => {
//   return route.path + Math.random();
// });

onMounted(() => {
  useWinStore().setIsWin(Boolean(window?.__TAURI__))
})


</script>
<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
