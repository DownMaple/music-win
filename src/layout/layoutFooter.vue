<template>
  <div class="footer">
    <div class="footer-left" v-if="hasMusic">
      <div class="music-item">
        <div class="music-left">
          <img class="music-img" :src="stitchTheImageUrl(musicImg)" alt="">
          <div class="music-left-mask">
            <ArrowsAltOutlined/>
          </div>
        </div>
        <div class="music-msg">
          <p class="name">{{ musicTitle }}</p>
          <p class="author">{{ musicAuthor }}</p>
        </div>
        <div class="music-right">
          <span class="iconfont icon-sc-act" v-if="false"></span>
          <span class="iconfont icon-sc" v-else></span>
          <span class="iconfont icon-gengduo"></span>
        </div>
      </div>
    </div>
    <div class="footer-left" v-else>
      <div class="music-item">
        <div class="music-left">
          <img class="music-img" src="/image/307.jpeg" alt="">
        </div>
        <div class="music-msg">
          <p class="name">我的音乐，听我想听</p>
        </div>
      </div>
    </div>
    <div class="footer-center">
      <div class="fc-up">
        <a-popover trigger="click" v-model:open="playVisible">
          <template #content>
            <div class="play-order-item" @click="selectPlayMode('icon-suijibofang')">
              <span class="iconfont icon-suijibofang"></span>
              <span>随机播放</span>
            </div>
            <div class="play-order-item" @click="selectPlayMode('icon-shunxubofang')">
              <span class="iconfont icon-shunxubofang"></span>
              <span>顺序播放</span>
            </div>
            <div class="play-order-item" @click="selectPlayMode('SINGLE_LOOP')">
              <span class="iconfont icon-danquxunhuan1"></span>
              <span>单曲循环</span>
            </div>
            <div class="play-order-item" @click="selectPlayMode('icon-16gl-repeat2')">
              <span class="iconfont icon-16gl-repeat2"></span>
              <span>列表循环</span>
            </div>
          </template>
          <div class="fc-up-box">
            <span class="iconfont" :class="selectPlay"></span>
          </div>
        </a-popover>
        <div class="fc-up-icon">
          <span class="iconfont icon-backward" @click="prevMusic"></span>
          <div class="begin-btn" @click="beginPlay">
            <span class="iconfont icon-bofang" v-if="!musicPlay"></span>
            <span class="iconfont icon-weibiaoti519" v-else></span>
          </div>
          <span class="iconfont icon-forward" @click="nextMusic"></span>
        </div>
        <a-popover trigger="click">
          <template #content>
            <div class="volume-regulation-box">
              <a-slider class="volume-regulation__line" v-model:value="musicVolume" :vertical="true"
                        :tooltipOpen="false"
                        @change="changeVolume"/>
              <div class="volume-regulation__num">
                {{ musicVolume }}%
              </div>
              <div class="volume-regulation__btn" @click="muteChange">
                <span class="iconfont icon-yinliang1" v-if="musicVolume !== 0 && !musicMuted"></span>
                <span class="iconfont icon-jingyin" v-else></span>
              </div>
            </div>
          </template>
          <div class="fc-up-box">
            <span class="iconfont icon-yinliang1" v-if="musicVolume !== 0 && !musicMuted"></span>
            <span class="iconfont icon-jingyin" v-else></span>
          </div>
        </a-popover>
      </div>
      <div class="fc-down">
        <span class="time">{{ musicPlayTime }}</span>
        <a-slider v-model:value="musicPlayTimeNum" :max="musicAllTimeNum" :step="musicStep" class="slider"
                  @change="beforeChangeTime"
                  :tooltipOpen="false" @afterChange="musicTimeChange"/>
        <span class="time">{{ musicAllTime }}</span>
      </div>
    </div>
    <div class="footer-right">
      <a-tooltip v-if="!musicIsCache && hasMusic">
        <template #title>音频文件缓存中···</template>
        <a-spin/>
      </a-tooltip>
      <span class="iconfont icon-unfold" @click.stop="musicListVisible = !musicListVisible"></span>
    </div>
    <audio
        preload="auto"
        ref="musicAudioRef"
        :loop="musicPlayModel === 'SINGLE_LOOP'"
        @ended="musicEnded"
        @loadedmetadata="getDuration"
        @timeupdate="updateProgress">
    </audio>
  </div>
