import { EventBus } from '../EventBus'
import { Scene } from 'phaser'
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin.js'
import GesturesPlugin from 'phaser3-rex-plugins/plugins/pinch-plugin'
import { QuadGrid } from 'phaser3-rex-plugins/plugins/board-components.js'
import { Board } from '../classes/Board.js'
import { buildDrag, camera } from '../gameFunctions/Camera.js'
import { enemyTurnStart } from '../gameFunctions/EnemyTurnStart.js'
import { playerTurnStart } from '../gameFunctions/PlayerTurnStart'
import { EyeBallEnemy, OrcEnemy } from '../classes/Enemies'
import { Soldier, SoldierC } from '../classes/Soldier'
import { useGameStore } from '../stores/gameStore'
import { useEnemyStore } from '../stores/enemyStore'
import RexUI from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import { generateGameUI } from '../gameFunctions/GenerateUI'
import { createAnimations } from '../gameFunctions/Animations'
import { getAvailableTile } from '../helpers'

export class Game extends Scene {
  constructor() {
    super('Game')
  }

  preload() {
    this.load.scenePlugin({
      key: 'rexboardplugin',
      url: BoardPlugin,
      sceneKey: 'rexBoard'
    })

    this.load.plugin({
      key: 'rexpinchplugin',
      url: GesturesPlugin
    })

    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: RexUI,
      sceneKey: 'rexUI'
    })
  }

  create() {
    const store = useGameStore()
    let currentTurn = 0

    console.log(store)

    // const enemyStore = useEnemyStore()

    const center = {
      x: this.scale.width / 2,
      y: this.scale.height / 2
    }

    var board = new Board(
      this.scene.scene,
      {
        grid: new QuadGrid({
          x: center.x,
          y: center.y,
          cellWidth: 32,
          cellHeight: 16,
          type: 1
        }),
        width: 10,
        height: 10
      },
      false,
      store.warData.bioma
    )

    let placingCoords

    // 2 3
    // 1 0

    switch (store.warData.attackingFrom) {
      case 0:
        placingCoords = {
          target: { x: board.width, y: Math.floor(board.height / 2) },
          invading: { x: 0, y: Math.floor(board.height / 2) }
        }
        break
      case 1:
        placingCoords = {
          target: { x: Math.floor(board.width / 2), y: board.height },
          invading: { x: Math.floor(board.width / 2), y: 0 }
        }
        break
      case 2:
        placingCoords = {
          target: { x: 0, y: Math.floor(board.height / 2) },
          invading: { x: board.width, y: Math.floor(board.height / 2) }
        }
        break
      case 3:
        placingCoords = {
          target: { x: Math.floor(board.width / 2), y: 0 },
          invading: { x: Math.floor(board.width / 2), y: board.height }
        }
        break

      default:
        placingCoords = {
          target: { x: 0, y: 0 },
          invading: { x: board.width, y: board.height }
        }
        break
    }

    // handle instant modifiers

    this.activeModifiers = []
    this.pendingModifiers = []

    this.activeModifiersText = this.add.text(25, 25, `active modifiers`, {
      fontFamily: 'PublicPixel',
      fontSize: '12px',
      align: 'left'
    })

    // {
    //   key: 'cards',
    //   frame: 0,
    //   price: 500,
    //   turns: -3,
    //   back: 0,
    //   icon: 2,
    //   modifier: 'crit',
    //   amount: 10,
    //   text: 'texto'
    // }

    this.initModifiers(this, store)

    console.log(store)
    console.log(this)
    // store.warData.invadingArmy

    camera(this)
    buildDrag(this)
    createAnimations(this)

    this.cameras.main.setZoom(3)
    this.midGroup = this.add.group()
    this.topGroup = this.add.group()

    this.army1 = []
    this.army2 = []

    this.army1 = store.warData.invadingArmy.units.map(
      (unit) => new unit(board, this, 0, 0, placingCoords.invading)
    )
    this.army2 = store.warData.targetArmy.units.map(
      (unit) => new unit(board, this, 0, 0, placingCoords.target)
    )

    this.midGroup.setDepth(1)
    this.topGroup.setDepth(2)

    EventBus.on('endTurn', () => {
      currentTurn++
      // handle pending modifiers
      if (currentTurn % 2 == 0) {
        this.updateModifiers(this, store)
        console.log('active: ', this.activeModifiers)
        playerTurnStart(this.army1)
      } else {
        if (this.army2.some((x) => x.active)) {
          let players = this.army1.filter((x) => x.active)
          enemyTurnStart(
            this.army2.filter((x) => x.active),
            players
          )
          // enemyStore.enemyTurn([enemy, enemy2].filter((x) => x.active), players)
        } else {
          currentTurn = 0

          store.warData.targetArmy.overWorldChess.destroy()
          EventBus.emit('clearUI', store.warData.invadingArmy.overWorldChess)

          this.scene.switch('Overworld')
          console.log('game stop')
          EventBus.removeListener('endTurn')
          this.scene.stop('Game')
        }
      }
    })
    this.goFullscreen()

    // generateGameUI(this)

    EventBus.emit('current-scene-ready', this)
  }

  initModifiers(scene, store) {
    store.warData.invadingArmy.modifiers.forEach((modifier) => {
      if (modifier.turns > 0) {
        this.activeModifiers.push(modifier)
      } else {
        this.pendingModifiers.push(modifier)
      }
    })
    // store.warData.targetArmy.modifiers.forEach((modifier) => {
    //   this.handleModifier(scene, store, modifier)
    // })
  }

  updateModifiers(scene, store) {
    this.activeModifiers.forEach((modifier, index) => {
      modifier.turns = modifier.turns - 1

      if (modifier.turns <= 0) {
        this.activeModifiers.splice(index, 1)
      }
    })

    this.pendingModifiers.forEach((modifier, index) => {
      modifier.turns = modifier.turns + 1

      if (modifier.turns >= 0) {
        modifier.turns = modifier.active
        this.activeModifiers.push(modifier)
        this.pendingModifiers.splice(index, 1)
      }
    })
  }

  update(time, delta) {
    this.cameraController.update(delta)

    var pointer = this.input.activePointer
  }

  changeScene() {
    this.scene.start('GameOver')
  }

  startCutscene() {
    this.scene.manager.scenes.find((x) => x.sys.config === 'BattleCutscene').restart()
    this.scene.switch('BattleCutscene')
  }

  goFullscreen() {
    this.scale.startFullscreen()

    this.scale.setGameSize(window.innerWidth, window.innerHeight)
  }

  scaleFullscreen() {
    this.scale.setGameSize(window.innerWidth, window.innerHeight)
  }
}
