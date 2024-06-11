<script lang="ts" setup>
import type { Role } from '@/api/types/role'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { getRoleList } from '@/api/role'
import * as TWEEN from '@tweenjs/tween.js'

useHead({
  meta: [
    { name: 'referrer', content: 'no-referrer' }
  ]
})
const config = reactive({
  width: 1080,
  height: 600,
  camera: {
    fov: 45,
    aspect: 1080 / 600,
    near: 1,
    far: 1000,
    position: {
      z: 50
    }
  },
  avatarSize: 1,
  randomPosition: {
    minRadius: 0,
    maxRadius: 20,
    exclusionRadius: 3
  },
  avatarAnimate: {
    offset: 0.2
  }
})

let canvas: HTMLCanvasElement
const mousePosition = new THREE.Vector2()
let clickPosition: THREE.Vector2 | null = null

onMounted(async () => {
  clacCanvasSize()

  canvas = document.getElementById('canvas') as HTMLCanvasElement

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  })
  renderer.setSize(config.width, config.height)
  renderer.setClearColor(0xFFC743, 0.3)

  const scene = new THREE.Scene()
  
  const loader = new THREE.TextureLoader()

  const camera = new THREE.PerspectiveCamera(
    config.camera.fov,
    config.camera.aspect,
    config.camera.near,
    config.camera.far
  )
  camera.position.z = config.camera.position.z

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false
  controls.enableDamping = true // 可选：启用阻尼效果，使动画平滑
  const eventHelper = new EventHelper()

  const { data } = await getRoleList()
  const roles = data.filter(v => {
    v.relationships = v.relationships || []
    return Boolean(v.avatar)
  })
  roles.sort((a, b) => {
    return b.relationships.length - a.relationships.length
  })
  const positions = []
  for (let i = 0; i < roles.length; i++) {
    let foundValidPosition = false
    const radius = config.randomPosition.minRadius +
      (config.randomPosition.maxRadius - config.randomPosition.minRadius) *
      (1 - roles[i].relationships.length / (Math.max(...roles.map(role => role.relationships.length)) || 1))
    
    while (!foundValidPosition) {
      const [x, y] = getRandomPosition(radius)
      if (isPositionValid(x, y, positions, config.randomPosition.exclusionRadius)) {
        roles[i].x = x
        roles[i].y = y
        positions.push([x, y])
        foundValidPosition = true
      }
    }
    const avatar = drawAvatar(loader, scene, roles[i], i)
    animateAvatar(avatar)
    drawLines(scene, roles[i], roles)
  }

  function render()  {
    requestAnimationFrame(render)
		if (resizeRendererToDisplaySize(renderer)) {
			camera.aspect = config.camera.aspect
			camera.updateProjectionMatrix()
		}
    eventHelper.pick(mousePosition, scene, camera)
    if (clickPosition) {
      eventHelper.tap(clickPosition, scene, camera)
    }
    TWEEN.update()
    controls.update()
    renderer.render(scene, camera)
  }

  requestAnimationFrame(render)

  window.addEventListener('resize', clacCanvasSize)
  window.addEventListener('click', handleClick)
  window.addEventListener('mousemove', setMousePosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', clacCanvasSize)
  window.removeEventListener('mousemove', setMousePosition)
})

class EventHelper {
  raycaster: THREE.Raycaster;
  pickedObject: THREE.Mesh | null;
  constructor() {
    this.raycaster = new THREE.Raycaster()
    this.pickedObject = null
  }
  pick(normalizedPosition: THREE.Vector2, scene: THREE.Scene, camera: THREE.Camera) {

    if (this.pickedObject) {
      resetAvatar(this.pickedObject);
      this.pickedObject = null;
    }

    this.raycaster.setFromCamera(normalizedPosition, camera)
    const intersectedObjects = this.raycaster.intersectObjects(scene.children)
    if (intersectedObjects.length) {
      this.pickedObject = intersectedObjects[0].object as THREE.Mesh
      highlightAvatar(this.pickedObject)
    }
  }

