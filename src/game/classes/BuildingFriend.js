import { EventBus } from '../EventBus'
import { Building } from './Building'
import { OverworldActionMarker } from './Markers'

export class BuildingFriend extends Building {
  constructor(board, scene, x, y, sprite, callback, tileXY) {
    super(board, scene, x, y, sprite, tileXY)

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
