export class Card extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, frame) {
    debugger
    super(x, y, [])

    this.plane = this.add.plane(0, 0, key, frame || 0)

    scene.add(this)
  }
}
