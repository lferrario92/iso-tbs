<script setup>
import Phaser from 'phaser'
import { ref, toRaw } from 'vue'
import PhaserGame from './game/PhaserGame.vue'
import { EventBus } from './game/EventBus'
import { addActionMarkersTo } from './game/helpers'

// The sprite can only be moved in the MainMenu Scene
const canMoveSprite = ref()

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref()
const spritePosition = ref({ x: 0, y: 0 })
const selectedUnit = ref(null)

EventBus.on('selectUnit', (unit) => {
  console.log(unit)
  selectedUnit.value = unit
})

const changeScene = () => {
  const scene = toRaw(phaserRef.value.scene)

  if (scene) {
    //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
    scene.changeScene()
  }
}

const startCutscene = () => {
  const scene = toRaw(phaserRef.value.scene)

  if (scene) {
    //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
    scene.startCutscene()
  }
}

const endTurn = () => {
  EventBus.emit('endTurn')
}

const moveSprite = () => {
  const scene = toRaw(phaserRef.value.scene)

  if (scene) {
    //  Call the `moveLogo` method in the `MainMenu` Scene and capture the sprite position
    scene.moveLogo(({ x, y }) => {
      spritePosition.value = { x, y }
    })
  }
}

const addSprite = () => {
  const scene = toRaw(phaserRef.value.scene)

  if (scene) {
    //  Add a new sprite to the current scene at a random position
    const x = Phaser.Math.Between(64, scene.scale.width - 64)
    const y = Phaser.Math.Between(64, scene.scale.height - 64)

    //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
    const star = scene.add.sprite(x, y, 'star')

    //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
    //  You could, of course, do this from within the Phaser Scene code, but this is just an example
    //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
    scene.add.tween({
      targets: star,
      duration: 500 + Math.random() * 1000,
      alpha: 0,
      yoyo: true,
      repeat: -1
    })
  }
}

EventBus.on('shortBowAttack', () => {
  shortBowAttack()
})

EventBus.on('specialLineAttack', () => {
  specialLineAttack()
})

const specialAttack = () => {
  EventBus.emit('clearUI', selectedUnit.value)
  if (selectedUnit.value.hasActed) {
    return
  }
  addActionMarkersTo(
    selectedUnit.value,
    selectedUnit.value.rexChess.board.ringToTileXYArray(selectedUnit.value.rexChess.tileXYZ, 1)
  )
}

const specialLineAttack = () => {
  EventBus.emit('clearUI', selectedUnit.value)
  if (selectedUnit.value.hasActed) {
    return
  }
  const board = selectedUnit.value.rexChess.board

  const coords = [
    ...board.getNeighborTileXY(selectedUnit.value.rexChess.tileXYZ, [0, 1, 2, 3]),
    ...board.getTileXYAtDirection(selectedUnit.value.rexChess.tileXYZ, null, 2)
  ]
  addActionMarkersTo(selectedUnit.value, coords)
}

const shortBowAttack = () => {
  EventBus.emit('clearUI', selectedUnit.value)
  if (selectedUnit.value.hasActed) {
    return
  }
  const board = selectedUnit.value.rexChess.board

  selectedUnit.value.attackType = 'Bow'

  const coords = [
    ...board.getNeighborTileXY(selectedUnit.value.rexChess.tileXYZ, [4, 5, 6, 7]),
    ...board.getTileXYAtDirection(selectedUnit.value.rexChess.tileXYZ, null, 2)
  ]
  addActionMarkersTo(selectedUnit.value, coords)
}

const fullScreen = () => {
  const scene = toRaw(phaserRef.value.scene)

  scene.scale.startFullscreen()
}
//  This event is emitted from the PhaserGame component:
const currentScene = (scene) => {
  canMoveSprite.value = scene.scene.key !== 'MainMenu'
}
</script>

<template>
  <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
  <button @click="fullScreen" class="fixed top-0 right-0 p-2 bg-slate-100">FS</button>
  <div class="fixed bottom-0">
    <div style="font-family: 'PublicPixel'; position: absolute; left: -1000px; visibility: hidden">
      .
    </div>

    <div class="flex" v-if="false">
      <button class="button" @click="changeScene">Change Scene</button>
      <button class="button" @click="endTurn">End turn</button>
      <button class="button" @click="startCutscene">startCutscene</button>
      <button class="button" @click="specialAttack">specialAttack</button>
      <button class="button" @click="shortBowAttack">showtBowAttack</button>
      <button class="button" @click="specialLineAttack">speciaLinelAttack</button>
    </div>
    <div v-if="false">
      <button :disabled="canMoveSprite" class="button" @click="moveSprite">Toggle Movement</button>
    </div>
    <div v-if="false">
      <button class="button" @click="addSprite">Add New Sprite</button>
    </div>
  </div>
</template>

<style media="screen" type="text/css">
body {
  background-color: wheat;
}
@font-face {
  font-family: PublicPixel;
  src: url('assets/PublicPixel-E447g.ttf');
  font-weight: 400;
  font-weight: normal;
}
</style>
