import { Chess } from './Chess'
import { Cont } from './Cont'

export class Soldier extends Chess {
  constructor(board, scene, x, y) {
    super(board, scene, x, y, 'Soldier')
    this.scale = 2
    this.y = this.y - 4
    this.moveTo.setSpeed(150)
    this.health = 75
    this.damage = 25

    scene.anims.create({
      key: 'soldierIdle',
      frames: this.anims.generateFrameNumbers('Soldier', {
        frames: [0, 1, 2, 3, 4, 5]
      }),
      frameRate: 12,
      repeat: -1
    })

    scene.anims.create({
      key: 'soldierWalk',
      frames: this.anims.generateFrameNumbers('Soldier', {
        frames: [9, 10, 11, 12, 13, 14, 15, 16]
      }),
      frameRate: 12,
      repeat: -1
    })
    
    scene.anims.create({
      key: 'soldierAttack',
      frames: this.anims.generateFrameNumbers('Soldier', {
        frames: [18, 19, 20, 21, 22, 23]
      }),
      frameRate: 12,
      repeat: 0
    })

    
    scene.anims.create({
      key: 'soldierDamage',
      frames: this.anims.generateFrameNumbers('Soldier', {
        frames: [45, 46, 47, 48]
      }),
      frameRate: 12,
      repeat: 0
    })

    scene.anims.create({
      key: 'soldierDeath',
      frames: this.anims.generateFrameNumbers('Soldier', {
        frames: [54, 55, 56, 57]
      }),
      frameRate: 12,
      repeat: 0
    })

    this.play('soldierIdle')
  }
}

export class SoldierC extends Cont {
  constructor(board, scene, x, y, originCoords) {
    // attrs, health, damage
    super(board, scene, x, y, 'Soldier', 100, 25, originCoords)

    this.sprite.scale = 1
    this.sprite.y = this.sprite.y - 4
    this.moveTo.setSpeed(50)
    // this.health = 75
    // this.damage = 25

    this.attackType = 'Melee'

    this.sprite.play('soldierIdle')
  }
}