</template>
<script setup lang="ts">

import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {blobDownFile, formatTime, stitchTheImageUrl} from "@/utils";
import {storeToRefs} from "pinia";
import {musicStore} from "@/store/modules/music.ts";
import {blobToArrayBuffer, getMusicFile, saveMusicFile} from "@/utils/db.ts";
import {message} from "ant-design-vue";
import {useLayoutStore} from "@/store/modules/system.ts";

const {musicListVisible} = storeToRefs(useLayoutStore())

const hasMusic = ref<boolean>(false)
// 播放器相关
const {
  musicId,
  musicImg,
  musicAuthor,
  musicLink,
  musicAllTime,
  musicPlayTime,
  musicPlayTimeNum,
  musicAllTimeNum,
  musicPlayModel,
  musicTitle,
  musicPlay,
  musicVolume,
  musicStep,
  musicIsCache,
  musicMuted,
  musicIndex,
} = storeToRefs(musicStore())
const musicAudioRef = ref<HTMLAudioElement | null>()

// 静音切换
function muteChange() {
  if (musicAudioRef.value) {
    musicAudioRef.value.muted = !musicAudioRef.value.muted
    musicMuted.value = !musicMuted.value;
  }
}

// 选择播放模式
const playVisible = ref<boolean>(false)
const selectPlay = ref('icon-16gl-repeat2')

// 切换播放模式
function selectPlayMode(val: string) {
  musicPlayModel.value = val
  switch (val) {
    case 'icon-suijibofang':
      selectPlay.value = 'icon-suijibofang'
      break
    case 'icon-shunxubofang':
      selectPlay.value = 'icon-shunxubofang'
      break
    case 'SINGLE_LOOP':
      selectPlay.value = 'icon-danquxunhuan1'
      break
    case 'icon-16gl-repeat2':
      selectPlay.value = 'icon-16gl-repeat2'
  }
  playVisible.value = false
}

// 控制播放器
function beginPlay() {
  if (hasMusic.value) {
    if (musicAudioRef.value) {
      musicPlay.value = !musicPlay.value;
    } else {
      console.log('音频播放器暂未开始播放')
    }
  }
}

// 获取音频时长
function getDuration() {
  if (musicAudioRef.value) {
    musicAllTimeNum.value = musicAudioRef.value.duration
    musicAllTime.value = formatTime(musicAllTimeNum.value)
    musicStep.value = musicAllTimeNum.value / 100
  }
}

function beforeChangeTime() {
  isCanUpdate.value = false
}

// 音频播放时间更新
const isCanUpdate = ref<boolean>(true)

function musicTimeChange(val: number) {
  if (hasMusic.value) {
    if (musicIsCache.value) {
      if (musicAudioRef.value) {
        isCanUpdate.value = false
        musicPlayTime.value = formatTime(val)
        musicPlayTimeNum.value = val
        // 先暂停音频播放，再更改进度
        musicAudioRef.value.pause();
        musicAudioRef.value.currentTime = val;
        nextTick(() => {
          musicAudioRef.value?.click()
          musicAudioRef.value?.play();
          if (!musicPlay.value) musicPlay.value = true
          isCanUpdate.value = true
        })
      }
    } else {
      message.warning('音频文件尚未缓存完成，暂不能帮你跳转哦~');
    }
  }
}

// 监听播放进度
function updateProgress() {
  if (musicAudioRef.value) {
    musicPlayTime.value = formatTime(musicAudioRef.value.currentTime)
    if (isCanUpdate.value) {
      musicPlayTimeNum.value = musicAudioRef.value.currentTime;
    }
  }
}

