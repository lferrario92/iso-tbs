import { EventBus } from '../EventBus'

export const generateGameUI = (scene) => {
  const scale = 4

  const endTurnButton = scene.add
    .sprite(scene.scale.width - 8 * scale, scene.scale.height - 8 * scale, 'endTurnImage')
    .setInteractive()
    .setScrollFactor(0, 0)
    .setScale(scale)

  const primaryAttackButton = scene.add
    .sprite(scene.scale.width - 8 * scale, scene.scale.height - 8 * scale, 'primaryAttackImage')
    .setInteractive()
    .setScrollFactor(0, 0)
    .setScale(scale)

  primaryAttackButton.x = primaryAttackButton.x - primaryAttackButton.width * scale

  const secondaryAttackButton = scene.add
    .sprite(scene.scale.width - 8 * scale, scene.scale.height - 8 * scale, 'secondaryAttackImage')
    .setInteractive()
    .setScrollFactor(0, 0)
    .setScale(scale)

  secondaryAttackButton.x =
    secondaryAttackButton.x -
    primaryAttackButton.width * scale -
    secondaryAttackButton.width * scale

  endTurnButton.on('pointerdown', () => {
    EventBus.emit('endTurn')
  })

  primaryAttackButton.on('pointerdown', () => {
    EventBus.emit('specialLineAttack')
  })

  secondaryAttackButton.on('pointerdown', () => {
    EventBus.emit('shortBowAttack')
  })
}

export const showModifiers = (scene, x, y, modifiers, title, renderedModifiers) => {
  let pos = y

  if (renderedModifiers?.length) {
    renderedModifiers.forEach((el) => el.destroy())
  }

  scene.add.text(x, y - 10, title, {
    fontFamily: 'PublicPixel',
    fontSize: '8px',
    align: 'left'
  })

  let uimodifiers = modifiers.map((modifier) => {
    let cont = new Phaser.GameObjects.Container(scene, x, pos, [])

    let width = 100
    let height = 48

    pos = pos + height + 5

    let iconGraphic = scene.add.image(0, 0, 'cardIcons', modifier.icon)
    iconGraphic.name = 'iconGraphic'

    let textObject = scene.add.text(40, 0, modifier.text, {
      fontFamily: 'PublicPixel',
      fontSize: '8px',
      align: 'left'
    })

    let turnsText = scene.add.text(
      modifier.turns > 0 ? 17 : 12,
      height / 2 - 12,
      `(${modifier.turns})`,
      {
        fontFamily: 'PublicPixel',
        fontSize: '6px',
        align: 'right'
      }
    )

    cont.add([iconGraphic, textObject, turnsText])
    // card.postFX.addShine(1, 0.2, 5)
    console.log(cont)
    cont.setSize(width, height)

    return scene.add.existing(cont)
  })

  return uimodifiers

  // EventBus.on('updateModifiers', (data) => {
  //   uimodifiers.forEach((el) => el.destroy())

  //   showModifiers(data.scene, data.x, data.y, data.modifiers, data.title)
  // })
}

export const rexUItest = (t) => {
  const COLOR_PRIMARY = 0x4e342e
  const COLOR_LIGHT = 0x7b5e57
  const COLOR_DARK = 0x260e04

  var createButton = function (scene, text) {
    return scene.rexUI.add.label({
      width: 100,
      height: 40,
      background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_LIGHT),
      text: scene.add.text(0, 0, text, {
        fontSize: 18
      }),
      space: {
        left: 10,
        right: 10
      }
    })
  }

  var buttons = t.rexUI.add
    .buttons({
      x: 400,
      y: 300,
      orientation: 'y',

      buttons: [createButton(t, 'turn')],

      space: { item: 8 }
    })
    .layout()
    .setScrollFactor(0, 0)
  //   // Add a header child, which is not part of buttons
  //   .add(createButton(t, 'Header'), {
  //     index: 0
  //   })
  //   // Add a footer child, which is not part of buttons
  //   .add(createButton(t, 'Footer'))

  var print = t.add.text(0, 0, '')
  buttons.on('button.click', function (button, index, pointer, event) {
    EventBus.emit('endTurn')
  })
}
