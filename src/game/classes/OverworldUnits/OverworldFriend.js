import { EventBus } from '../../EventBus'
import { BuildingFriend } from './BuildingFriend'
import { OverworldActionMarker } from '../Markers'
import { OverworldChess } from './OverworldChess'

export class OverworldFriend extends OverworldChess {
  constructor(board, scene, x, y, animation, units, name, key, tileXY) {
    super(board, scene, x, y, animation, key, tileXY)

    this.units = units
    this.name = name

    this.on(
      'board.pointerdown',
      function () {
        this.select()
      },
      this
    )
  }

  afterMove() {
    this.hasMoved = true
    // this.moveButton.setVisible(false)
    // this.UI.setVisible(true)
    this.scene.input.enable(this.scene)
    this.select()
  }

  build() {
    alert('nao nao amigao')
  }

  resetMoveFlag() {
    // this.moveButton.setVisible(true)
    this.hasMoved = false
    return this
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
    this.selector.setAlpha(1)
    EventBus.emit('selectUnit', this)
    EventBus.emit('clearUI', this)
    if (this.hasActed) {
      return
    }

    this.scene.unitUI.setPosition(this.x, this.y)
    this.scene.unitUI.setAlpha(0)
    this.scene.unitUI.setScale(0.1)

    this.scene.unitUI.setVisible(true)
    this.scene.add.tween({
      targets: this.scene.unitUI,
      duration: 100,
      scale: 0.5,
      alpha: 1,
      repeat: 0
    })

    if (this.hasMoved) {
      this.scene.moveButton.setVisible(false)
    } else {
      this.scene.moveButton.setVisible(true)
    }
    // if (!this.hasMoved && !this.hasActed) {
    //   this.showMoveableArea()
    // }
    // if (!this.hasActed) {
    //   this.showPossibleActions()
    // }
    return this
  }
}
