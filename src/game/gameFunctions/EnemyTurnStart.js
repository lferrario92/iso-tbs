import { EventBus } from '../EventBus'
import { delay, RandomFromArray } from '../helpers'
import { useEnemyStore } from '../stores/enemyStore'
import { useGameStore } from '../stores/gameStore'

const focusCameraOnUnit = async (scene, unit, duration = 500) => {
  const camera = scene.cameras.main
  const startX = camera.scrollX
  const startY = camera.scrollY
  const targetX = unit.x - camera.width / 2
  const targetY = unit.y - camera.height / 2
  
  await new Promise(resolve => {
    scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration,
      ease: 'Cubic.InOut',
      onUpdate: (tween) => {
        const v = tween.getValue()
        camera.scrollX = startX + (targetX - startX) * v
        camera.scrollY = startY + (targetY - startY) * v
      },
      onComplete: resolve
    })
  })
  
  return delay(200) // Brief pause after camera movement
}

export const enemyTurnStart = async (enemies, players) => {
  const store = useGameStore()
  const enemyStore = useEnemyStore()
  console.log('enemy turn')
  enemyStore.currentEnemy = 0
  
  // Show enemy turn text
  if (enemies[0]?.scene) {
    const scene = enemies[0].scene.scene.get('UI')
    if (scene) {
      const turnText = createTurnText(scene, 'Enemy Turn Start')
      
      // Fade in
      scene.tweens.add({
        targets: turnText,
        alpha: 1,
        duration: 250,
        ease: 'Linear'
      })
      
      await delay(500)
      
      // Fade out
      scene.tweens.add({
        targets: turnText,
        alpha: 0,
        duration: 250,
        ease: 'Linear',
        onComplete: () => turnText.destroy()
      })
      
      await delay(250) // Wait for fade out to complete
    }
  }
  
  // Disable input during enemy turn
  const scene = enemies[0]?.scene
  if (scene) {
    scene.input.enabled = false
  }

  for (let index = 0; index < enemies.length; index++) {
    const enemy = enemies[index]
    if (!enemy) {
      continue
    }
    
    // Focus camera on current enemy
    if (enemy.scene) {
      await focusCameraOnUnit(enemy.scene, enemy)
    }

    EventBus.emit('clearUI', enemy)

    enemy.resetMoveFlag()
    enemy.resetActedFlag()
    let filteredPlayers = players.filter((x) => x.active)
    await enemy.moveTowardsPlayer(filteredPlayers)

    await delay(500)
    // await enemy.checkPossibleAction()
    // await store.fightCutscene()
  }
  
  // Center camera on the middle of the board before ending turn
  if (enemies[0]?.scene) {
    const scene = enemies[0].scene
    const board = enemies[0].rexChess.board
    const boardWidth = board.width
    const boardHeight = board.height
    const centerTile = { x: Math.floor(boardWidth / 2), y: Math.floor(boardHeight / 2) }
    const worldXY = board.grid.getWorldXY(centerTile.x, centerTile.y)
    await focusCameraOnUnit(scene, { x: worldXY.x, y: worldXY.y })
  }
  
  // Show player turn text for battle
  if (enemies[0]?.scene) {
    const scene = enemies[0].scene.scene.get('UI')
    if (scene) {
      const turnText = createTurnText(scene, 'Player Turn Start')
      
      // Fade in
      scene.tweens.add({
        targets: turnText,
        alpha: 1,
        duration: 250,
        ease: 'Linear'
      })
      
      await delay(500)
      
      // Fade out
      scene.tweens.add({
        targets: turnText,
        alpha: 0,
        duration: 250,
        ease: 'Linear',
        onComplete: () => turnText.destroy()
      })
      
      await delay(250) // Wait for fade out to complete
    }
  }
  
  EventBus.emit('endTurn')
}

