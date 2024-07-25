<template>
  <div class="component-box">
    <div class="index-title">Hi 测试账号 今日为您推荐</div>
    <div class="index-grid">
      <div class="index-grid-two">
        <div class="grid-two-up">
          <div class="t-left">
            <p class="p1">迷茫的人</p>
            <p class="p2">尝试来点振奋人心的音乐吧</p>
            <div class="begin-btn" @click="recommendationPlay">
              <span class="iconfont icon-bofang"></span>
            </div>
          </div>
          <div class="t-right">
            <img class="t-right__img" :src="stitchTheImageUrl(recommendation.img)" alt="">
            <img class="t-right__film" src="/image/film.png" alt="">
          </div>
        </div>
        <div class="grid-item-down">
          <p class="p1">{{ recommendation.title }}{{recommendation.author_name ? ' —— ' + recommendation.author_name : ''}}</p>
          <p class="p2">猜你喜欢</p>
        </div>
      </div>
      <div class="index-grid-item">
        <div class="gird-item-up">
          <img src="/image/301.jpeg" alt="">
          <div class="grid-item__count">3000万</div>
          <div class="grid-item-mask">
            <div class="begin-btn">
              <span class="iconfont icon-bofang"></span>
            </div>
          </div>
        </div>
        <router-link to="/songList/1" class="grid-item-down">
          <p class="p1">不负人间 -- 啊YueYue</p>
          <p class="p2">每日30首</p>
        </router-link>
      </div>
      <div class="index-grid-item">
        <div class="gird-item-up">
          <img src="/image/302.jpeg" alt="">
          <div class="grid-item__count">3000万</div>
          <div class="grid-item-mask">
            <div class="begin-btn">
              <span class="iconfont icon-bofang"></span>
            </div>
          </div>
        </div>
        <div class="grid-item-down">
          <p class="p1">当你孤单你会想起谁 -- HENRY刘宪华</p>
          <p class="p2">百万收藏</p>
        </div>
      </div>
    </div>
    <div class="index-title">您的私人推荐歌单</div>
    <div class="index-grid">
      <div class="index-grid-item" v-for="item in songList" :key="item.id">
        <div class="gird-item-up">
          <img :src="item.img" alt="">
          <div class="grid-item__count">{{ numberToChineseUnit(item.count) }}</div>
          <div class="grid-item-mask">
            <div class="begin-btn">
              <span class="iconfont icon-bofang"></span>
            </div>
          </div>
        </div>
        <div class="grid-item-down">
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
    <div class="index-title">
      <span>值的收藏的宝藏歌曲</span>
      <div class="begin-btn">
        <span class="iconfont icon-bofang"></span>
      </div>
    </div>
    <div class="index-grid-music">
      <div class="music-item" v-for="item in music" :key="item.id">
        <div class="music-left">
          <img class="music-img" :src="item.img" alt="">
          <div class="music-left-mask">
            <span class="iconfont icon-bofang"></span>
          </div>
        </div>
        <div class="music-msg">
          <p class="name">{{ item.title }}</p>
          <p class="author">{{ item.author }}</p>
        </div>
        <div class="music-right">
          <span class="iconfont icon-sc-act" v-if="item.collect"></span>
          <span class="iconfont icon-sc" v-else></span>
          <span class="iconfont icon-gengduo"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {onMounted, ref} from "vue";
import {numberToChineseUnit, stitchTheImageUrl} from "@/utils";
import {getHomeRecommendation} from "@/api";
import {musicStore} from "@/store/modules/music.ts";
import {storeToRefs} from "pinia";

const recommendation = ref<MusicType>({
  album_id: 0, author_id: 0, id: 0, img: "", issued_time: "", link: "", status: 0, title: "", views: 0
})

const { musicList , musicIndex } = storeToRefs(musicStore())

function recommendationPlay() {
  if (musicList.value.findIndex((item) => item.id === recommendation.value.id) === -1) {
    musicList.value.push(recommendation.value)
  } else {
    musicIndex.value = musicList.value.findIndex((item) => item.id === recommendation.value.id)
  }
  musicStore().setMusicAuthor(recommendation.value?.author_name ?? '未知')
  musicStore().setMusicTitle(recommendation.value.title)
  musicStore().setMusicLink(recommendation.value.link)
  musicStore().setMusicId(recommendation.value.id)
  musicStore().setMusicImg(recommendation.value.img)
  musicStore().setMusicIsCache(false)
  musicStore().setMusicPlayTime("00:00")
  musicStore().setMusicPlayTimeNum(0)
}


async function init() {
  const {data: res} = await getHomeRecommendation()
  if (res.code === 200) {
    recommendation.value = res.data
  }
}

