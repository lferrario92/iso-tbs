import { Chess } from './Chess'
import { Cont } from './Cont'

export class SoldierC extends Cont {
  constructor(board, scene, x, y, originCoords, health) {
    // attrs, health, damage
    super(board, scene, x, y, 'Soldier', health || 100, 25, originCoords)

    this.sprite.scale = 1
    this.sprite.y = this.sprite.y - 4
    this.moveTo.setSpeed(50)
    // this.health = 75
    // this.damage = 25

    this.attackType = 'Melee'

    this.sprite.play('soldierIdle')
  }
}
