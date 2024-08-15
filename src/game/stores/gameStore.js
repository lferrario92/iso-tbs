import { defineStore } from 'pinia'
import { Tile } from '../classes/Board'
import { EnemyChess } from '../classes/EnemyChess'
import { MoveableMarker, ActionMarker } from '../classes/Markers'
import { SoldierC } from '../classes/Soldier'
import { OrcEnemy } from '../classes/Enemies'

export const useGameStore = defineStore('game', {
  state: () => ({
    selectedUnit: null,
    selector: null,
    fightCutscene: null,
    currentFriend: {
      attackType: null,
      texture: {
        key: 'Soldier'
      }
    },
    currentFoe: {
      texture: {
        key: 'Orc'
      }
    },
    warData: {
      invadingArmy: {
        units: [SoldierC, SoldierC],
        modifiers: null
      },
      targetArmy: {
        units: [OrcEnemy],
        modifiers: null
      }
    },
  }),
  actions: {
    selectUnit(unit) {
      this.unselectUnit(this.selectedUnit, unit)
      this.selectedUnit = unit
      //   this.selector.setAlpha(1)
      //   this.selector.x = unit.x
      //   this.selector.y = unit.y
    },
    unselectUnit(unit, newUnit) {
      if (!unit || this.areTheSame(this.selectedUnit, newUnit)) return
      unit.selector.setAlpha(0)
    },
    removeAllMobableMarker(chess) {
      if (!chess.rexChess.board) {
        debugger
        chess = this.getHelp()
      }
      chess.rexChess.board.getAllChess().forEach((x) => {
        if (this.isMovableMarker(x)) {
          x.destroy()
        }
      })
    },
    removeAllActionMarker(chess) {
      if (!chess.rexChess.board) {
        debugger
        chess = this.getHelp()
      }
      chess.rexChess.board.getAllChess().forEach((x) => {
        if (this.isActionMarker(x)) {
          x.destroy()
        }
      })
    },
    setWarData (data) {
      this.warData.level = data.level
      this.warData.attackingFrom = data.attackingFrom
    },
    getHelp() {
      return this.currentFriend || this.currentFoe || this.selectedUnit
    },
    areTheSame(first, second) {
      return first.rexChess.$uid === second.rexChess.$uid
    },
    isTile(chess) {
      return !!(chess instanceof Tile)
    },
    isEnemyChess(chess) {
      return chess.isEnemy
      // return !!(chess instanceof EnemyChess)
    },
    isActionMarker(chess) {
      return !!(chess instanceof ActionMarker)
    },
    isMovableMarker(chess) {
      return !!(chess instanceof MoveableMarker)
    }
  }
})
