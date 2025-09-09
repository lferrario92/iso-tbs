import { Cont } from '../../Cont'

export class SwordMan extends Cont {
  constructor(board, scene, x, y, originCoords, health) {
    // attrs, health, damage
    super(board, scene, x, y, 'SwordMan', health || 100, 25, originCoords)

    console.log(this)
    this.sprite.scale = 1
    this.sprite.y = this.sprite.y - 14
    this.moveTo.setSpeed(50)
    this.walkAnimation = 'swordmanWalk'
    this.idleAnimation = 'swordmanIdle'
    this.canBlock = false
    this.cutsceneOffsetY = 1

    this.attackType = 'Melee'

    this.sprite.play('swordmanIdle')
  }
}
