<template>
  <div class="menu">
    <div class="menu-logo" data-tauri-drag-region>Tauri音乐</div>
    <div class="menu-list">
      <div class="menu-list__title">在线音乐</div>
      <router-link to="" class="menu-list__item menu-list__activity">
        <HomeOutlined />
        <HomeFilled />
        <span class="span">首页</span>
      </router-link>
      <router-link to="" class="menu-list__item">
        <CompassOutlined />
        <CompassFilled />
        <span class="span">乐馆</span>
      </router-link>
    </div>
    <div class="menu-list">
      <div class="menu-list__title">我的音乐</div>
      <router-link to="" class="menu-list__item">
        <HeartOutlined />
        <HeartFilled />
        <span class="span">喜欢</span>
      </router-link>
      <router-link to="" class="menu-list__item">
        <CustomerServiceOutlined />
        <CustomerServiceFilled />
        <span class="span">最近播放</span>
      </router-link>
      <router-link to="" class="menu-list__item">
        <FolderOutlined />
        <FolderFilled />
        <span class="span">本地和下载</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.menu {
  width: 220px;
  padding: 0 20px 20px 20px;
  .menu-logo {
    font-size: 30px;
    font-weight: 700;
    height: 80px;
    display: flex;
    align-items: center;
  }
  .menu-list {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    .menu-list__title {
      font-size: 14px;
      padding: 5px 10px;
    }
    .menu-list__item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 12px 10px;
      border-radius: 5px;
      margin: 2px 0;
      cursor: pointer;
      span:first-child {
        font-size: 18px;
        margin-right: 10px;
      }
      span:nth-child(2) {
        display: none;
        font-size: 18px;
        margin-right: 10px;
      }
      .span {
        font-size: 14px;
        line-height: 18px;
      }
    }
    .menu-list__item:hover {
      background-color: #e9e9e9;
    }
    .menu-list__activity {
      span:first-child {
        display: none;
      }
      span:nth-child(2) {
        display: block;
      }
      background-color: #E3E3E3;
    }
  }
}
</style>