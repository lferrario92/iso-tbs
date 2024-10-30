import { EventBus } from '../EventBus'
import { delay, RandomFromArray } from '../helpers'
import { useEnemyStore } from '../stores/enemyStore'
import { useGameStore } from '../stores/gameStore'

export const enemyTurnStart = async (enemies, players) => {
  const store = useGameStore()
  const enemyStore = useEnemyStore()
  console.log('enemy turn')
  enemyStore.currentEnemy = 0

  if (enemyStore.currentEnemy === enemies.length) {
    EventBus.emit('endTurn')

    return
  }

  // playEnemy(enemies[enemyStore.currentEnemy])

  for (let index = 0; index < enemies.length; index++) {
    const enemy = enemies[index]
    if (!enemy) {
      return
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

export const enemyOverworldTurnStart = (units) => {
  units.forEach((unit) => {
    if (!unit.active) {
      return
    }

    let tile = RandomFromArray(
      unit.rexChess.board
        .getNeighborTileXY(units[0].rexChess.tileXYZ, [0, 1, 2, 3])
        .filter((tile) => unit.rexChess.board.isEmptyTileXYZ(tile.x, tile.y, 1))
    )

    if (tile) {
      unit.moveTo.moveTo(tile)
    }
  })
  EventBus.emit('endTurnOverworld')
}
