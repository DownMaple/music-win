<template>
  <div class="component-box">
    <div class="sl-up">
      <div class="sl-up-left">
        <img class="sl-up-left__img" :src="stitchTheImageUrl(songListData.img)" alt="">
      </div>
      <div class="sl-up-right">
        <div class="sl-up__name">{{ songListData.title }}</div>
        <div class="sl-up__author">
          <span>{{ songListData.author }}</span>
        </div>
        <div class="sl-up__profile">
          {{ songListData.description }}
        </div>
        <div class="sl-up-right-btn">
          <div class="sl-up__btn" @click="playAllMusic">
            <span class="iconfont icon-bofang"></span>
            <span>播放</span>
          </div>
          <div class="sl-up__btn">
            <span class="iconfont icon-sc"></span>
            <span>收藏</span>
          </div>
          <div class="sl-up__btn">
            <span class="iconfont icon-caidan"></span>
            <span>更多</span>
          </div>
          <div class="sl-up__num">
            歌曲数量：{{songListMusic.length}}
          </div>
        </div>
      </div>
    </div>
    <div class="sl-content">
      <div class="sl-table">
        <div class="sl-table-thead">
          <div class="sl-table__th">歌名/歌手</div>
          <div class="sl-table__th">专辑</div>
          <div class="sl-table__th">时长</div>
        </div>
        <div class="sl-table-tbody">
          <div class="sl-table-tr" :class="{'sl-table-tr-act':item.id === musicId}" v-for="item in songListMusic" :key="item.id">
            <div class="sl-table__td">
              <div class="music-item">
                <div class="music-left">
                  <img class="music-img" :src="stitchTheImageUrl(item.img)" alt="">
                  <div class="music-left-mask" @click="playMusic(item)">
                    <span class="iconfont icon-weibiaoti519" v-if="musicPlay && item.id === musicId"></span>
                    <span class="iconfont icon-bofang" v-else></span>
                  </div>
                </div>
                <div class="music-msg">
                  <p class="name">{{ item.title }}</p>
                  <p class="author">{{ item.author_name ?? '未知' }}</p>
                </div>
                <div class="music-right-center">
                  <span class="iconfont icon-sc-act" v-if="item.collection"></span>
                  <span class="iconfont icon-sc"></span>
                </div>
                <div class="music-right">
                  <span class="iconfont icon-gengduo"></span>
                </div>
              </div>
            </div>
            <div class="sl-table__td">{{ item.album_title }}</div>
            <div class="sl-table__td">{{ item.duration }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


import {musicStore} from "@/store/modules/music.ts";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getSongListOne} from "@/api/songList.ts";
import {deepCopy, stitchTheImageUrl} from "@/utils";

const {musicIndex, musicPlay, musicId , musicList} = storeToRefs(musicStore())
const router = useRouter()
const id = ref(0)
const songListData = ref<SongListType>({
  img: "",
  description: "", id: 0, status: 0, title: ""
})
const songListMusic = ref<MusicType[]>([])

// 播放全部
function playAllMusic() {
  musicList.value = deepCopy(songListMusic.value)
  musicStore().changeMusic(0)
}

// 播放音乐
function playMusic(music: MusicType) {
  let listIndex = musicList.value.findIndex((item) => item.id === music.id)
  if (listIndex >= 0) {
    musicStore().changeMusic(listIndex)
  } else {
    musicList.value.splice(musicIndex.value + 1, 0 ,music)
    musicStore().changeMusic(musicIndex.value + 1)
  }
}

async function init() {
  const {data: res} = await getSongListOne(id.value)
  if (res.code === 200) {
    songListData.value = res.data
    songListMusic.value = res.data.music_list
  }
}

onMounted(() => {
  id.value = Number(router.currentRoute.value.params.id)
  init()
})



</script>

<style scoped lang="scss">
.component-box {
  display: flex;
  flex-direction: column;
}

.sl-up {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;

  .sl-up-left {
    width: 154px;
    height: 154px;
    border-radius: 10px;
    margin-right: 20px;
    flex-shrink: 0;
    overflow: hidden;

    .sl-up-left__img {
      width: 100%;
      height: 100%;
    }
  }

  .sl-up-right {
    flex: 1;

    .sl-up__name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .sl-up__author {
      font-size: 14px;
      color: #999;
      margin-bottom: 5px;
    }

    .sl-up__profile {
      height: 54px;
      font-size: 12px;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      color: #999;
      margin-bottom: 10px;
    }

    .sl-up-right-btn {
      display: flex;
      flex-direction: row;
      align-items: center;

      .sl-up__btn {
        width: auto;
        height: 32px;
        line-height: 32px;
        padding: 0 30px;
        border-radius: 16px;
        background-color: #DEDEDE;
        margin-right: 20px;

        .iconfont {
          margin-right: 5px;
        }

        .icon-caidan {
          margin-right: 0;
        }

        span {
          font-size: 14px;
        }
      }

      .sl-up__num {
        font-size: 14px;
        color: $color;
      }
    }
  }
}

.sl-content {
  flex: 1;
  overflow: hidden;
  width: 100%;

  .sl-table {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .sl-table-thead {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 15px 0;
      background-color: #f5f5f5;
      font-size: 12px;
      color: #777;
      flex-shrink: 0;

      .sl-table__th:first-child {
        flex: 1;
        padding-left: 15px;
      }

      .sl-table__th:nth-child(2) {
        width: 240px;
      }

      .sl-table__th:last-child {
        width: 60px;
      }
    }

    .sl-table-tbody {
      flex: 1;
      overflow-y: auto;

      .sl-table-tr {
        display: flex;
        flex-direction: row;
        align-items: center;

        .sl-table__td:first-child {
          flex: 1;
          overflow: hidden;
        }

        .sl-table__td:nth-child(2) {
          width: 240px;
          font-size: 12px;
          color: #666;
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }

        .sl-table__td:last-child {
          width: 60px;
          font-size: 12px;
          color: #666;
        }
      }
      .sl-table-tr:nth-child(even) {
        background-color: #f6f6f6;
      }
    }
  }
}

.sl-table-tr {
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

      }
    }

    .music-left:hover {
      .iconfont {
        color: $color;
      }
    }

    .music-msg {
      flex: 1;
      margin-right: 15px;
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
    .music-right-center {
      flex-shrink: 0;
      margin-right: 15px;

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
    }
    .music-right {
      flex-shrink: 0;
      margin-right: 15px;
      visibility: hidden;

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
}

.sl-table-tr:hover {
  background-color: #f2f2f2;

  .music-left {
    .music-left-mask {
      display: flex;
    }
  }

  .music-right {
    visibility: visible;
  }
}

.sl-table-tr-act {
  background-color: #f2f2f2;

  .music-left {
    .music-left-mask {
      display: flex !important;
    }
  }
  .name {
    color: $color !important;
  }

  .author {
    color: $color !important;
  }

  .music-right {
    visibility: visible;
  }
  .sl-table__td {
    color: $color !important;
  }
}
</style>