import { Scene } from 'phaser'

export class Sunshine extends Scene {
  constructor() {
    super('Sunshine')
  }

  create() {
    // sunshine effect
    console.log(this)
    this.bg = this.add.image(0, 0, 'sunshine')
    this.bg.setOrigin(0, 0)
    this.bg.setAlpha(0)
    this.bg.setDisplaySize(740, 360)

    this.gradient = this.bg.preFX.addGradient()

    this.gradient.size = 70
    this.gradient.color1 = 0xffffff
    this.gradient.color2 = 'FFFFFF00'

    this.tweens
      .addCounter({
        from: 0,
        to: 1,
        duration: 1000,
        onUpdate: (tween) => {
          this.bg.setAlpha(tween.getValue())
        }
      })
      .on('complete', () => {
        this.time.addEvent({
          callback: () => {
            this.tweens.addCounter({
              from: 1,
              to: 0,
              duration: 1000,
              onUpdate: (tween) => {
                this.bg.setAlpha(tween.getValue())
              }
            })
          },
          delay: 1000,
          repeat: 0
        })
      })

    this.time.addEvent({
      callback: () => {
        this.scene.stop('Sunshine')
      },
      delay: 10000,
      repeat: 0
    })
  }
}