// 播放完成
function musicEnded() {
  if (musicAudioRef.value) {
    musicAudioRef.value.currentTime = 0
    musicPlay.value = false
  }
}

// 设置播放器音量
function changeVolume(val: number) {
  if (musicAudioRef.value) {
    musicVolume.value = val
    musicAudioRef.value.volume = val / 100
  }
}

// 缓存并播放音乐
async function cacheAndPlayMusic() {
  const cachedFile = await getMusicFile('music-' + musicId.value)
  if (!hasMusic.value) hasMusic.value = true
  if (cachedFile && cachedFile.byteLength > 0) {
    playMusic(cachedFile);
  } else {
    await fetchAndCacheMusic('music-' + musicId.value, musicLink.value);
  }
}

// 播放音乐
function playMusic(arrayBuffer: ArrayBuffer) {
  const blob = new Blob([arrayBuffer], {type: 'audio/mpeg'})
  const url = URL.createObjectURL(blob)
  musicIsCache.value = true
  if (musicAudioRef.value) {
    musicAudioRef.value.src = url
    musicLink.value = url
    musicAudioRef.value.load()
    nextTick(() => {
      musicAudioRef.value?.click()
      musicAudioRef.value?.play()
      musicPlay.value = true
    })
  }
}

// 缓存音乐
const isCaching = ref<boolean>(false)

async function fetchAndCacheMusic(key: string, originalUrl: string) {
  if (!isCaching.value) {
    try {
      if (musicAudioRef.value) {
        musicAudioRef.value.src = originalUrl;
        musicPlay.value = true
        musicIsCache.value = false
      }
      console.log('开始缓存音频文件...')
      const response = await blobDownFile(originalUrl);
      const file = await blobToArrayBuffer(response);
      await saveMusicFile(key, file);
      isCaching.value = false
      console.log('音频文件缓存成功！');
      playMusic(file);
    } catch (error) {
      console.error('Failed to fetch and cache music:', error);
    }
  }
}

// 播放上一首
function prevMusic() {
  if (hasMusic.value) {
    if (musicIndex.value > 0) {
      URL.revokeObjectURL(musicLink.value)
      musicStore().changeMusic(musicIndex.value - 1)
    } else {
      message.warning('已经是列表的第一首了，无法播放上一首哦~');
    }
  }
}

// 播放下一首
function nextMusic() {
  URL.revokeObjectURL(musicLink.value)
  if (hasMusic.value) {
    musicStore().changeMusic(musicIndex.value + 1)
  }
}

async function init() {
  const cachedFile = await getMusicFile('music-' + musicId.value)
  const blob = new Blob([cachedFile], {type: 'audio/mpeg'});
  const url = URL.createObjectURL(blob);
  if (musicAudioRef.value) {
    musicAudioRef.value.src = url;
    musicLink.value = url
    musicAudioRef.value.currentTime = musicPlayTimeNum.value
    await nextTick(() => {
      musicAudioRef.value?.load()
    })
  }
  musicIsCache.value = true
}

onMounted(() => {
  if (musicId.value !== 0) {
    hasMusic.value = true
    init()
  } else {
    hasMusic.value = false
  }
})

onUnmounted(() => {
  musicAudioRef.value?.pause()
  URL.revokeObjectURL(musicLink.value)
  musicPlay.value = false
})


// 监听音乐路径变动
watch(
    musicId,
    (newVal, oldVal) => {
      if (newVal === 0) {
        hasMusic.value = false
      } else if (newVal !== oldVal) {
        cacheAndPlayMusic()
      } else {
        if (musicAudioRef.value) {
          musicPlay.value = true
        }
      }
    }
)
// 监听其他组件内改变播放状态
watch(
    musicPlay,
    (newVal) => {
      if (musicAudioRef.value) {
        if (newVal) {
          musicAudioRef.value.click()
          musicAudioRef.value.play()
        } else {
          musicAudioRef.value.pause()
        }
      }
    }
)

