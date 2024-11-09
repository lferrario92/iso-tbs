import { EventBus } from '../../EventBus'
import { OverworldFriend } from './OverworldFriend'
import { Windmill } from './Windmill'

export class Farmer extends OverworldFriend {
  constructor(board, scene, x, y, animation, units, name, key, tileXY) {
    super(board, scene, x, y, animation, units, name, key, tileXY)
  }

  build() {
    let building = new Windmill(
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
      'Windmill'
    )
    EventBus.emit('clearOverworldUI')

    this.destroy()
  }
}
