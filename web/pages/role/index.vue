<template>
  <div class="page-container">
    <div id="canvas" />
  </div>
</template>

<script lang="ts" setup>
// import roles from './role'
// import type { Role } from './role'
import * as THREE from 'three';
const config = reactive({
  width: 1080,
  height: 600,
  avatarSize: 80
})
onMounted(() => {
  drawPicture()
})

function drawPicture() {
  // todo
}

// function drawRole(role: Role, x: number, y: number, canvas: any) {
// }

</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  align-items: center;
  justify-content: center;

  #canvas {
    margin: 0 auto;
  }
}
</style>