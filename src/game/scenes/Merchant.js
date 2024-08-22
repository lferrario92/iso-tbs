import { Scene } from 'phaser'

export class Merchant extends Scene {
  constructor() {
    super('Merchant')
  }

  create() {
    const center = {
      x: this.scale.width / 2,
      y: this.scale.height / 2
    }
    this.merchantDude = this.add.sprite(center.x, center.y, 'merchant', 0).setInteractive()
    this.merchantDude.setScale(5)
    this.merchantDude.play('merchantIdle')

    this.merchantDude.on('pointerdown', () => {
      this.scene.switch('Overworld')
    })
  }
}
