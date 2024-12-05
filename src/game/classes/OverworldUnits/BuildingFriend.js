import { EventBus } from '../../EventBus'
import { Building } from './Building'
import { MoveableMarker, OverworldActionMarker } from '../Markers'

export class BuildingFriend extends Building {
  constructor(board, scene, x, y, sprite, callback, frame, tileXY, name) {
    super(board, scene, x, y, sprite, frame, tileXY)

    this._borders = []
    this.name = name

    this.on(
      'board.pointerdown',
      function () {
        callback()
      },
      this
    )
  }

  showPossibleActions() {
    this.hidePossibleActions()
    if (this.hasActed) {
      return
    }

    // var tileXYArray = this.rexChess.board.getNeighborTileXY(this.rexChess.tileXYZ, null)
    var tileXYArray = this.rexChess.board.getNeighborChess(this.rexChess.tileXYZ).forEach((x) => {
      if (x instanceof OverworldFriend) {
        return
      }
      this._actionMarkers.push(
        new OverworldActionMarker(
          this,
          x.rexChess.tileXYZ,
          this.scene.midGroup,
          'overworldIndicators',
          2,
          1
        )
      )
    })
    return tileXYArray
  }

  getBorderTiles() {
    return this.rexChess.board.getEmptyTileXYArrayInRange(this.rexChess.tileXYZ, 1, 1)
  }

  testCallback() {
    // let tiles = this.rexChess.board.ringToChessArray(this.rexChess.tileXYZ, 2, 0)
    let tiles = this.rexChess.board.filledRingToChessArray(this.rexChess.tileXYZ, 1, 0)
    this.showBorders(tiles)

    EventBus.emit('selectUnit', this)
  }

  showBorders(tiles) {
    this.hideBorders()
    tiles.forEach((tile, index) => {
      if (index === 0) return
      this._borders
        .push
        // new MoveableMarker(this, tile, this.scene.midGroup, 'overworldIndicators', 1, 1)
        ()
      this.scene.add.tween({
        targets: tile,
        // delay: 0,
        delay: (index + 1) * 50,
        duration: 300,
        repeat: 0,
        ease: 'back.in',
        y: tile.y - 2,
        yoyo: true
      })
    })
    return this
  }

  hideBorders() {
    for (var i = 0, cnt = this._borders.length; i < cnt; i++) {
      this._borders[i].destroy()
    }
    this._borders.length = 0
    return this
  }

  select() {
    if (this.hasActed) {
      return
    }
    this.selector.setAlpha(1)
    EventBus.emit('selectBuilding', this)
    EventBus.emit('clearUI', this)
    if (!this.hasActed) {
      this.showPossibleActions()
    }
    return this
  }
}
