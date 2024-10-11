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
    createdAnimations: {
      game: false,
      overworld: false,
      market: false
    },
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
    cards: [
      {
        key: 'cards',
        frame: 3,
        price: 500,
        turns: -2,
        back: 0,
        icon: 0,
        modifier: 'atkUp',
        amount: 20,
        active: 4,
        text: 'ATK +20'
      }
    ]
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
      unit.UI && unit.UI.setVisible(false)
    },
    sellCard(index) {
      this.addMoney(this.cards[index].price)
      this.removeCard(index)
    },
    addCard(card) {
      this.cards.push(card.getData('raw'))
    },
    removeCard(index) {
      this.cards.splice(index, 1)
    },
    addMoney(amount) {
      this.money = this.money + amount
    },
    removeMoney(amount) {
      this.money = this.money - amount
    },
    handleModifiers(army) {
      // {
      //   "key": "cards",
      //   "frame": 1,
      //   "price": 50,
      //   "turns": -3,
      //   "back": 0,
      //   "icon": 0,
      //   "modifier": "crit",
      //   "amount": 10,
      //   "text": "texto"
      // }
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
    removeUnitUI(chess) {
      chess.UI?.setVisible(false)
    },
    showUnitUI(chess) {
      chess.UI?.setVisible(true)
    },
    setWarData(data) {
      this.warData = {
        ...this.warData,
        ...data
      }
    },
    setInvadingModifiers(modifiers) {
      this.warData.invadingArmy.modifiers = modifiers
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
