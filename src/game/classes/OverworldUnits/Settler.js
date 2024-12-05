import { EventBus } from '../../EventBus'
import { Castle } from './Castle'
import { OverworldFriend } from './OverworldFriend'

export class Settler extends OverworldFriend {
  constructor(board, scene, x, y, animation, units, name, key, tileXY) {
    super(board, scene, x, y, animation, units, name, key, tileXY)
  }

  build() {
    let building = new Castle(
      this.rexChess.board,
      this.scene,
      0,
      0,
      'castle',
      () => {
        building.testCallback()
      },
      0,
      this.rexChess.tileXYZ,
      'Castle'
    )
    EventBus.emit('clearOverworldUI')
    building.setDepth(building.y)
    this.scene.buildings.push(building)

    this.destroy()
  }
}
