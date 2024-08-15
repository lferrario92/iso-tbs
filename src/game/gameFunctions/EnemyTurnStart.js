import { EventBus } from '../EventBus'
import { delay } from '../helpers'
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
    let filteredPlayers = players.filter(x => x.active)
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
  let filteredPlayers = players.filter(x => x.active)
  await enemy.moveTowardsPlayer(filteredPlayers)
}

