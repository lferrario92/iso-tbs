import { EventBus } from '../../EventBus'
import { BuildingFriend } from './BuildingFriend'
import { OverworldActionMarker } from '../Markers'
import units from '../../data/units.json'
import { useGameStore } from '../../stores/gameStore'

export class Castle extends BuildingFriend {
  constructor(board, scene, x, y, sprite, callback, frame, tileXY, name) {
    super(board, scene, x, y, sprite, callback, frame, tileXY, name)

    this.menuButtons = [...units]

    this.board = board
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

  showPossibleActions(unitType) {
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
              const store = useGameStore()
              EventBus.emit(`create${unitType}At`, {
                key: 0,
                position: tileXY
              })
              store.removeMoney(
                units.find((unit) => unit.type === unitType).requirements.money || 0
              )
              EventBus.emit('updateResourcesUI')
              this.hidePossibleActions()
            }
          )
        )
      })
    return tileXYArray
  }

  calculateFood() {
    let tiles = this.board.tileXYArrayToChessArray(this.getBorderTiles(), 0)

    tiles.forEach((tile) => {
      this.scene.add
        .text(tile.x, tile.y - 2, tile.food, {
          fontFamily: 'PublicPixel',
          fontSize: '12px',
          align: 'left'
        })
        .setOrigin(0, 0)
        .setScale(0.2)
    })

    return tiles.reduce((total, tile) => tile.food + total, 0)
  }

  createArmy() {
    this.showPossibleActions('Army')
  }
  createSettler() {
    this.showPossibleActions('Settler')
  }
  createFarmer() {
    this.showPossibleActions('Farmer')
  }
}
