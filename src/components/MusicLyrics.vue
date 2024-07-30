<template>
  <div class="music-lyrics">
    <div class="music-lyrics-head" data-tauri-drag-region>
      <div class="left">
        <span class="iconfont icon-xiangxia" @click="musicLyricVisible = false"></span>
      </div>
      <div class="right" v-if="isWin">
        <MinusOutlined @click="minWindow()"/>
        <FullscreenExitOutlined @click="toggleMaximizeWindow()" v-if="maxWin"/>
        <FullscreenOutlined @click="toggleMaximizeWindow()" v-else/>
        <CloseOutlined @click="closeWindow()"/>
      </div>
    </div>
    <div class="music-lyrics-main">
      <div class="mlm-left">
        <img class="music-lyrics__img" :src="stitchTheImageUrl(musicImg)" alt="">
      </div>
      <div class="mlm-right">
        <div class="mlm__title">{{ musicTitle }}</div>
        <div class="mlm__author">{{ musicAuthor ?? '未知' }}</div>
        <div class="mlm-list-box">
          <div class="mlm-list-time"></div>
          <div class="mlm-list-mask-up"></div>
          <div class="mlm-list-mask-down"></div>
          <div ref="lyricsListRef" class="mlm-list" @mouseenter="lyricsListHour = true" @mouseleave="lyricsListHour = false">
            <div class="mlm-list-row" v-for="(line, index) in lyrics" :key="index">
              <span v-for="(txt, txtIndex) in line" :key="txtIndex"
                    class="lyrics-txt"
                    :class="isActiveWord(txt,txtIndex,index)"
                    :style="{
                      animationDuration: `${getAnimationDuration(txt.time, txt.word, txtIndex, index)}s`,
                      animationPlayState: musicPlay ? 'running':'paused' }"
              >
                {{ txt.word }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {appWindow} from "@tauri-apps/api/window";
import {useLayoutStore, useWinStore} from "@/store/modules/system.ts";
import {storeToRefs} from "pinia";
import {musicLyricsStore, musicStore} from "@/store/modules/music.ts";
import {parseLyrics, stitchTheImageUrl} from "@/utils";
import {nextTick, onMounted, ref, watch} from "vue";
import {getMusicLyricsAPI} from "@/api/music.ts";

const {isWin} = storeToRefs(useWinStore())
const {isMaxWin: maxWin} = storeToRefs(useWinStore())
const {musicLyricVisible} = storeToRefs(useLayoutStore())
const {musicImg, musicTitle, musicId, musicAuthor, musicPlayTimeNum, musicPlay} = storeToRefs(musicStore())
const lyrics = ref<MusicLyricsType[][]>([])

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

const {lineIndex,wordIndex} = storeToRefs(musicLyricsStore())
// 判断是否显示歌词动画，判断歌词是否已经播放
function isActiveWord(txt: MusicLyricsType, txtIndex: number, index: number) {
  if (txt.word !== '') {
    if (musicPlayTimeNum.value > txt.time && musicPlayTimeNum.value < lyrics.value[index][txtIndex + 1].time) {
      lineIndex.value = index
      wordIndex.value = txtIndex
      return 'lyrics-txt-animation'
    } else if (musicPlayTimeNum.value > txt.time) {
      return 'active'
    }
  }
}

// 获取歌词动画时间
function getAnimationDuration(time: number, txt: string, txtIndex: number, index: number) {
  if (txt !== '') {
    return lyrics.value[index][txtIndex + 1].time - time
  } else {
    return 0
  }
}

const lyricsListRef = ref<HTMLElement>()
// 控制鼠标移入歌词列表后，歌词列表不跟随音乐播放滚动
const lyricsListHour= ref(false)
// 控制歌词跟随音乐播放滚动
function scrollList() {
  if (lyricsListRef.value && !lyricsListHour.value) {
    let rowsHeight = lyricsListRef.value.scrollHeight / lyrics.value.length
    lyricsListRef.value.scrollTop = rowsHeight * lineIndex.value - 160
  }
}

async function init() {
  const {data: res} = await getMusicLyricsAPI(musicId.value)
  if (res.code === 200) {
    lyrics.value = parseLyrics(res.message)
    await nextTick(() => {
      if (lyrics.value.length > 0 && lineIndex.value > 0 && musicPlayTimeNum.value > 0)
      scrollList()
    })
  }
}

watch(
    () => musicId.value,
    (newValue) => {
      if (newValue !== 0) {
        init()
      }
    }
)

watch(
    () => lineIndex.value,
    () => {
      scrollList()
    }
)


onMounted(() => {
  if (musicId.value !== 0) {
    init()
  }
})

</script>

<style scoped lang="scss">
.music-lyrics {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .music-lyrics-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    padding: 20px;
    flex-shrink: 0;

    .left {
      .iconfont {
        font-size: 22px;
      }

      .iconfont:hover {
        color: $color;
      }
    }

    .right {
      .anticon {
        margin-left: 15px;
        font-size: 20px;
      }

      .anticon:hover {
        color: $color;
      }
    }
  }

  .music-lyrics-main {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 20px;

    .mlm-left {
      flex-shrink: 0;
      max-width: 300px;
      max-height: 300px;
      padding: 100px;
    }

    .mlm-right {
      width: 40%;

      .mlm__title {
        font-size: 24px;
        margin-bottom: 5px;
        padding-left: 40px;
      }

      .mlm__author {
        font-size: 18px;
        margin-bottom: 10px;
        color: #A2A2A2;
        padding-left: 40px;
      }

      .mlm-list-box {
        width: 100%;
        position: relative;
        padding-left: 40px;

        .mlm-list-mask-up {
          position: absolute;
          top: 0;
          left: 0;
          width: calc(100% - 40px);
          height: 80px;
          z-index: 9;
          background: linear-gradient(rgba(71, 56, 64, 1), rgba(71, 56, 64, 0));
        }

        .mlm-list-mask-down {
          position: absolute;
          left: 0;
          bottom: 0;
          width: calc(100% - 40px);
          height: 60px;
          z-index: 9;
          background: linear-gradient(rgba(71, 56, 64, 0), rgba(71, 56, 64, 1));
        }

        .mlm-list {
          padding: 40px 0;
          width: 100%;
          max-height: 240px;
          overflow: auto;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
          font-size: 18px;
          color: #fff;

          .mlm-list-row {
            padding: 5px 0;

            & > span {
              margin-right: 2px;
            }
          }
        }
      }
    }

    .mlm-right::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
}

@keyframes progress {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: 100% 0;
  }
}

.lyrics-txt.active {
  color: $color;
}

.lyrics-txt-animation {
  color: transparent;
  background: linear-gradient(to right, #fff 50%, $color 50%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: progress 1s ease 1 forwards;
}
</style>