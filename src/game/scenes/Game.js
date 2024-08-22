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

    // const selector = this.add.sprite(0, 0, 'selector')
    // selector.scale = 2
    // selector.setAlpha(0)

    // const store = useGameStore()
    // store.selector = selector

    camera(this)
    buildDrag(this)
    createAnimations(this)

    this.cameras.main.setZoom(3)
    this.midGroup = this.add.group()
    this.topGroup = this.add.group()

    // var chessA = new SoldierC(board, this, 0, 0)
    // var chessB = new SoldierC(board, this, 0, 0)
    // var chessC = new SoldierC(board, this, 0, 0)

    // var enemy = new EyeBallEnemy(board, this, 0, 0)
    // var enemy = new OrcEnemy(board, this, 0, 0)
    // var enemy2 = new OrcEnemy(board, this, 0, 0)
    let { army1, army2 } = []

    army1 = store.warData.invadingArmy.units.map(
      (unit) => new unit(board, this, 0, 0, placingCoords.invading)
    )
    army2 = store.warData.targetArmy.units.map(
      (unit) => new unit(board, this, 0, 0, placingCoords.target)
    )

    this.midGroup.setDepth(1)
    this.topGroup.setDepth(2)

    EventBus.on('endTurn', () => {
      currentTurn++
      if (currentTurn % 2 == 0) {
        playerTurnStart(army1)
      } else {
        if (army2.some((x) => x.active)) {
          let players = army1.filter((x) => x.active)
          enemyTurnStart(
            army2.filter((x) => x.active),
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
