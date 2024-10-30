import { Scene } from 'phaser'
import { createCard } from '../helpers'
import { useGameStore } from '../stores/gameStore'
export class PreBattle extends Scene {
  constructor() {
    super('PreBattle')
  }

  preload() {}

  create() {
    console.log('Prebattle, ', this)
    const store = useGameStore()

    if (!store.cards.length) {
      store.setInvadingModifiers([])

      let gamescene = this.scene.switch('Game').launch('UI')
      this.scene.stop('PreBattle')

      gamescene.scene.events.once(
        'destroy',
        function () {
          this.scene.add('Game', Game, true)
        },
        this
      )
    }
    this.playerCards = []
    let panel = this.add.image(this.scale.width / 2, this.scale.height / 2 + 25, 'stonePanel')

    this.midGroup = this.add.group()
    this.topGroup = this.add.group()
    this.midGroup.setDepth(1)
    this.topGroup.setDepth(2)

    store.cards.forEach((card, index) => {
      // en x tienen que ir desde 180 hasta 560 las cartas
      let theCard = createCard(this, 110 * (index + 1), 130, card, () => {
        if (theCard.getData('selected')) {
          theCard.getByName('front').clearFX()
          theCard.getByName('over').clearFX()
          theCard.getByName('iconGraphic').clearFX()

          // this.tweens.remove(theCard.tween)
          theCard.getByName('frame').setAlpha(0)
          theCard.setScale(1)
          theCard.setData('selected', false)
        } else {
          theCard.getByName('front').preFX.addColorMatrix().brown()
          theCard.getByName('over').preFX.addColorMatrix().brown()
          theCard.getByName('iconGraphic').preFX.addColorMatrix().brown()

          theCard.getByName('frame').setAlpha(1)
          theCard.setData('selected', true)
          theCard.setDepth(2)

          // theCard.tween = this.add.tween({
          //   targets: theCard,
          //   duration: 500,
          //   repeat: -1,
          //   scale: 1.2,
          //   yoyo: true
          // })
        }
      })
      this.topGroup.add(theCard)
      this.playerCards.push(theCard)
    })
    Phaser.Actions.GridAlign(this.playerCards, {
      width: 4,
      height: 2,
      cellWidth: 120,
      cellHeight: 145,
      x: 140,
      y: 68
    })

    this.title = this.add.text(this.scale.width / 2, 20, `Select Modifiers`, {
      fontFamily: 'PublicPixel',
      fontSize: '22px',
      align: 'right'
    })
    this.title.x = this.title.x - this.title.width / 2

    this.midGroup.add(panel)

    this.exit = this.add
      .text(10, this.scale.height - 20, `exit`, {
        fontFamily: 'PublicPixel',
        fontSize: '12px',
        align: 'left'
      })
      .setInteractive()

    this.exit.on('pointerdown', () => {
      this.scene.stop('PreBattle')
      this.scene.switch('Overworld').launch('OverworldUI')
    })

    this.playButton = this.add
      .text(this.scale.width - 100, this.scale.height - 20, `play`, {
        fontFamily: 'PublicPixel',
        fontSize: '12px',
        align: 'left'
      })
      .setInteractive()

    this.playButton.on('pointerdown', () => {
      let cardsToApply = this.playerCards
        .filter((card) => card.getData('selected'))
        .map((card) => card.getData('raw'))
      console.log(cardsToApply)

      let cardsToDelete = this.playerCards
        .map((card, index) => (card.getData('selected') ? index : undefined))
        .filter((x) => x != undefined)

      store.cards.forEach((card, index) => {
        if (cardsToDelete.includes(index)) {
          store.cards[index] = undefined
        }
      })
      store.cards = store.cards.filter((x) => x)

      // store.cards = cardsToDelete.map((index) => {
      //   store.cards[index] = undefined
      //     return store.cards[index]
      //   })
      //   .filter((x) => x)

      store.setInvadingModifiers([...cardsToApply])

      let gamescene = this.scene.switch('Game').launch('UI')
      this.scene.stop('PreBattle')

      gamescene.scene.events.once(
        'destroy',
        function () {
          this.scene.add('Game', Game, true)
        },
        this
      )
    })
  }
}
