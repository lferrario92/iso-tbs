import { EventBus } from '../../EventBus'
import { OverworldFriend } from './OverworldFriend'

export class Army extends OverworldFriend {
  constructor(board, scene, x, y, animation, units, name, key, tileXY) {
    super(board, scene, x, y, animation, units, name, key, tileXY)

    this.foodConsumption = 2 * units.length
  }

  build() {
    console.log('camp')
    EventBus.emit('clearOverworldUI')
  }
}
