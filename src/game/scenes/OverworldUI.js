import { Scene } from 'phaser'
import { EventBus } from '../EventBus'
import { useGameStore } from '../stores/gameStore'

export class OverworldUI extends Scene {
  constructor() {
    super('OverworldUI')
  }

  create() {
    const store = useGameStore()
    const scale = 4

    const endTurnButton = this.add
      .sprite(this.scale.width - 8 * scale, this.scale.height - 8 * scale, 'endTurnImage')
      .setInteractive()
      .setScrollFactor(0, 0)
      .setScale(scale)

    const createSoldier = this.add
      .sprite(this.scale.width - 8 * scale, this.scale.height - 8 * scale, 'primaryAttackImage')
      .setInteractive()
      .setScrollFactor(0, 0)
      .setScale(scale)

    createSoldier.x = createSoldier.x - createSoldier.width * scale

    // const secondaryAttackButton = this.add
    //   .sprite(this.scale.width - (8 * scale), this.scale.height - (8 * scale), 'secondaryAttackImage')
    //   .setInteractive()
    //   .setScrollFactor(0, 0)
    //   .setScale(scale)

    // secondaryAttackButton.x =
    //   secondaryAttackButton.x - createSoldier.width * scale - secondaryAttackButton.width * scale
    this.overworldUI = new Phaser.GameObjects.Container(this, 0, 0)
    this.currentUnits = []

    EventBus.on('selectUnit', (unit) => {
      if (unit.units) {
        this.currentUnits.forEach((unit) => unit?.destroy())
        this.currentUnits.splice(0)

        this.currentUnits = unit.units.map((unit) => {
          let unitContainer = new Phaser.GameObjects.Container(this, 0, 0, [])

          let health = this.add
            .text(0, 18, '100', {
              fontFamily: 'PublicPixel',
              fontSize: '10px',
              align: 'center'
            })
            .setOrigin()

          unitContainer.add([this.add.sprite(0, 0, unit.type, 0).setScale(2), health])

          this.add.existing(unitContainer)
          return unitContainer
        })

        Phaser.Actions.GridAlign(this.currentUnits, {
          width: 3,
          height: 3,
          cellWidth: 40,
          cellHeight: 40,
          x: 30,
          y: 170
        })
        console.log(this.currentUnits)
      }
    })

    this.sidePanel = this.add.sprite(0, 0, 'stoneSidePanel')
    this.sidePanel.setInteractive()
    this.sidePanel.setOrigin(0, 0)

    this.overworldUI.add([this.sidePanel])
    this.add.existing(this.overworldUI)

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
