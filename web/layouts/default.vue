<template>
  <div class="default-layout">
    <div class="top-box w-full">
      <div class="log">crayon-shin-chan</div>
      <div>
        <div class="nav-bar">
          <NuxtLink
            v-for="item in routes"
            :key="item.path"
            :to="item.path"
            class="nav-item"
          >
            {{ item.title }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
const routes = [
  { path: '/', title: '首页' },
  // { path: '/community', title: '社区' },
  { path: '/role', title: '人物志' },
  // { path: '/kasukabe', title: '春日部' }
]
</script>

<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
  background-image: url(@/assets/images/layouts/default/page-bg.png);

  .top-box {
    position: sticky;
    top: 0;
    margin: 0 auto;
    height: 60px;
    padding: 0 20px;
    line-height: 60px;
    display: flex;
    align-items: center;
    background-color: #fff;
    justify-content: space-between;
    border-bottom: 1px solid #eee;

    .nav-bar {
      height: 100%;
      .nav-item {
        height: 100%;
        padding: 20px;
      }
    }
  }
}
</style>