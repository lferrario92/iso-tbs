import { EventBus } from '../EventBus'
import { Scene } from 'phaser'
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin.js'
import GesturesPlugin from 'phaser3-rex-plugins/plugins/pinch-plugin'
import { QuadGrid } from 'phaser3-rex-plugins/plugins/board-components.js'
import { Board } from '../classes/Board.js'
import { buildDrag, camera } from '../gameFunctions/Camera.js'
import { enemyTurnStart } from '../gameFunctions/EnemyTurnStart.js'
import { playerTurnStart } from '../gameFunctions/PlayerTurnStart'
import { useGameStore } from '../stores/gameStore'
import RexUI from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import { generateGameUI, showModifiers } from '../gameFunctions/GenerateUI'
import { createAnimations, createMinifolksAnimations } from '../gameFunctions/Animations'
import { getAvailableTile } from '../helpers'
import ClickOutside from 'phaser3-rex-plugins/plugins/clickoutside'

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

    console.log('store', store)

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

    this.initModifiers(this, store)

    this.activeUI = showModifiers(
      this.scene.get('UI'),
      10,
      20,
      this.activeModifiers,
      'Active Modifiers'
    )
    this.pendingUI = showModifiers(
      this.scene.get('UI'),
      170,
      20,
      this.pendingModifiers,
      'Pending Modifiers'
    )

    console.log(store)
    console.log(this)
    // store.warData.invadingArmy

    camera(this)
    buildDrag(this, 'Game')
    createAnimations(this)
    createMinifolksAnimations(this)

    this.cameras.main.setZoom(3)
    this.midGroup = this.add.group()
    this.topGroup = this.add.group()

    this.army1 = []
    this.army2 = []

    this.army1 = store.warData.invadingArmy.units.map(
      // constructor(board, scene, x, y, key, health, damage, tileXY) {
      (unit) => new unit.constructor(board, this, 0, 0, placingCoords.invading, unit.health)
    )
    this.army2 = store.warData.targetArmy.units.map(
      (unit) => new unit.constructor(board, this, 0, 0, placingCoords.target, unit.health)
    )

    this.createUnitUI(this, store)

    this.midGroup.setDepth(1)
    this.topGroup.setDepth(2)

    EventBus.on('looseGame', () => {
      currentTurn = 0

      EventBus.emit('clearUI', store.warData.invadingArmy.overWorldChess)
      this.handleunitDamage(store.warData.targetArmy, 2)

      this.scene.switch('Overworld').launch('OverworldUI')
      this.scene.stop('UI')
      this.scene.start('OverworldUI')

      EventBus.removeListener('endTurn')
      this.scene.stop('Game')
      store.warData.invadingArmy.overWorldChess.destroy()
    })

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

          EventBus.emit('clearUI', store.warData.invadingArmy.overWorldChess)
          this.handleunitDamage(store.warData.invadingArmy, 1)

          this.scene.switch('Overworld').launch('OverworldUI')
          this.scene.stop('UI')
          this.scene.start('OverworldUI')

          EventBus.removeListener('endTurn')
          this.scene.stop('Game')
          store.warData.targetArmy.overWorldChess.destroy()
        }
      }
    })
    this.goFullscreen()

    EventBus.emit('current-scene-ready', this)
    this.events.on('destroy', () => {
      EventBus.off('endTurn')
      EventBus.off('looseGame')
    })
  }

  initModifiers(scene, store) {
    store.warData.invadingArmy.modifiers.forEach((modifier) => {
      modifier.from = 'friend'
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

  handleunitDamage(army, whichArmy) {
    army.units.forEach((unit, index) => {
      if (this[`army${whichArmy}`][index].health <= 0) {
        army.units.splice(index, 1)
      } else {
        unit.health = this[`army${whichArmy}`][index].health
      }
    })
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

    this.activeUI = showModifiers(
      this.scene.get('UI'),
      10,
      20,
      this.activeModifiers,
      'Active Modifiers',
      this.activeUI
    )

    this.pendingUI = showModifiers(
      this.scene.get('UI'),
      170,
      20,
      this.pendingModifiers,
      'Pending Modifiers',
      this.pendingUI
    )
  }

  update(delta) {
    let all = [this.army1, this.army2].flat()

    all.forEach((actor) => {
      actor.setDepth(actor.y)
    })

    this.cameraController.update(delta)
  }

  changeScene() {
    this.scene.start('GameOver')
  }

  startCutscene() {
    this.scene.manager.scenes.find((x) => x.sys.config === 'BattleCutscene').restart()
    this.scene.setVisible(false, 'UI')
    this.scene.switch('BattleCutscene')
  }

  goFullscreen() {
    this.scale.startFullscreen()

    this.scale.setGameSize(window.innerWidth, window.innerHeight)
  }

  scaleFullscreen() {
    this.scale.setGameSize(window.innerWidth, window.innerHeight)
  }

  createUnitUI(scene, store) {
    scene.unitUI = new Phaser.GameObjects.Container(scene, 0, 0)

    scene.moveButton = scene.add.sprite(15, -4, 'over_move_button')
    scene.moveButton.setInteractive()
    scene.actionButton = scene.add.sprite(-15, -4, 'over_attack_button')
    scene.actionButton.setInteractive()
    scene.moveButton.setInteractive()
    scene.closeUIButton = scene.add.sprite(0, -19, 'over_wait_button')
    scene.closeUIButton.setInteractive()
    scene.buildUIButton = scene.add.sprite(0, 11, 'over_build_button')
    scene.buildUIButton.setInteractive()
    scene.unitUI.add([
      scene.moveButton,
      scene.actionButton,
      scene.closeUIButton,
      scene.buildUIButton
    ])

    scene.add.existing(scene.unitUI)
    scene.unitUI.setVisible(false)
    scene.unitUI.setDepth(999)
    var clickOutside = new ClickOutside(scene.unitUI)

    clickOutside.on(
      'clickoutside',
      (clickoutside, gameObject, pointer) => {
        store.removeUnitUI(this)
      },
      this
    )

    scene.moveButton.on(
      'pointerdown',
      function () {
        if (!scene.hasMoved && !scene.hasActed) {
          store.removeUnitUI(this)
          store.selectedUnit.showMoveableArea()
        }
      },
      this
    )
    scene.actionButton.on(
      'pointerdown',
      function () {
        if (!scene.hasActed) {
          store.removeUnitUI(this)
          store.selectedUnit.showPossibleActions()
        }
      },
      this
    )
    scene.closeUIButton.on(
      'pointerdown',
      function () {
        store.removeUnitUI(this)
        store.selectedUnit.hasActed = true
      },
      this
    )

    scene.buildUIButton.on(
      'pointerdown',
      function () {
        store.removeUnitUI(this)
        store.selectedUnit.build()
      },
      this
    )
  }
}
