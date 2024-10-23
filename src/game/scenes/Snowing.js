import { Scene } from 'phaser'

export class Snowing extends Scene {
  constructor() {
    super('Snowing')
  }

  create() {
    this.add
      .particles(this.scale.width / 2, this.scale.height / 2, 'snow', {
        x: { min: 0, max: this.scale.width },
        y: -10,
        scale: { min: 1, max: 1.3 },
        maxAliveParticles: 300,
        gravityY: 100,
        gravityX: -10,
        lifespan: 5000,
        duration: 3000
      })
      .setPosition(0, 0)

    this.add
      .particles(this.scale.width / 2, this.scale.height / 2, 'snow', {
        x: { min: 0, max: this.scale.width },
        y: -10,
        scale: { min: 1.5, max: 2.3 },
        maxAliveParticles: 300,
        gravityY: 200,
        gravityX: -20,
        lifespan: 5000,
        duration: 3000
      })
      .setPosition(0, 0)

    this.time.addEvent({
      callback: () => {
        this.scene.stop('Snowing')
      },
      delay: 15000,
      repeat: 0
    })
  }
}
