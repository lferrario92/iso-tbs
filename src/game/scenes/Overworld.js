import { Scene } from 'phaser'
import { QuadGrid } from 'phaser3-rex-plugins/plugins/board-components'
import { Board } from '../classes/Board.js'
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin'
import GesturesPlugin from 'phaser3-rex-plugins/plugins/pinch-plugin'
import { buildDrag, camera } from '../gameFunctions/Camera.js'
import { OverworldChess } from '../classes/OverworldUnits/OverworldChess.js'
import { createOverworldAnimations } from '../gameFunctions/Animations.js'
import { OverworldFriend } from '../classes/OverworldUnits/OverworldFriend.js'
import { OverworldFoe } from '../classes/OverworldUnits/OverworldFoe.js'
import { SoldierC } from '../classes/Soldier.js'
import { OrcEnemy } from '../classes/Enemies.js'
import { BuildingFriend } from '../classes/OverworldUnits/BuildingFriend.js'
import { EventBus } from '../EventBus.js'
import { playerOverworldTurnStart } from '../gameFunctions/PlayerTurnStart.js'
import { enemyOverworldTurnStart } from '../gameFunctions/EnemyTurnStart.js'
import { useGameStore } from '../stores/gameStore.js'
import { Settler } from '../classes/OverworldUnits/Settler.js'
import { Army } from '../classes/OverworldUnits/Army.js'
import { Farmer } from '../classes/OverworldUnits/Farmer.js'
import { Castle } from '../classes/OverworldUnits/Castle.js'

export class Overworld extends Scene {
  constructor() {
    super('Overworld')
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
  }