</script>
<style scoped lang="scss">
.footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(100% - 40px);
  padding: 10px 20px;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.1);

  .footer-left {
    flex: 1;

    .music-item {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      overflow: hidden;
      cursor: pointer;

      .music-left {
        width: 54px;
        height: 54px;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
        margin-right: 10px;
        flex-shrink: 0;

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

          .anticon-arrows-alt {
            color: #fff;
            font-size: 26px;
          }
        }
      }

      .music-left:hover {
        .music-left-mask {
          display: flex;
        }
      }

      .music-msg {
        .name {
          font-size: 14px;
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
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
          margin-top: 5px;
        }
      }

      .music-right {
        flex-shrink: 0;
        padding: 0 20px;

        .iconfont {
          font-size: 18px;
          color: #999;
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
      }
    }
  }

  .footer-center {
    width: 360px;
    flex-shrink: 0;
    padding: 0 50px;

    .iconfont {
      cursor: pointer;
    }

    .iconfont:hover {
      color: $color;
    }

    .fc-up {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      .fc-up-box {
        width: 100px;
        text-align: center;

        .iconfont {
          font-size: 22px;
        }
      }

      .fc-up-icon {
        display: flex;
        flex-direction: row;
        align-items: center;

        .iconfont {
          color: #666;
        }

        & > .iconfont {
          margin: 0 20px;
          font-size: 20px;
        }

        & > .iconfont:hover {
          color: $color;
        }
      }
    }

    .fc-down {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;

      .time {
        flex-shrink: 0;
        font-size: 12px;
      }

      .slider {
        flex: 1;
        margin: 0 10px;
      }
    }
  }

  .footer-right {
    flex: 1;
    text-align: right;

    .iconfont {
      cursor: pointer;
      color: #888;
      font-size: 20px;
      margin-left: 20px;
    }

    .iconfont:hover {
      color: $color;
    }
  }
}

:deep( .ant-slider ) {
  .ant-slider-handle {
    display: none;
  }

  .ant-slider-track {
    background-color: #666;
  }

  .ant-slider-handle::after {
    box-shadow: 0 0 0 2px #666;
  }

  .ant-slider-handle:focus::after {
    box-shadow: 0 0 0 4px #333 !important;
  }

  .ant-slider-handle:hover::after {
    box-shadow: 0 0 0 4px #333 !important;
  }
}

:deep(.ant-slider:hover) {
  .ant-slider-handle {
    display: block;
  }
}


.play-order-item {
  padding: 10px 15px;
  border-bottom: 1px solid #f2f2f2;
  text-align: center;

  .iconfont {
    margin-right: 5px;
  }
}

.play-order-item:first-child {
  border-radius: 8px 8px 0 0;
}

.play-order-item:last-child {
  border-radius: 0 0 8px 8px;
  border-bottom: none;
}

.play-order-item:hover {
  background-color: #f2f2f2;
}

.volume-regulation-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  .volume-regulation__line {
    height: 150px;
    margin-bottom: 10px;
  }

  :deep(.volume-regulation__line ) {
    .ant-slider-track {
      background-color: $color;
    }

    .ant-slider-handle::after {
      box-shadow: 0 0 0 2px $color;
    }

    .ant-slider-handle:focus::after {
      box-shadow: 0 0 0 4px $color !important;
    }

    .ant-slider-handle:hover::after {
      box-shadow: 0 0 0 4px $color !important;
    }
  }

  .volume-regulation__btn {
    cursor: pointer;
    margin-top: 20px;
    border-top: 1px solid #f2f2f2;
    padding: 10px 20px;

    .iconfont {
      font-size: 20px;
    }
  }

  .volume-regulation__btn:hover {
    .iconfont {
      color: $color;
    }
  }
}

.icon-jingyin {
  color: $color-red;
}
</style>