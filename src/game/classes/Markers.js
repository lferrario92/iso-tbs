import { EventBus } from '../EventBus'
import { cameFrom, getUnitAt } from '../helpers'
import { Game } from '../scenes/Game'
import { useGameStore } from '../stores/gameStore'
import { OrcEnemy } from './Enemies'
import { SoldierC } from './Soldier'

export class MoveableMarker extends Phaser.GameObjects.Sprite {
  constructor(chess, tileXY, group, key, frame, scale) {
    var board = chess.rexChess.board
    var scene = board.scene

    if (!key) {
      key = 'selector'
      frame = 0
    }
    super(scene, tileXY.x, tileXY.y, key, frame)

    group.add(this)

    board.addChess(this, tileXY.x, tileXY.y, -1)

    var scene = board.scene

    scene.add.existing(this)
    this.setScale(scale || 1)
    this.setAlpha(0.7)
    this.postFX.addShine(1, 1, 1)

    // on pointer down, move to this tile
    this.on(
      'board.pointerdown',
      function () {
        if (!chess.moveToTile(this)) {
          return
        }
        // this.setFillStyle(0xff5c8d, 1)
      },
      this
    )
  }
}

export class ActionMarker extends Phaser.GameObjects.Sprite {
  constructor(chess, tileXY, group, key, frame, scale) {
    var board = chess.rexChess.board
    var scene = board.scene

    if (!group) {
      group = chess.scene.midGroup
    }

    if (!key) {
      key = 'attack_place'
      frame = 0
    }
    super(scene, tileXY.x, tileXY.y, key, frame)

    group.add(this)

    board.addChess(this, tileXY.x, tileXY.y, -1)

    var scene = board.scene

    scene.add.existing(this)
    this.setScale(scale || 1)
    this.setAlpha(0.7)

    // on pointer down, move to this tile
    this.on(
      'board.pointerdown',
      function () {
        const store = useGameStore()
        if (!getUnitAt(this.rexChess) || !store.isEnemyChess(getUnitAt(this.rexChess))) {
          return
        }
        chess.hasActed = true
        if (this.x < chess.x) {
          chess.sprite.setFlipX(true)
        } else {
          chess.sprite.setFlipX(false)
        }

        store.currentFriend = chess
        store.currentFoe = getUnitAt(this.rexChess)

        store.fightCutscene = new Promise(function (resolve) {
          store.cutSceneResolve = resolve
        })

        EventBus.emit('clearUI', chess)
        chess.scene.startCutscene()
      },
      this
    )
  }
}

export class OverworldActionMarker extends Phaser.GameObjects.Sprite {
  constructor(chess, tileXY, group, key, frame, scale) {
    var board = chess.rexChess.board
    var scene = board.scene

    if (!group) {
      group = chess.scene.midGroup
    }

    if (!key) {
      key = 'attack_place'
      frame = 0
    }
    super(scene, tileXY.x, tileXY.y, key, frame)

    group.add(this)

    board.addChess(this, tileXY.x, tileXY.y, -1)

    var scene = board.scene

    scene.add.existing(this)
    this.setScale(scale || 2.5)
    this.setAlpha(0.7)

    // on pointer down, move to this tile
    this.on(
      'board.pointerdown',
      function () {
        const store = useGameStore()

        let tile = this.rexChess.board.tileXYZToChess(
          this.rexChess.tileXYZ.x,
          this.rexChess.tileXYZ.y,
          0
        )
        let target = this.rexChess.board.tileXYZToChess(
          this.rexChess.tileXYZ.x,
          this.rexChess.tileXYZ.y,
          1
        )
        let invader = store.selectedUnit

        const level = this.rexChess.board
          .tileXYZToChess(this.rexChess.tileXYZ.x, this.rexChess.tileXYZ.y, 0)
          .data.get('level')

        let actionData = {
          level,
          attackingFrom: this.rexChess.board.directionBetween(invader, target),
          invadingArmy: {
            units: invader.units || [SoldierC],
            modifiers: null,
            overWorldChess: invader
          },
          targetArmy: {
            units: target.units || [OrcEnemy],
            modifiers: null,
            overWorldChess: target
          }
        }

        console.log(actionData.attackingFrom)

        store.setWarData(actionData)

        // chess.scene.scene.launch('Game')

        let gamescene = chess.scene.scene.switch('Game').launch('UI')

        gamescene.scene.events.once(
          'destroy',
          function () {
            this.scene.add('Game', Game, true)
          },
          this
        )
      },
      this
    )
  }
}

// 2 3
// 1 0
