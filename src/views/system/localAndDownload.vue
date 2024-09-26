<template>
  <div class="component-box">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="本地音乐">Content of Tab Pane 1</a-tab-pane>
      <a-tab-pane key="2" tab="下载歌曲">
        <div class="music-list-drawer-content">
          <div class="music-item" v-for="(item,index) in downloadList" :key="item.id"
               :class="{'music-item-act':index === musicIndex}">
            <div class="music-left">
              <img class="music-img" :src="stitchTheImageUrl(item.img)" alt="">
              <div class="music-left-mask" @click="playMusic(item,index)">
                <span class="iconfont icon-weibiaoti519" v-if="musicPlay && index === musicIndex"></span>
                <span class="iconfont icon-bofang" v-else></span>
              </div>
            </div>
            <div class="music-msg">
              <p class="name">{{ item.file_name ?? '未知' }}</p>
              <p class="author">{{ item.author_name ?? '未知' }}</p>
            </div>
            <div class="music-right">
              <span class="iconfont icon-sc-act" v-if="item.collection"></span>
              <span class="iconfont icon-sc" v-else></span>
              <more-menu :id="item.id" :is-show-down="false"></more-menu>
            </div>
          </div>
          <a-empty v-if="downloadList.length === 0"/>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="正在下载">Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {stitchTheImageUrl} from "@/utils";
import MoreMenu from "@/components/moreMenu.vue";
import {getDownloadHistory} from "@/utils/tauriUtils.ts";

const activeKey = ref('2');

const downloadList = ref([]);

function getDownloadList() {
  getDownloadHistory().then(res => {
    console.log(res)
    if (res.length > 0) {
      downloadList.value = res
    }
  })
}

onMounted(() => {
  getDownloadList()
})
</script>

<style scoped lang="scss">
.music-list-drawer-content {
  flex: 1;

  .music-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    padding: 10px;

    .music-left {
      width: 54px;
      height: 54px;
      border-radius: 5px;
      position: relative;
      overflow: hidden;
      margin-right: 10px;
      flex-shrink: 0;
      cursor: pointer;

      .music-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .music-left-mask {
        display: none;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.2);

        .iconfont {
          color: #fff;
          font-size: 16px;
        }

        .icon-weibiaoti519 {
          display: none;
        }
      }
    }

    .music-left:hover {
      .iconfont {
        color: $color;
      }
    }

    .music-msg {
      flex: 1;

      .name {
        font-size: 14px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        margin-bottom: 5px;
      }

      .author {
        font-size: 12px;
        color: #888;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }

    .music-right {
      flex-shrink: 0;
      padding: 0 10px;
      display: none;;

      .iconfont {
        font-size: 22px;
        color: #999;
        cursor: pointer;
      }

      .icon-sc:hover {
        color: #F85C55;
      }

      .icon-sc-act {
        color: #F85C55;
      }

      .icon-gengduo {
        margin-left: 20px;
      }

      .icon-gengduo:hover {
        color: $color;
      }
    }
  }

  .music-item:hover {
    border-radius: 5px;
    background-color: #f2f2f2;

    .music-left {
      .music-left-mask {
        display: flex;
      }
    }

    .music-right {
      display: block;
    }
  }

  .music-item-act {
    border-radius: 5px;
    background-color: #f2f2f2;

    .music-left {
      .music-left-mask {
        display: flex;

        .icon-weibiaoti519 {
          display: inline-block;
        }
      }
    }

    .name {
      color: $color !important;
    }

    .author {
      color: $color !important;
    }

    .music-right {
      display: block;
    }
  }
}
</style>