  tap(normalizedPosition: THREE.Vector2, scene: THREE.Scene, camera: THREE.Camera) {
    this.raycaster.setFromCamera(normalizedPosition, camera)
    const intersectedObjects = this.raycaster.intersectObjects(scene.children)
    if (intersectedObjects.length) {
      const obj = intersectedObjects[0].object
      navigateTo('/role/' + obj.id)
    }
    clickPosition = null
  }
}
function setMousePosition(event: MouseEvent) {
  const { x, y } = getMousePosition(event)
  mousePosition.x = x
  mousePosition.y = y
}
function getMousePosition(event: MouseEvent) {
  const rect = canvas.getBoundingClientRect()
  const pos = {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  }
  return {
    x: (pos.x / canvas.width ) *  2 - 1,
    y: (pos.y / canvas.height) * -2 + 1
  }
}
function clacCanvasSize() {
  config.width = document.body.clientWidth
  config.height = document.body.clientHeight - 60
  config.camera.aspect = config.width / config.height
}
function handleClick(event: MouseEvent) {
  const { x, y } = getMousePosition(event)
  clickPosition = new THREE.Vector2(x, y)
}
function highlightAvatar(avatar: THREE.Mesh) {
    // 放大头像
    new TWEEN.Tween(avatar.scale)
        .to({ x: 1.4, y: 1.4, z: 1.4 }, 100)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    // 更改鼠标指针
    document.body.style.cursor = 'pointer';
}

function resetAvatar(avatar: THREE.Mesh) {
    // 还原头像大小
    new TWEEN.Tween(avatar.scale)
        .to({ x: 1, y: 1, z: 1 }, 300)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();

    // 还原鼠标指针
    document.body.style.cursor = 'default';
}

function animateAvatar(avatar: THREE.Mesh<THREE.CircleGeometry>) {
  const initialPosition = {
    x: avatar.position.x,
    y: avatar.position.y
  }
  avatar.rotation.z = Math.random() * 2 * Math.PI
  const rotationSpeed = Math.random() * (40000 - 20000) + 20000
  function move(initialPosition : { x: number, y: number }) {
    const tagetPosition = {
      x: initialPosition.x + (Math.random() - 0.5) * config.avatarAnimate.offset,
      y: initialPosition.y + (Math.random() - 0.5) * config.avatarAnimate.offset
    }

    new TWEEN.Tween(avatar.position)
      .to(tagetPosition, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(move) // 完成后继续下一次移动
      .start();
  }
  function rotate() {
    new TWEEN.Tween(avatar.rotation)
      .to({ z: avatar.rotation.z + Math.PI * 2 }, rotationSpeed) // 20秒内旋转360度
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(rotate) // 完成后继续下一次旋转
      .start();
  }
  move(initialPosition)
  rotate()
}

function drawAvatar(loader: THREE.TextureLoader, scene: THREE.Scene, role: Role, index: number) : THREE.Mesh<THREE.CircleGeometry> {
  const geometry = new THREE.CircleGeometry(config.avatarSize, 80)
  const texture = loader.load(role.avatar)
  const material = new THREE.MeshBasicMaterial({
    map: texture
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.x = role.x || 0
  cube.position.y = role.y || 0
  cube.position.z = role.z || 0
  cube.userData.role = role
  scene.add(cube)
  return cube
}

function drawLines(scene: THREE.Scene, role: Role, roles: Role[] = []) {
  const { x: startX, y: startY } = role
  role.relationships.forEach(v => {
    const target = roles.find(r => r.id === v.targetId)
    if (target) {
      const { x: endX, y: endY } = target
      const material = new THREE.LineBasicMaterial({ color: 0xffffff })
      const points = []
      points.push(new THREE.Vector3(startX, startY, -0.1))
      points.push(new THREE.Vector3(endX, endY, -0.1))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, material)
      scene.add(line)
    }
  })
}

function getRandomPosition(radius: number) : number[] {
  const angle = Math.random() * 2 * Math.PI
  const distance = Math.random() * radius
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance
  return [x, y]
}

function isPositionValid(x: number, y: number, positions: number[][], exclusionRadius: number) : boolean {
  for (let i = 0; i < positions.length; i++) {
    const [px, py] = positions[i]
    if (Math.hypot(px - x, py - y) < exclusionRadius) {
        return false
    }
  }
  return true
}
</script>
<template>
  <div class="page-container">
    <canvas id="canvas" :width="config.width" :height="config.height" />
  </div>
</template>
<style lang="scss" scoped>
.page-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>