const playEnemy = async (enemy) => {
  if (!enemy) {
    return
  }

  EventBus.emit('clearUI', enemy)

  enemy.resetMoveFlag()
  enemy.resetActedFlag()
  let filteredPlayers = players.filter((x) => x.active)
  await enemy.moveTowardsPlayer(filteredPlayers)
}

const createTurnText = (scene, text) => {
  const { width, height } = scene.scale
  const turnText = scene.add.text(width / 2, height / 2, text, {
    fontSize: '48px',
    fontFamily: 'Arial',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4,
    shadow: { offsetY: 2, color: '#000000', blur: 4, stroke: true, fill: true }
  })
  turnText.setOrigin(0.5)
  turnText.setAlpha(0)
  return turnText
}

export const enemyOverworldTurnStart = async (units) => {
  if (units.length === 0) {
    EventBus.emit('endTurnOverworld')
    return
  }
  
  const scene = units[0].scene.scene.get('OverworldUI')
  scene.input.enabled = false
  const turnText = createTurnText(scene, 'Enemy Turn Start')
  
  // Fade in
  scene.tweens.add({
    targets: turnText,
    alpha: 1,
    duration: 250,
    ease: 'Linear'
  })
  
  await delay(500)
  
  // Fade out
  scene.tweens.add({
    targets: turnText,
    alpha: 0,
    duration: 250,
    ease: 'Linear',
    onComplete: () => turnText.destroy()
  })

  for (let index = 0; index < units.length; index++) {
    const unit = units[index]
    if (!unit.active) {
      return
    }
    
    await delay(100)
    const overworldScene = units[0].scene
    
    // Pan camera to current unit
    const camera = overworldScene.cameras.main
    const startX = camera.scrollX
    const startY = camera.scrollY
    const targetX = unit.x - camera.width / 2
    const targetY = unit.y - camera.height / 2
    
    // Smooth camera pan
    await new Promise(resolve => {
      overworldScene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 500,
        ease: 'Cubic.InOut',
        onUpdate: (tween) => {
          const v = tween.getValue()
          camera.scrollX = startX + (targetX - startX) * v
          camera.scrollY = startY + (targetY - startY) * v
        },
        onComplete: resolve
      })
    })
    
    await delay(200) // Brief pause after camera movement

    let tile = RandomFromArray(
      unit.rexChess.board
        .getNeighborTileXY(units[index].rexChess.tileXYZ, [0, 1, 2, 3])
        .filter((tile) => unit.rexChess.board.isEmptyTileXYZ(tile.x, tile.y, 1))
    )

    if (tile) {
      unit.moveTo.moveTo(tile)
    }

    await delay(500)
  }
  
  // Re-enable input after all enemies have moved
  if (scene) {
    scene.input.enabled = true
    
    // Center camera on the middle of the board
    const board = units[0]?.rexChess?.board
    if (board) {
      const boardWidth = board.width
      const boardHeight = board.height
      const centerTile = { x: Math.floor(boardWidth / 2), y: Math.floor(boardHeight / 2) }
      const worldXY = board.grid.getWorldXY(centerTile.x, centerTile.y)
      await focusCameraOnUnit(scene.scene.get('Overworld'), { x: worldXY.x, y: worldXY.y })
    }
    
    // Show player turn text for overworld
    const uiScene = scene.scene.get('OverworldUI')
    if (uiScene) {
      const turnText = createTurnText(uiScene, 'Player Turn Start')
      
      // Fade in
      uiScene.tweens.add({
        targets: turnText,
        alpha: 1,
        duration: 250,
        ease: 'Linear'
      })
      
      await delay(500)
      
      // Fade out
      uiScene.tweens.add({
        targets: turnText,
        alpha: 0,
        duration: 250,
        ease: 'Linear',
        onComplete: () => turnText.destroy()
      })
      
      await delay(250) // Wait for fade out to complete
    }
  }
  
  EventBus.emit('endTurnOverworld')
}
