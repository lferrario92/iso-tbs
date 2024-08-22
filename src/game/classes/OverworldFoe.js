import { EventBus } from '../EventBus'
import { OverworldActionMarker } from './Markers'
import { OverworldChess } from './OverworldChess'

export class OverworldFoe extends OverworldChess {
  constructor(board, scene, x, y, animation, units, tileXY) {
    super(board, scene, x, y, animation, tileXY)
    this.isEnemy = true
    this.units = units

    this.on(
      'board.pointerdown',
      function () {
        this.select()
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
      if (x instanceof OverworldFoe) {
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
    return this
  }
}
