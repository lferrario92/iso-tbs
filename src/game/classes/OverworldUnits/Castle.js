import { useGameStore } from '../../stores/gameStore'
import { EventBus } from '../../EventBus'
import { BuildingFriend } from './BuildingFriend'
import { OverworldActionMarker } from '../Markers'

export class Castle extends BuildingFriend {
  constructor(board, scene, x, y, sprite, callback, frame, tileXY, name) {
    super(board, scene, x, y, sprite, callback, frame, tileXY, name)

    this.menuButtons = []
    let scale = 2

    const createArmyButton = { key: 'primaryAttackImage', callback: 'createArmy' }
    const createSettlerButton = { key: 'primaryAttackImage', callback: 'createSettler' }

    this.menuButtons = [createArmyButton, createSettlerButton]

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

  showPossibleActions() {
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
              EventBus.emit('createSettlerAt', {
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
    console.log('create army')
  }
  createSettler() {
    console.log('create settler')
    const store = useGameStore()

    this.showPossibleActions()
  }
}
