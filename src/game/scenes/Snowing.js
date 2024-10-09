import { Scene } from 'phaser'

var max = 0
var front_emitter
var mid_emitter
var back_emitter
var update_interval = 4 * 60
var i = 0

export class Snowing extends Scene {
  constructor() {
    super('Snowing')
  }
  preload() {
    // this.load.spritesheet('snowflakes', 'assets/sprites/snowflakes.png', 17, 17)
    // this.load.spritesheet('snowflakes_large', 'assets/sprites/snowflakes_large.png', 64, 64)
  }

  create() {
    this.add
      .particles(this.scale.width / 2, this.scale.height / 2, 'snow', {
        x: { min: this.scale.width / 4, max: this.scale.width - this.scale.width / 6 },
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
        x: { min: this.scale.width / 4, max: this.scale.width - this.scale.width / 6 },
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

    // back_emitter.makeParticles('star', [0, 1, 2, 3, 4, 5])
    // back_emitter.maxParticleScale = 0.6
    // back_emitter.minParticleScale = 0.2
    // back_emitter.setYSpeed(20, 100)
    // back_emitter.gravity = 0
    // back_emitter.width = this.world.width * 1.5
    // back_emitter.minRotation = 0
    // back_emitter.maxRotation = 40

    // mid_emitter = new Phaser.GameObjects.Particles.ParticleEmitter(this, {
    //   x: this.scale.width / 2,
    //   y: -32,
    //   maxParticles: 250
    // })
    // mid_emitter.makeParticles('star', [0, 1, 2, 3, 4, 5])
    // mid_emitter.maxParticleScale = 1.2
    // mid_emitter.minParticleScale = 0.8
    // mid_emitter.setYSpeed(50, 150)
    // mid_emitter.gravity = 0
    // mid_emitter.width = this.world.width * 1.5
    // mid_emitter.minRotation = 0
    // mid_emitter.maxRotation = 40

    // front_emitter = new Phaser.GameObjects.Particles.ParticleEmitter(this, {
    //   x: this.scale.width / 2,
    //   y: -32,
    //   maxParticles: 50
    // })
    // front_emitter.makeParticles('star', [0, 1, 2, 3, 4, 5])
    // front_emitter.maxParticleScale = 1
    // front_emitter.minParticleScale = 0.5
    // front_emitter.setYSpeed(100, 200)
    // front_emitter.gravity = 0
    // front_emitter.width = this.world.width * 1.5
    // front_emitter.minRotation = 0
    // front_emitter.maxRotation = 40

    // changeWindDirection()

    // back_emitter.start(false, 14000, 20)
    // mid_emitter.start(false, 12000, 40)
    // front_emitter.start(false, 6000, 1000)
  }

  // update() {
  //   i++

  //   if (i === update_interval) {
  //     changeWindDirection()
  //     update_interval = Math.floor(Math.random() * 20) * 60 // 0 - 20sec @ 60fps
  //     i = 0
  //   }
  // }

  // changeWindDirection() {
  //   var multi = Math.floor((max + 200) / 4),
  //     frag = Math.floor(Math.random() * 100) - multi
  //   max = max + frag

  //   if (max > 200) max = 150
  //   if (max < -200) max = -150

  //   setXSpeed(back_emitter, max)
  //   setXSpeed(mid_emitter, max)
  //   setXSpeed(front_emitter, max)
  // }

  // setXSpeed(emitter, max) {
  //   emitter.setXSpeed(max - 20, max)
  //   emitter.forEachAlive(setParticleXSpeed, this, max)
  // }

  // setParticleXSpeed(particle, max) {
  //   particle.body.velocity.x = max - Math.floor(Math.random() * 30)
  // }
}
