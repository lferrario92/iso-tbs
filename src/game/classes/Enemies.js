import { EnemyChess } from './EnemyChess'

export class EyeBallEnemy extends EnemyChess {
  constructor(board, scene, x, y) {
    super(board, scene, x, y, 'eye')
    this.scale = 1.3
    this.moveTo.setSpeed(150)
    this.health = 75
    this.damage = 30

    scene.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('eye', {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      }),
      frameRate: 8,
      repeat: -1
    })
    this.play('idle')
  }
}

export class OrcEnemy extends EnemyChess {
  constructor(board, scene, x, y, originCoords) {
    let health = 50
    let damage = 20
    super(board, scene, x, y, 'Orc', health, damage, originCoords)
    this.sprite.scale = 1
    this.sprite.y = this.sprite.y - 4
    this.moveTo.setSpeed(70)
    this.health = health
    this.damage = damage
    this.attackType = 'Melee'

    this.sprite.play('orcIdle')
  }
}

