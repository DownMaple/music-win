<template>
  <a-drawer
      ref="drawerRef"
      v-model:open="musicListVisible"
      rootClassName="music-list-drawer"
      class="custom-class"
      placement="right"
      width="460px"
      :closable="false"
      :mask="false"
  >
    <div class="music-list-drawer-box" ref="drawerContRef">
      <div class="music-list-drawer-head">
        <span>播放队列</span>
        <div>
          <a-tooltip title="批量操作">
            <span class="iconfont icon-ic_batch_default24px"></span>
          </a-tooltip>
          <a-tooltip title="清空队列">
            <span class="iconfont icon-shanchu" @click="clearMusicList"></span>
          </a-tooltip>
        </div>
      </div>
      <div class="music-list-drawer__count">共{{ musicList.length }}首歌曲</div>
      <div class="music-list-drawer-content">
        <div class="music-item" v-for="(item,index) in musicList" :key="item.id"
             :class="{'music-item-act':index === musicIndex}">
          <div class="music-left">
            <img class="music-img" :src="stitchTheImageUrl(item.img)" alt="">
            <div class="music-left-mask" @click="playMusic(item,index)">
              <span class="iconfont icon-weibiaoti519" v-if="musicPlay && index === musicIndex"></span>
              <span class="iconfont icon-bofang" v-else></span>
            </div>
          </div>
          <div class="music-msg">
            <p class="name">{{ item.title }}</p>
            <p class="author">{{ item.author_name ?? '未知' }}</p>
          </div>
          <div class="music-right">
            <span class="iconfont icon-sc-act" v-if="item.collection"></span>
            <span class="iconfont icon-sc" v-else></span>
            <more-menu :id="item.id"></more-menu>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {musicStore} from "@/store/modules/music.ts";
import {ref, watch} from "vue";
import {useLayoutStore} from "@/store/modules/system.ts";
import {stitchTheImageUrl} from "@/utils";
import MoreMenu from "@/components/moreMenu.vue";

const {musicList, musicIndex, musicPlay} = storeToRefs(musicStore())
const drawerRef = ref<HTMLElement>()
const drawerContRef = ref<HTMLElement>()
const {musicListVisible} = storeToRefs(useLayoutStore())


// 切换播放音乐
function playMusic( item:MusicType, index:number) {
  if (musicIndex.value === index) {
    musicPlay.value = !musicPlay.value
  } else {
    musicStore().setMusicIndex(index)
    musicStore().setMusicId(item.id)
    musicStore().setMusicLink(item.link)
    musicStore().setMusicImg(item.img)
    musicStore().setMusicTitle(item.title)
    musicStore().setMusicAuthor(item.author_name ?? '未知')
    musicStore().setMusicIsCache(false)
    musicStore().setMusicPlayTime("00:00")
    musicStore().setMusicPlayTimeNum(0)
  }
}

// 清空队列
function clearMusicList() {
  musicList.value = []
  musicIndex.value = 0
  musicPlay.value = false
  musicStore().setMusicIsCache(false)
  musicStore().setMusicPlayTime("00:00")
  musicStore().setMusicPlayTimeNum(0)
  musicStore().setMusicId(0)
}

/**
 * 关闭抽屉
 */
function closeDrawer() {
  musicListVisible.value = false
}

/**
 * 点击其他区域关闭抽屉
 */
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  // 点击展开按钮同样可以关闭，不然会重复设置
  if (target.classList.contains('iconfont') && target.classList.contains('icon-unfold')) {
    return
  } else if ( drawerRef.value && drawerContRef.value && drawerContRef.value.contains(target)) {
    return;
  } else {
    closeDrawer();
  }
};
watch(
    musicListVisible,
    (val) => {
      if (val) {
        document.addEventListener('mousedown', handleClickOutside)
      } else {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
)

</script>

<style scoped lang="scss">

.music-list-drawer-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .music-list-drawer-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-shrink: 0;
    padding-left: 10px;

    .iconfont {
      color: #777;
      font-size: 18px;
      margin-left: 20px;
      cursor: pointer;
    }

    .iconfont:hover {
      color: $color;
    }
  }

  .music-list-drawer__count {
    font-size: 12px;
    margin-bottom: 5px;
    flex-shrink: 0;
    padding-left: 10px;
  }

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
}
</style>