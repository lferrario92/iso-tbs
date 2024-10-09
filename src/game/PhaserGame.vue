<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { EventBus } from './EventBus'
import StartGame from './main'
import { useGameStore } from './stores/gameStore'

// Save the current scene instance
const scene = ref()
const game = ref()
const store = useGameStore()

const emit = defineEmits(['current-active-scene'])

onMounted(() => {
  game.value = StartGame('game-container')
  console.log(store.selectedUnit)

  EventBus.on('current-scene-ready', (currentScene) => {
    emit('current-active-scene', currentScene)

    scene.value = currentScene
  })

  const OnChangeScreen = () => {
    let isLandscape = screen.orientation.type.includes('landscape')
    let rotateAlert = document.getElementById('rotateAlert')
    if (isLandscape) {
      game.value.isPaused = false
      if (rotateAlert.classList.contains('flex')) {
        rotateAlert.classList.replace('flex', 'hidden')
      } else {
        rotateAlert.classList.add('hidden')
      }
    } else {
      game.value.isPaused = true
      if (rotateAlert.classList.contains('hidden')) {
        rotateAlert.classList.replace('hidden', 'flex')
      } else {
        rotateAlert.classList.add('flex')
      }
    }
  }
  OnChangeScreen()

  let _orientation = screen.orientation || screen.mozOrientation || screen.msOrientation
  _orientation.addEventListener('change', function (e) {
    OnChangeScreen()
  })
  window.addEventListener('resize', function (e) {
    OnChangeScreen()
  })
})

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true)
    game.value = null
  }
})

EventBus.on('selectUnit', (unit) => {
  store.selectUnit(unit)
})

EventBus.on('removeAllMobableMarker', (chess) => {
  store.removeAllMobableMarker(chess)
})

EventBus.on('removeAllActionMarker', (chess) => {
  store.removeAllActionMarker(chess)
})

EventBus.on('clearUI', (chess) => {
  store.removeAllMobableMarker(chess)
  store.removeAllActionMarker(chess)
})

defineExpose({ scene, game })
</script>

<template>
  <div>
    <div id="game-container"></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden flex-col items-center justify-center bg-[#b75e84] w-full h-screen"
      id="rotateAlert"
    >
      <svg
        class="w-20 h-20 sm:w-32 sm:h-32 fill-white"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.323 8.616l-4.94-4.94a1.251 1.251 0 0 0-1.767 0l-10.94 10.94a1.251 1.251 0 0 0 0 1.768l4.94 4.94a1.25 1.25 0 0 0 1.768 0l10.94-10.94a1.251 1.251 0 0 0 0-1.768zM14 5.707L19.293 11 11.5 18.793 6.207 13.5zm-4.323 14.91a.25.25 0 0 1-.354 0l-1.47-1.47.5-.5-2-2-.5.5-1.47-1.47a.25.25 0 0 1 0-.354L5.5 14.207l5.293 5.293zm10.94-10.94l-.617.616L14.707 5l.616-.616a.25.25 0 0 1 .354 0l4.94 4.94a.25.25 0 0 1 0 .353zm1.394 6.265V18a3.003 3.003 0 0 1-3 3h-3.292l1.635 1.634-.707.707-2.848-2.847 2.848-2.848.707.707L15.707 20h3.304a2.002 2.002 0 0 0 2-2v-2.058zM4 9H3V7a3.003 3.003 0 0 1 3-3h3.293L7.646 2.354l.707-.707 2.848 2.847L8.354 7.34l-.707-.707L9.28 5H6a2.002 2.002 0 0 0-2 2z"
        />
        <path fill="none" d="M0 0h24v24H0z" />
      </svg>
      <span class="text-white text-center block text-sm sm:text-2xl"
        >Please rotate your device to landscape mode</span
      >
    </div>
  </div>
</template>
