<template>
  <div class="head" data-tauri-drag-region>
    <div class="head-left" data-tauri-drag-region>
      <span class="iconfont icon-xiangzuo" :class="{ 'icon-dis': !hasBack}" @click="toBack"/>
      <span class="iconfont icon-xiangyou" :class="{ 'icon-dis': !hasNext}" @click="toGo"/>
      <span class="iconfont icon-shuaxin" @click="refresh"/>
      <div class="head-left-search">
        <input type="text" placeholder="搜索"/>
        <SearchOutlined/>
      </div>
    </div>
    <div class="head-right" data-tauri-drag-region>
      <div class="head-right-user">
        <img class="head-user__img" src="https://next.antdv.com/assets/logo.1ef800a8.svg" alt="">
        <span class="head-user__name">放弃登录了</span>
      </div>
      <div class="head-right-win" v-isWin>
<!--        设置菜单-->
        <a-popover v-model:open="visible" trigger="click" placement="bottom">
          <template #content>
            <div class="more-menu-box">
              <div class="more-menu" @click="toSettingPage">
                <span class="iconfont icon-shezhi"></span>
                <span class="txt">设置</span>
              </div>
              <div class="more-menu not-hide">
                <span class="iconfont icon-jianchagengxin"></span>
                <span class="txt">检查更新</span>
              </div>
              <div class="more-menu not-hide">
                <span class="iconfont icon-qiehuanzhanghao"></span>
                <span class="txt">切换账号</span>
              </div>
              <div class="more-menu not-hide">
                <span class="iconfont icon-tuichuzhanghao"></span>
                <span class="txt">退出登录</span>
              </div>
            </div>
          </template>
          <span class="iconfont icon-shezhi1"></span>
        </a-popover>
        <span class="iconfont icon-zuixiaohua" @click="minWindow()"></span>
        <span class="iconfont icon-zuidahua1" @click="toggleMaximizeWindow()" v-if="maxWin"></span>
        <span class="iconfont icon-zuidahua" v-else></span>
        <span class="iconfont icon-guanbi" @click="closeWindow()"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {appWindow} from "@tauri-apps/api/window";
import {useWinStore} from "@/store/modules/system.ts";
import {storeToRefs} from "pinia";
import {nextTick, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const route = useRouter()
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

const visible = ref<boolean>(false);

function toSettingPage() {
  visible.value = false;
  route.push('/setting')
}

// 返回上一页
const hasBack = ref(false)
const hasNext = ref(false)
function toBack() {
  route.back()
}

function toGo() {
  route.go(1)
}

// 刷新当前路由页面
function refresh() {
  route.go(0)
}

onMounted(() => {
  if (window.history.length === 0) {
    hasBack.value = false
    hasNext.value = true
  } else {
    hasBack.value = window.history.state.back && window.history.state.back !== ''
    hasNext.value = window.history.state.forward && window.history.state.forward !== ''
  }
})

route.afterEach(() => {
  nextTick(() => {
    hasBack.value = window.history.state.back && window.history.state.back !== ''
    hasNext.value = window.history.state.forward && window.history.state.forward !== ''
  })
})
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

    .iconfont {
      font-size: 20px;
      margin-right: 15px;
      color: #666;
      cursor: pointer;
    }

    .icon-dis {
      color: #afafaf;
      cursor: default;
    }

    .iconfont:hover {
      color: $color;
    }

    .icon-dis:hover {
      color: #afafaf !important;
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

    .head-right-win {
      span {
        margin-left: 15px;
        cursor: pointer;
      }
    }

    & > span {
      margin-left: 15px;
      cursor: pointer;
    }

    .iconfont {
      color: #8C8C8C;
      font-size: 18px;
    }

    .iconfont:hover {
      color: $color;
    }
  }
}

.more-menu-box {
  padding: 10px 0;

  .more-menu {
    width: 200px;
    padding: 8px 20px;
    display: flex;
    cursor: pointer;
    line-height: 24px;

    .iconfont {
      margin-right: 10px;
      font-size: 16px;
      flex-shrink: 0;
    }

    .txt {
      flex: 1;
      font-size: 14px;
    }
  }

  .more-menu:hover {
    background-color: #f2f2f2;
  }
}
</style>