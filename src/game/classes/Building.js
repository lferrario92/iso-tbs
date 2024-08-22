import { EventBus } from '../EventBus'
import { killChessAt } from '../helpers.js'
import { MoveableMarker } from './Markers.js'

export class Building extends Phaser.GameObjects.Container {
  constructor(board, scene, x, y, sprite, tileXY) {
    super(scene, x, y, [])

    this.selector = scene.add.image(0, 0, 'overworldIndicators', 5)
    this.sprite = scene.add.sprite(0, -4, sprite, 0)
    this.texture = this.sprite.texture

    this.add(this.sprite)
    this.add(this.selector)
    this.selector.setAlpha(0)
    this.selector.scale = 1.8
    this.bringToTop(this.sprite)

    this.scene.topGroup.add(this)

    // var textConfig = { fontSize: '20px', color: 'white', fontFamily: 'Arial' }
    // this.text = scene.add.text(0, 0, this.health, textConfig)

    // this.add(this.text)
    this.scale = 0.6
    if (tileXY === undefined) {
      // implement cardinal points
      tileXY = board.getRandomEmptyTileXY(1)
    }

    board.addChess(this, tileXY.x, tileXY.y, 1)

    scene.add.existing(this)
    this.hasMoved = false
    this.hasActed = false

    // private members
    this._actionMarkers = []
  }

  hidePossibleActions() {
    if (!this._actionMarkers && !this._actionMarkers.length) {
      return
    }
    for (var i = 0, cnt = this._actionMarkers.length; i < cnt; i++) {
      this._actionMarkers[i].destroy()
    }
    this._actionMarkers.length = 0
    return this
  }

  resetActedFlag() {
    this.hasActed = false
    return this
  }

  killMe() {
    killChessAt(this.rexChess)
  }
}
