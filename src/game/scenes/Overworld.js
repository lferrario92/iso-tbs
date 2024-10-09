import { Scene } from 'phaser'
import { QuadGrid } from 'phaser3-rex-plugins/plugins/board-components'
import { Board } from '../classes/Board.js'
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin'
import GesturesPlugin from 'phaser3-rex-plugins/plugins/pinch-plugin'
import { buildDrag, camera } from '../gameFunctions/Camera.js'
import { OverworldChess } from '../classes/OverworldChess.js'
import { createOverworldAnimations } from '../gameFunctions/Animations.js'
import { OverworldFriend } from '../classes/OverworldFriend.js'
import { OverworldFoe } from '../classes/OverworldFoe.js'
import { SoldierC } from '../classes/Soldier.js'
import { OrcEnemy } from '../classes/Enemies.js'
import { BuildingFriend } from '../classes/BuildingFriend.js'

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
    this.scale.startFullscreen()

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

    this.test = this.add.sprite(0, 0, 'overworldTiles', 43)
    this.board.addChess(this.test, 1, 1, 1)
    this.test.y = this.test.y - 3

    this.test.setDepth(this.test.y)

    this.test2 = this.add.sprite(0, 0, 'entitest', 20).setScale(0.6)
    this.board.addChess(this.test2, 1, 3, 1)

    this.anims.create({
      key: 'windmill',
      frames: this.anims.generateFrameNumbers('entitest', {
        frames: [20, 21, 22, 23]
      }),
      frameRate: 3,
      repeat: -1
    })

    this.test2.play('windmill')

    this.midGroup = this.add.group()
    this.topGroup = this.add.group()
    this.castle = new BuildingFriend(this.board, this, 0, 0, 'castle', () => {
      this.scene.switch('Merchant')
    })
    this.castle2 = new BuildingFriend(
      this.board,
      this,
      0,
      0,
      'overworldTiles',
      () => {
        this.scene.switch('PreBattle')
      },
      44
    )

    console.log(this)

    createOverworldAnimations(this)

    this.cameras.main.setZoom(5)

    this.topGroup.add(this.test)
    this.midGroup.setDepth(1)
    this.topGroup.setDepth(2)

    this.player4 = new OverworldFriend(this.board, this, 0, 0, 'settler', [SoldierC], 'settler')

    this.player = new OverworldFriend(this.board, this, 0, 0, 'overworldIdle1', [SoldierC])
    this.player2 = new OverworldFriend(this.board, this, 0, 0, 'overworldIdle2', [
      SoldierC,
      SoldierC,
      SoldierC
    ])
    this.player3 = new OverworldFoe(this.board, this, 0, 0, 'overworldOrcIdle', [
      OrcEnemy,
      OrcEnemy,
      OrcEnemy
    ])

    this.actors = [
      this.player,
      this.player2,
      this.player3,
      this.player4,
      this.castle,
      this.castle2,
      this.test
    ]

    const test = this.add.sprite(center.x, center.y - 25, 'endTurnImage').setInteractive()

    test.on('pointerdown', () => {
      this.scene.launch('Snowing')
      this.time.addEvent({
        callback: () => {
          this.board.nextSeason()
        },
        delay: 1500,
        repeat: 0
      })
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
}
