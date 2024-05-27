<template>
  <div class="page-container">
    <canvas id="canvas" :width="config.width" :height="config.height" />
  </div>
</template>

<script lang="ts" setup>
import roles from './role'
import type { Role } from './role'
import * as THREE from 'three'

const config = reactive({
  width: 1080,
  height: 600,
  camera: {
    fov: 45,
    aspect: 1080 / 600,
    near: 1,
    far: 1000,
    position: {
      z: 20
    }
  },
  avatarSize: 1
})
const maxRelationships = Math.max(...roles.map(role => role.relationships.length))

onMounted(() => {
  draw()
})

function draw() {
  const canvas = document.getElementById('canvas')
  if (!canvas) return
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas as HTMLCanvasElement,
    antialias: true
  })
  renderer.setSize(config.width, config.height)
  // renderer.setClearColor(0x000000, 0)
  const scene = new THREE.Scene()

  const loader = new THREE.TextureLoader()

  const camera = new THREE.PerspectiveCamera(
    config.camera.fov,
    config.camera.aspect,
    config.camera.near,
    config.camera.far
  )
  camera.position.z = config.camera.position.z

  for (let i = 0; i < roles.length; i++) {
    const { x, y, z } = calcRolePositon(roles[i], i)
    roles[i].x = x
    roles[i].y = y
    roles[i].z = z
    drawAvatar(loader, scene, roles[i], i)
    drawLines(scene, roles[i])
  }
  function render(time: number)  {
    time *= 0.001
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement
			camera.aspect = canvas.clientWidth / canvas.clientHeight
			camera.updateProjectionMatrix()
		}
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

function drawAvatar(loader: THREE.TextureLoader, scene: THREE.Scene, role: Role, index: number) {
  const geometry = new THREE.CircleGeometry(config.avatarSize, 80)
  const texture = loader.load(role.avatar)
  const material = new THREE.MeshBasicMaterial({
    map: texture
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.x = role.x || 0
  cube.position.y = role.y || 0
  cube.position.z = role.z || 0
  scene.add(cube)
}

function drawLines(scene: THREE.Scene, role: Role) {
  const { x: startX, y: startY } = role
  role.relationships.forEach(v => {
    const target = roles.find(r => r.id === v.targetId)
    if (target) {
      const { x: endX, y: endY } = target
      const material = new THREE.LineBasicMaterial({ color: 0xffffff })
      const points = []
      points.push(new THREE.Vector3(startX, startY, 0))
      points.push(new THREE.Vector3(endX, endY, 0))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, material)
      scene.add(line)
    }
  })
}

function calcRolePositon(role: Role, index: number) : {
  x: number,
  y: number,
  z: number
} {
  const numRelationships = role.relationships.length
  const radius = 10 * (1 - numRelationships / maxRelationships)
  const angle = (index / roles.length) * 2 * Math.PI
  const x = radius * Math.cos(angle)
  const y = radius * Math.sin(angle)
  return {
    x, y, z: 0
  }
}
function getCameraViewSize(camera: THREE.PerspectiveCamera) {
  const vFOV = camera.fov * Math.PI / 180
  const height = 2 * Math.tan(vFOV / 2) * camera.position.z
  const width = height * camera.aspect 
  return { width, height }
}
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>