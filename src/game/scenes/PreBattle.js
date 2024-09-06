import { Scene } from 'phaser'
import { createCard } from '../helpers'
import { useGameStore } from '../stores/gameStore'
export class PreBattle extends Scene {
  constructor() {
    super('PreBattle')
  }

  preload() {}

  create() {
    let cardExample = {
      key: 'cards',
      frame: 0,
      price: 500,
      turns: -3,
      back: 0,
      icon: 2,
      modifier: 'crit',
      amount: 10,
      text: 'texto'
    }

    const store = useGameStore()

    this.playerCards = []

    store.cards.forEach((card, index) => {
      let theCard = createCard(this, 150 * (index + 1), 550, card, () => {
        if (theCard.getData('selected')) {
          theCard.getByName('front').clearFX()
          theCard.getByName('over').clearFX()
          theCard.getByName('iconGraphic').clearFX()

          this.tweens.remove(theCard.tween)
          theCard.setScale(2)
          theCard.setData('selected', false)
        } else {
          theCard.getByName('front').preFX.addColorMatrix().brown()
          theCard.getByName('over').preFX.addColorMatrix().brown()
          theCard.getByName('iconGraphic').preFX.addColorMatrix().brown()

          theCard.setData('selected', true)

          theCard.tween = this.add.tween({
            targets: theCard,
            duration: 500,
            repeat: -1,
            scale: 2.2,
            yoyo: true
          })
        }
      })
      this.playerCards.push(theCard)
    })

    this.exit = this.add
      .text(10, this.scale.height - 20, `exit`, {
        fontFamily: 'PublicPixel',
        fontSize: '12px',
        align: 'left'
      })
      .setInteractive()

    this.exit.on('pointerdown', () => {
      this.scene.switch('Overworld')
    })

    this.play = this.add
      .text(this.scale.width - 100, this.scale.height - 20, `play`, {
        fontFamily: 'PublicPixel',
        fontSize: '12px',
        align: 'left'
      })
      .setInteractive()

    this.play.on('pointerdown', () => {
      let cardsToApply = this.playerCards
        .filter((card) => card.getData('selected'))
        .map((card) => card.getData('raw'))
      console.log(cardsToApply)

      store.setInvadingModifiers([...cardsToApply])

      let gamescene = this.scene.switch('Game').launch('UI')

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
