<template>
  <div ref="winDomRef" class="layout-box " :class="{'layout-win-mini': isWin && !maxWin, 'layout-lyrics-visible': musicLyricVisible}">
    <div class="layout-bg"  v-if="musicLyricVisible"></div>
    <div class="layout-lyrics" v-if="musicLyricVisible">
      <MusicLyrics></MusicLyrics>
    </div>
    <div class="layout" v-else>
      <layout-menu class="layout-menu "></layout-menu>
      <div class="layout-right">
        <layout-header></layout-header>
        <div class="layout-main">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <!--            组件缓存-->
              <!--            <keep-alive>-->
              <component :is="Component" :key="$route.fullPath"/>
              <!--            </keep-alive>-->
            </transition>
          </router-view>
        </div>
      </div>
    </div>
    <layout-footer class="layout-footer"></layout-footer>
  </div>
  <!--    音乐列表抽屉-->
  <music-list/>
</template>

<script setup lang="ts">
import LayoutFooter from "@/layout/layoutFooter.vue";
import LayoutMenu from "@/layout/layoutMenu.vue";
import LayoutHeader from "@/layout/layoutHeader.vue";
import MusicList from "@/components/MusicList.vue";
import {useLayoutStore, useWinStore} from "@/store/modules/system.ts";
import {storeToRefs} from "pinia";
import {ref} from "vue";
import {musicStore} from "@/store/modules/music.ts";
import MusicLyrics from "@/components/MusicLyrics.vue";

const {isWin} = storeToRefs(useWinStore())
const {isMaxWin: maxWin} = storeToRefs(useWinStore())
const {musicLyricVisible} = storeToRefs(useLayoutStore())
const {musicList} = storeToRefs(musicStore())

const winDomRef = ref<HTMLElement>()

</script>

<style scoped lang="scss">
/* fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.layout-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;

  .layout-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #473840;
    //background-color: #666;
  }

  .layout-lyrics {
    position: relative;
    width: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: row;
  }

  .layout {
    position: relative;
    width: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: row;
  }

  .layout-footer {
    flex-shrink: 0;
  }

  .layout-menu {
    flex-shrink: 0;
    height: 100%;
    overflow: auto;
  }

  .layout-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .layout-main {
      width: 100%;
      flex: 1;
      padding: $padding 0;
      overflow: hidden;
    }
  }
}

.layout-win-mini {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  position: relative;
  top: 5px;
  left: 5px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.07);
}
.layout-lyrics-visible {
  color: #fff;
}
html.dark .layout-box {
  .layout-main {
    background-color: rgba(0, 0, 0, 0) !important;
  }

  .layout-menu {
    background: $dark-bg !important;
  }

  .layout-header {
    background: $dark-bg !important;
  }
}


</style>