onMounted(() => {
  init()
})


const songList = ref([
  {
    id: 1,
    title: '一听就上头！近期超火的抖音热歌',
    img: '/image/302.jpeg',
    count: 120000000,
  },
  {
    id: 2,
    title: '远方的山和眼前的她',
    img: '/image/303.jpeg',
    count: 1432000,
  },
  {
    id: 3,
    title: '远方的山和眼前的她',
    img: '/image/303.jpeg',
    count: 1432000,
  },
  {
    id: 4,
    title: '远方的山和眼前的她',
    img: '/image/303.jpeg',
    count: 1432000,
  },
  {
    id: 5,
    title: '远方的山和眼前的她',
    img: '/image/303.jpeg',
    count: 1432000,
  },
  {
    id: 6,
    title: '远方的山和眼前的她',
    img: '/image/303.jpeg',
    count: 1432000,
  },
  {
    id: 7,
    title: '远方的山和眼前的她',
    img: '/image/303.jpeg',
    count: 1432000,
  },
  {
    id: 8,
    title: '远方的山和眼前的她',
    img: '/image/303.jpeg',
    count: 1432000,
  }
])

const music = ref([
  {
    id: 1,
    title: 'See You Again',
    author: 'Wiz khalifa & Charlie Puth',
    img: '/image/305.jpeg',
    collect: false,
  },
  {
    id: 2,
    title: 'See You Again2',
    author: 'Wiz khalifa & Charlie Puth',
    img: '/image/305.jpeg',
    collect: true,
  },
  {
    id: 3,
    title: 'See You Again3',
    author: 'Wiz khalifa & Charlie Puth',
    img: '/image/305.jpeg',
    collect: true,
  },
  {
    id: 4,
    title: 'See You Again4',
    author: 'Wiz khalifa & Charlie Puth',
    img: '/image/305.jpeg',
    collect: false,
  }
])
</script>
<style scoped lang="scss">
.index-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;

  .begin-btn {
    display: inline-block;
    margin-left: 15px;
    background-color: #f2f2f2;
  }

  .begin-btn:hover {
    background-color: #E1F2ED;

    .iconfont {
      color: #1ECC94;
    }
  }
}

.index-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 40px 30px;
  margin-bottom: 30px;

  .index-grid-two {
    grid-column: span 2;
    display: flex;
    flex-direction: column;

    .grid-two-up {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      background: linear-gradient(to right top, #C7D8EA, #DEB7A8);
      border-radius: 5px;
      padding: 20px;
      overflow: hidden;
      /* 添加过渡效果 */
      transition: transform 0.3s ease-out;

      .t-left {
        padding: 0 20px;
        flex: 1;

        .p1 {
          font-size: 18px;
          margin-bottom: 5px;
        }

        .p2 {
          font-size: 14px;
          margin-bottom: 5px;
        }
      }

      .t-right {
        flex: 1;
        position: relative;
        overflow: hidden;
        padding-right: 30px;

        .t-right__img {
          position: absolute;
          width: auto;
          height: 100%;
          object-fit: contain;
        }

        .t-right__film {
          height: 100%;
          width: auto;
          margin-left: 30px;
        }
      }
    }

    .grid-two-up:hover {
      /* 向上移动15px */
      transform: translateY(-15px);
    }
  }

  .grid-item-down {
    display: block;
    flex-shrink: 0;
    margin-top: 10px;

    p {
      font-size: 12px;
      line-height: 20px;
      color: #888;
      cursor: pointer;
    }

    p:hover {
      color: $color;
    }

    .p1 {
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .p2 {
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }

  .index-grid-item {
    width: 100%;
    height: 100%;

    .gird-item-up {
      flex: 1;
      border-radius: 5px;
      position: relative;
      overflow: hidden;
      /* 添加过渡效果 */
      transition: transform 0.3s ease-out;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .grid-item__count {
        position: absolute;
        right: 10px;
        bottom: 10px;
        color: #fff;
        font-size: 14px;
      }

      .grid-item-mask {
        display: none;
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        cursor: pointer;

        .begin-btn {
          position: absolute;
          left: 20px;
          bottom: 20px;
        }
      }
    }

    .gird-item-up:hover {
      /* 向上移动15px */
      transform: translateY(-15px);

      .grid-item-mask {
        display: block;
      }
    }
  }
}

.index-grid-music {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px 40px;
  .music-item {
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

        .iconfont {
          color: #fff;
          font-size: 16px;
        }
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
      padding: 0 20px;
      display: none;;

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
}

@media (min-width: 1200px) {
  .index-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  .index-grid-music {
    grid-template-columns: repeat(4, 1fr);
  }
}

</style>