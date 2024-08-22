import { Scene } from 'phaser'
import { generateGameUI } from '../gameFunctions/GenerateUI'

export class OverworldUI extends Scene {
  constructor() {
    super('OverworldUI')
  }

  create() {
    const scale = 4

    const endTurnButton = scene.add
      .sprite(scene.scale.width - 8 * scale, scene.scale.height - 8 * scale, 'endTurnImage')
      .setInteractive()
      .setScrollFactor(0, 0)
      .setScale(scale)

    const createSoldier = scene.add
      .sprite(scene.scale.width - 8 * scale, scene.scale.height - 8 * scale, 'primaryAttackImage')
      .setInteractive()
      .setScrollFactor(0, 0)
      .setScale(scale)

    createSoldier.x = createSoldier.x - createSoldier.width * scale

    // const secondaryAttackButton = scene.add
    //   .sprite(scene.scale.width - (8 * scale), scene.scale.height - (8 * scale), 'secondaryAttackImage')
    //   .setInteractive()
    //   .setScrollFactor(0, 0)
    //   .setScale(scale)

    // secondaryAttackButton.x =
    //   secondaryAttackButton.x - createSoldier.width * scale - secondaryAttackButton.width * scale

    endTurnButton.on('pointerdown', () => {
      EventBus.emit('endTurnOverworld')
    })

    createSoldier.on('pointerdown', () => {
      EventBus.emit('createSoldier')
    })

    // secondaryAttackButton.on('pointerdown', () => {
    //   EventBus.emit('shortBowAttack')
    // })
  }
}
