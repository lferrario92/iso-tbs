import { defineStore } from 'pinia'
import { Tile } from '../classes/Board'
import { EnemyChess } from '../classes/EnemyChess'
import { MoveableMarker, ActionMarker, OverworldActionMarker } from '../classes/Markers'
import { SoldierC } from '../classes/Soldier'
import { OrcEnemy } from '../classes/Enemies'

export const useGameStore = defineStore('game', {
  state: () => ({
    selectedUnit: null,
    selectedBuilding: null,
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
        modifiers: null,
        overWorldChess: null
      },
      targetArmy: {
        units: [OrcEnemy],
        modifiers: null,
        overWorldChess: null
      }
    },
    money: 200,
    cards: [{ key: 'cards', frame: 1, price: 50 }]
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
    sellCard (index) {
      this.addMoney(this.cards[index].price)
      this.removeCard(index)
    },
    addCard (card) {
      this.cards.push(card)
    },
    removeCard (index) {
      this.cards.splice(index, 1)
    },
    addMoney(amount) {
      this.money = this.money + amount
    },
    removeMoney(amount) {
      this.money = this.money - amount
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
        if (this.isActionMarker(x) || this.isOverworldActionMarker(x)) {
          x.destroy()
        }
      })
    },
    setWarData(data) {
      this.warData = {
        ...this.warData,
        ...data
      }
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
    isOverworldActionMarker(chess) {
      return !!(chess instanceof OverworldActionMarker)
    },
    isMovableMarker(chess) {
      return !!(chess instanceof MoveableMarker)
    }
  }
})