  create() {
    // const enemyStore = useEnemyStore()
    const store = useGameStore()
    this.scene.launch('OverworldUI')
    this.scale.startFullscreen()
    this.currentTurn = 0

    const center = {
      x: this.scale.width / 2,
      y: this.scale.height / 2
    }

    this.board = new Board(
      this.scene.scene,
      {
        grid: new QuadGrid({
          x: center.x,
          y: center.y,
          cellWidth: 16,
          cellHeight: 8,
          type: 1
        }),
        width: 5,
        height: 5
      },
      true
    )

    camera(this)
    buildDrag(this)
    this.cameras.main.setZoom(0)
    this.cameras.main.zoomTo(5, 1500, 'Cubic')

    // this.test = this.add.sprite(0, 0, 'overworldTiles', 43)
    // this.board.addChess(this.test, 1, 1, 1)
    // this.test.y = this.test.y - 3

    // this.test.setDepth(this.test.y)

    // this.test2 = this.add.sprite(0, 0, 'entitest', 20).setScale(0.6)
    // this.board.addChess(this.test2, 1, 3, 1)

    this.anims.create({
      key: 'windmill',
      frames: this.anims.generateFrameNumbers('entitest', {
        frames: [20, 21, 22, 23]
      }),
      frameRate: 3,
      repeat: -1
    })

    // this.test2.play('windmill')

    this.midGroup = this.add.group()
    this.topGroup = this.add.group()
    this.store = new BuildingFriend(
      this.board,
      this,
      0,
      0,
      'entitest',
      () => {
        this.changeScene('Merchant')
      },
      11
    )

    createOverworldAnimations(this)

    this.midGroup.setDepth(1)
    this.topGroup.setDepth(2)

    this.playerArmy = []
    this.enemyArmies = []

    this.startingSettler = new Settler(
      this.board,
      this,
      0,
      0,
      'settler',
      [{ constructor: SoldierC, type: 'Soldier' }],
      'Settler',
      'settler'
    )

    // this.player = new OverworldFriend(
    //   this.board,
    //   this,
    //   0,
    //   0,
    //   'overworldIdle1',
    //   [
    //     { constructor: SoldierC, type: 'Soldier' },
    //     { constructor: SoldierC, type: 'Soldier' },
    //     { constructor: SoldierC, type: 'Soldier' },
    //     { constructor: SoldierC, type: 'Soldier' },
    //     { constructor: SoldierC, type: 'Soldier' }
    //   ],
    //   'Army'
    // )

    this.enemy = new OverworldFoe(
      this.board,
      this,
      0,
      0,
      'overworldOrcIdle',
      [
        { constructor: OrcEnemy, type: 'Orc' },
        { constructor: OrcEnemy, type: 'Orc' },
        { constructor: OrcEnemy, type: 'Orc' }
      ],
      'Orc'
    )

    this.enemy2 = new OverworldFoe(
      this.board,
      this,
      0,
      0,
      'overworldOrcIdle',
      [
        { constructor: OrcEnemy, type: 'Orc' },
        { constructor: OrcEnemy, type: 'Orc' }
      ],
      'Orc'
    )

    this.createUnitUI(this, store)

    this.actors = [this.enemy, this.enemy2, this.startingSettler, this.store]
    this.buildings = []

    EventBus.on('endTurnOverworld', () => {
      store.removeUnitUI(this)
      this.currentTurn++
      this.playerArmy.splice(0)
      this.enemyArmies.splice(0)

      this.actors
        .filter((x) => x.active)
        .forEach((actor) => {
          if (actor instanceof OverworldFriend) {
            this.playerArmy.push(actor)
          } else if (actor instanceof OverworldFoe) {
            this.enemyArmies.push(actor)
          }
        })

      if (this.currentTurn % 10 == 0) {
        this.snowing()
      }

      if (this.currentTurn % 2 == 0) {
        playerOverworldTurnStart(this.playerArmy)
        this.buildings.forEach((building) => {
          if (building instanceof Castle) {
            store.addFood(building.calculateFood())
          }
        })
        this.playerArmy.forEach((army) => {
          store.removeFood(army.foodConsumption)
        })
        EventBus.emit('updateResourcesUI')
      } else {
        enemyOverworldTurnStart(this.enemyArmies)
      }
    })

    EventBus.on('createSoldier', () => {
      this.actors.push(
        new OverworldFriend(
          this.board,
          this,
          0,
          0,
          'overworldIdle1',
          [{ constructor: SoldierC, health: 100, type: 'Soldier' }],
          'Army'
        )
      )
    })

    EventBus.on('createSettlerAt', ({ key, position }) => {
      this.actors.push(
        new Settler(
          this.board,
          this,
          0,
          0,
          'settler',
          [{ constructor: SoldierC, health: 100, type: 'Soldier' }],
          'Settler',
          key,
          position
        )
      )
    })

    EventBus.on('createArmyAt', ({ key, position }) => {
      let newArmy = new Army(
        this.board,
        this,
        0,
        0,
        'overworldIdle1',
        [
          { constructor: SoldierC, health: 100, type: 'Soldier' },
          { constructor: SoldierC, health: 100, type: 'Soldier' },
          { constructor: SoldierC, health: 100, type: 'Soldier' }
        ],
        'Army',
        key,
        position
      )

      newArmy.hasActed = true

      this.actors.push(newArmy)
    })

    EventBus.on('createFarmerAt', ({ key, position }) => {
      this.actors.push(
        new Farmer(
          this.board,
          this,
          0,
          0,
          'overworldIdle2',
          [{ constructor: SoldierC, health: 100, type: 'Soldier' }],
          'Farmer',
          key,
          position
        )
      )
    })
    // this.cameras.main.zoom = 3
    // this.cameras.main.scrollY = 0
    // this.cameras.main.scrollX = 140
  }

  update() {
    this.actors.forEach((actor) => {
      actor.setDepth(actor.y)
    })
  }

  changeScene(name) {
    this.scene.stop('OverworldUI')
    this.scene.switch(name)
  }

  snowing() {
    this.scene.launch('Snowing')
    this.time.addEvent({
      callback: () => {
        this.board.nextSeason()
      },
      delay: 1500,
      repeat: 0
    })
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
