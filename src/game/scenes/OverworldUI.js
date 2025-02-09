import { Scene } from 'phaser'
import { EventBus } from '../EventBus'
import { useGameStore } from '../stores/gameStore'

let descriptions = {
  Army: 'An army is a group of units that can attack and move around the map.',
  Settler: 'A settler is a unit that can build and move around the map.',
  Farmer: 'A farmer is a unit that can build and move around the map.',
  Castle: 'A castle is a building',
  Windmill: 'A windmill is an animated building'
}

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
      .setScale(3)

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
    this.buttonContainer = []

    this.money = this.add
      .text(160, 5, store.money, {
        fontFamily: 'PublicPixel',
        fontSize: '10px',
        align: 'left'
      })
      .setOrigin(0, 0)

    this.food = this.add
      .text(240, 5, store.food, {
        fontFamily: 'PublicPixel',
        fontSize: '10px',
        align: 'left'
      })
      .setOrigin(0, 0)
    console.log(this.food)

    EventBus.on('clearOverworldUI', () => {
      this.clearOverworldUI(this)
    })

    EventBus.on('selectUnit', (unit) => {
      this.clearOverworldUI(this)

      this.currentName = this.add
        .text(40, 15, unit.name, {
          fontFamily: 'PublicPixel',
          fontSize: '10px',
          align: 'left'
        })
        .setOrigin(0, 0)

      this.currentGraphic = this.add
        .sprite(
          5,
          5,
          unit.sprite.texture.key,
          unit.sprite.anims.currentAnim?.frames[0].frame.name || 0
        )
        .setScale(2)
        .setOrigin(0, 0)

      this.currentDescription = this.add
        .text(15, 40, descriptions[unit.name], {
          fontFamily: 'PublicPixel',
          fontSize: '8px',
          lineSpacing: 4,
          align: 'left',
          wordWrap: { width: 130 }
        })
        .setLineSpacing(4)
        .setOrigin(0, 0)

      if (unit.units) {
        this.currentUnits.forEach((unit) => unit?.destroy())
        this.currentUnits.splice(0)

        this.subTitle = this.add
          .text(30, 145, 'Units', {
            fontFamily: 'PublicPixel',
            fontSize: '10px',
            align: 'center'
          })
          .setOrigin()

        this.currentUnits = unit.units.map((unit) => {
          let unitContainer = new Phaser.GameObjects.Container(this, 0, 0, [])

          let health = this.add
            .text(0, 18, unit.health || 909, {
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
          cellHeight: 50,
          x: 30,
          y: 180
        })
        console.log(this.currentUnits)
      }

      if (unit.type === 'Building') {
        this.subTitle = this.add
          .text(10, 145, 'Create unit', {
            fontFamily: 'PublicPixel',
            fontSize: '10px',
            align: 'center'
          })
          .setOrigin(0, 0)

        this.buttonContainer = unit.menuButtons.map((button) => {
          let unitButton = new Phaser.GameObjects.Container(this, 0, 0, [])

          let sprite = new Phaser.GameObjects.Sprite(this, 0, 0, button.key)

          sprite.setScale(2)

          let price = this.add
            .text(0, 22, button.requirements.money, {
              fontFamily: 'PublicPixel',
              fontSize: '10px',
              align: 'center'
            })
            .setOrigin()
          unitButton.add([sprite, price])

          this.add.existing(unitButton)

          sprite.setInteractive()
          sprite.on('pointerdown', () => {
            if (button.requirements.money <= store.money) {
              store.selectedUnit[button.callback]()
            } else {
              alert('no te alcanza')
            }
          })
          return unitButton
        })

        Phaser.Actions.GridAlign(this.buttonContainer, {
          width: 3,
          height: 3,
          cellWidth: 40,
          cellHeight: 40,
          x: 24,
          y: 175
        })
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

    EventBus.on('updateResourcesUI', () => {
      this.money.setText(store.money)
      this.food.setText(store.food)
    })

    createSoldier.on('pointerdown', () => {
      EventBus.emit('createSoldier')
    })

    // secondaryAttackButton.on('pointerdown', () => {
    //   EventBus.emit('shortBowAttack')
    // })
  }

  clearOverworldUI(ctx) {
    ctx.currentGraphic?.destroy()
    ctx.currentName?.destroy()
    ctx.subTitle?.destroy()
    ctx.currentDescription?.destroy()

    ctx.currentUnits.forEach((unit) => unit?.destroy())
    ctx.currentUnits.splice(0)
    ctx.buttonContainer.forEach((unit) => unit?.destroy())
    ctx.buttonContainer.splice(0)
  }
}
