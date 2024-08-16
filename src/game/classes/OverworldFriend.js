import { EventBus } from "../EventBus";
import { OverworldActionMarker } from "./Markers";
import { OverworldChess } from "./OverworldChess";

export class OverworldFriend extends OverworldChess {
  constructor(board, scene, x, y, animation, tileXY) {
    super(board, scene, x, y, animation, tileXY)

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
    EventBus.emit('selectUnit', this)
    EventBus.emit('clearUI', this)
    // this.setFillStyle(0x2541b2, 1)
    if (!this.hasMoved && !this.hasActed) {
      this.showMoveableArea()
    }
    if (!this.hasActed) {
      this.showPossibleActions()
    }
    return this
  }
}