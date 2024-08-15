<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { EventBus } from './EventBus';
import StartGame from './main';
import { useGameStore } from './stores/gameStore';

// Save the current scene instance
const scene = ref();
const game = ref();
const store = useGameStore()

const emit = defineEmits(['current-active-scene']);

onMounted(() => {
  
  game.value = StartGame('game-container');
  console.log(store.selectedUnit)
  
  EventBus.on('current-scene-ready', (currentScene) => {
    
    emit('current-active-scene', currentScene);
    
    scene.value = currentScene;
    
  });
  
});

onUnmounted(() => {
  if (game.value)
  {
    game.value.destroy(true);
    game.value = null;
  }
  
});

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

defineExpose({ scene, game });
</script>

<template>
  <div id="game-container"></div>
</template>