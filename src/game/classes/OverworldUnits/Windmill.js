import { EventBus } from '../../EventBus'
import { BuildingFriend } from './BuildingFriend'
import { OverworldActionMarker } from '../Markers'
import units from '../../data/units.json'
import { useGameStore } from '../../stores/gameStore'

export class Windmill extends BuildingFriend {
  constructor(board, scene, x, y, sprite, callback, frame, tileXY, name) {
    super(board, scene, x, y, sprite, callback, frame, tileXY, name)

    this.menuButtons = []

    this._actionMarkers = []

    this.sprite.play('windmill')
    this.setDepth(this.y)

    this.upgradeTiles()
  }

  testCallback() {
    // let tiles = this.rexChess.board.ringToChessArray(this.rexChess.tileXYZ, 2, 0)
    let tiles = this.rexChess.board.filledRingToChessArray(this.rexChess.tileXYZ, 2, 0)
    this.showBorders(tiles)

    EventBus.emit('selectUnit', this)
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

  upgradeTiles() {
    this.scene.board.tileXYArrayToChessArray(this.getBorderTiles(), 0).forEach((tile) => {
      tile.food = tile.food + 1
    })
  }

  showPossibleActions() {
    this.hidePossibleActions()

    var tileXYArray = this.rexChess.board
      .getEmptyTileXYArrayInRange(this.rexChess.tileXYZ, 1, 1)
      .forEach((tileXY) => {
        this._actionMarkers.push(
          new OverworldActionMarker(
            this,
            tileXY,
            this.scene.midGroup,
            'overworldIndicators',
            2,
            1,
            () => {
              console.log('farm this')
              this.hidePossibleActions()
            }
          )
        )
      })
    return tileXYArray
  }
}
