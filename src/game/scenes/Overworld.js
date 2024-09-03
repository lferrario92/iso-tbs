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

    // this.test2 = this.add.sprite(0, 0, 'castle')
    // this.board.addChess(this.test2, 1, 4, 1)
    // this.test2.y = this.test2.y - 3
    // this.test2.setScale(0.8)

    // this.test2.setDepth(this.test2.y)

    this.midGroup = this.add.group()
    this.topGroup = this.add.group()
    this.castle = new BuildingFriend(this.board, this, 0, 0, 'castle', () => {
      //   this.scene.switch('Merchant')
    })
    this.castle2 = new BuildingFriend(
      this.board,
      this,
      0,
      0,
      'overworldTiles',
      () => {
        this.scene.switch('Merchant')
      },
      44
    )

    console.log(this)

    createOverworldAnimations(this)

    this.cameras.main.setZoom(5)

    this.topGroup.add(this.test)
    this.midGroup.setDepth(1)
    this.topGroup.setDepth(2)

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

    this.actors = [this.player, this.player2, this.player3, this.castle, this.castle2, this.test]

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
