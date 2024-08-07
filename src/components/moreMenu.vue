<template>
  <a-popover v-model:open="visible" trigger="click" placement="bottomLeft">
    <template #content>
      <div class="more-menu-box">
        <div class="more-menu">
          <span class="iconfont icon-sc"></span>
          <span class="txt">我喜欢</span>
        </div>
        <div class="more-menu">
          <span class="iconfont icon-xiazai1"></span>
          <span class="txt">下载</span>
        </div>
      </div>
    </template>
    <span class="iconfont icon-gengduo" :style="{ fontSize: `${props.fontSize}px`}"></span>
  </a-popover>
</template>

<script setup lang="ts">
import {ref} from "vue";

const visible = ref<boolean>(false);

const hide = () => {
  visible.value = false;
};

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  fontSize: {
    type: Number,
    default: 20,
  },
});
</script>

<style scoped lang="scss">
.icon-gengduo {
  margin-left: 20px;
  color: #999;
  font-size: 18px;
}
.icon-gengduo:hover {
  color: $color;
}
.more-menu-box {
  padding: 10px 0;
  .more-menu {
    width: 160px;
    padding: 8px 20px;
    display: flex;
    cursor: pointer;
    .iconfont {
      margin-right: 10px;
      font-size: 16px;
      flex-shrink: 0;
    }
    .txt {
      flex: 1;
    }
  }
  .more-menu:hover {
    background-color: #f2f2f2;
  }
}
</style>