import { defineStore } from 'pinia'
import { EventBus } from '../EventBus'

export const useEnemyStore = defineStore('enemyStore', {
  state: () => ({
    currentEnemy: 0,
    enemies: [],
    players: []
  }),
  actions: {
    enemyTurn (enemies, players) {
      this.enemies = enemies
      this.players = players
      this.playEnemy(this)
    },
    playEnemy: async (state) => {
      let enemy = state.enemies[state.currentEnemy]

      if (!enemy) {
        state.endTurn()

        return
      }

      EventBus.emit('clearUI', enemy)

      let filteredPlayers = state.players.filter(x => x.active)

      if (!enemy.hasMoved) {
        console.log(state.currentEnemy, 'move')
        await enemy.moveTowardsPlayer(filteredPlayers)
        state.playEnemy(state)
        return
      }

      if (enemy.hasMoved && !enemy.hasActed) {
        // action
        debugger
        console.log(state.currentEnemy, 'act')
        enemy.checkPossibleAction()
      }

      if (enemy.hasMoved && enemy.hasActed) {
        console.log(state.currentEnemy, 'done')
        // done

        state.currentEnemy++
        enemy.resetMoveFlag()
        enemy.resetActedFlag()

        if (state.currentEnemy === state.enemies.length) {
          state.endTurn()
        } else {
          state.playEnemy(state)
        }
      }
    },
    endTurn() {
      this.currentEnemy = 0
      EventBus.emit('endTurn')
      console.log('end turn')
    }
  }
})
