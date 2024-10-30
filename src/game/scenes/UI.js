import { Scene } from 'phaser'
import { generateGameUI } from '../gameFunctions/GenerateUI'

export class UI extends Scene {
  constructor() {
    super('UI')
  }

  create() {
    generateGameUI(this)

    this.events.on('destroy', () => {
      EventBus.off('updateModifiers')
    })
  }
}
