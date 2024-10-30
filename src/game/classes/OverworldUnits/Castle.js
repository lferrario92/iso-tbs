import { EventBus } from '../../EventBus'
import { BuildingFriend } from './BuildingFriend'
import { OverworldActionMarker } from '../Markers'

export class Castle extends BuildingFriend {
  constructor(board, scene, x, y, sprite, callback, frame, tileXY, name) {
    super(board, scene, x, y, sprite, callback, frame, tileXY, name)

    this.menuButtons = []

    const createArmyButton = { key: 'create_army_button', callback: 'createArmy' }
    const createSettlerButton = { key: 'create_settler_button', callback: 'createSettler' }
    const createFarmerButton = { key: 'create_farmer_button', callback: 'createFarmer' }

    this.menuButtons = [createArmyButton, createSettlerButton, createFarmerButton]

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
    if (this.hasActed) {
      return
    }

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
              EventBus.emit(`create${unitType}At`, {
                key: 0,
                position: tileXY
              })
              this.hidePossibleActions()
            }
          )
        )
      })
    return tileXYArray
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
