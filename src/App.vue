<template>
  <div class="app">
    <router-view :key="key"/>
  </div>
</template>
<script setup>
import {computed, onMounted} from "vue";
import { useRoute} from "vue-router";
import {useWinStore} from "@/store/modules/system.ts";

// 解决切换白屏问题
const route = useRoute();
const key = computed(() => {
  return route.path + Math.random();
});

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
