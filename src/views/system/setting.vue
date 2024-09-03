<template>
  <div class="component-box">
    <div class="setting-box">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="下载设置">
          <div class="setting-row">
            <span class="setting-row-left">下载路径：</span>
            <div class="setting-row-right">{{downSetting.downPath}} <span class="setting-row__btn" @click="openSelectPath">更改位置</span></div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import {invoke} from "@tauri-apps/api";

const activeKey = ref('1');

const downSetting = reactive({
  downPath: '',
})
async function getInstallPath() {
  const path = await invoke('get_install_path');
  if (path && typeof path === 'string') {
    downSetting.downPath = path;
  } else {
    downSetting.downPath = '下载路径获取失败';
  }
}

async function openSelectPath() {
  const res = await invoke('select_file_path');
  if (res && typeof res === 'string' && res !== '') {
    downSetting.downPath = res;
  }
  
}

onMounted(() => {
  getInstallPath()
})
</script>

<style scoped lang="scss">
.setting-row {
  display: flex;
  flex-direction: row;
  padding: 10px 0;
  .setting-row-left {
    flex-shrink: 0;
    width: 100px;
    margin-right: 10px;
  }
  .setting-row-right {
    flex: 1;
    line-height: 20px;
    .setting-row__btn {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 5px;
      background-color: $color;
      color: #fff;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>