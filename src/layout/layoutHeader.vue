<template>
  <div class="head" data-tauri-drag-region>
    <div class="head-left" data-tauri-drag-region>
      <ArrowLeftOutlined/>
      <ReloadOutlined/>
      <div class="head-left-search">
        <input type="text" placeholder="搜索"/>
        <SearchOutlined/>
      </div>
    </div>
    <div class="head-right" data-tauri-drag-region>
      <div class="head-right-user">
        <img class="head-user__img" src="https://next.antdv.com/assets/logo.1ef800a8.svg" alt="">
        <span class="head-user__name">沙雕萝卜头</span>
      </div>
      <SettingOutlined/>
      <template v-isWin>
        <MinusOutlined @click="minWindow()"/>
        <FullscreenExitOutlined @click="toggleMaximizeWindow()"  v-if="maxWin"/>
        <FullscreenOutlined @click="toggleMaximizeWindow()" v-else />
        <CloseOutlined @click="closeWindow()"/>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {appWindow} from "@tauri-apps/api/window";
import {useWinStore} from "@/store/modules/system.ts";
import {storeToRefs} from "pinia";
const {isMaxWin: maxWin} = storeToRefs(useWinStore())

// 最小化窗口
function minWindow() {
  appWindow.minimize()
}

// 窗口放大缩小
function toggleMaximizeWindow() {
  appWindow.toggleMaximize()
}

// 关闭窗口
function closeWindow() {
  appWindow.close()
}


</script>

<style scoped lang="scss">
.head {
  display: flex;
  flex-direction: row;
  height: 80px;
  padding: 0 20px;

  .head-left {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-right: 100px;

    & > span {
      margin-right: 15px;
      cursor: pointer;
    }

    .head-left-search {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 30%;
      height: 38px;
      min-width: 100px;
      overflow: hidden;
      background-color: #E6E6E6;
      border-radius: 19px;
      padding: 0 15px;

      input {
        width: calc(100% - 30px);
        background-color: transparent;
        outline: none;
      }

      span {
        flex-shrink: 0;
        margin-left: 10px;
        font-size: 18px;
      }
    }
  }

  .head-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex-shrink: 0;

    .head-right-user {
      display: flex;
      flex-direction: row;
      align-items: center;

      .head-user__img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 5px;
      }

      .head-user__name {
        font-size: 14px;
      }
    }

    & > span {
      margin-left: 15px;
      cursor: pointer;
    }
  }
}
</style>