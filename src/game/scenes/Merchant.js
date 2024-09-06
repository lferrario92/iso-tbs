import { Scene } from 'phaser'
import { Card } from '../classes/Card'
import { createCard, Random } from '../helpers'
import { useGameStore } from '../stores/gameStore'
import dataCards from '../data/cards.json'
export class Merchant extends Scene {
  constructor() {
    super('Merchant')
  }

  preload() {}

  create() {
    const store = useGameStore()
    const center = {
      x: this.scale.width / 2,
      y: this.scale.height / 2
    }

    console.log(store.money)
    this.merchantDude = this.add.sprite(center.x, center.y, 'merchant', 0).setInteractive()
    this.merchantDude.setScale(5)
    this.merchantDude.play('merchantIdle')

    this.exit = this.add
      .text(10, this.scale.height - 20, `exitexitexitexitexitexitexit`, {
        fontFamily: 'PublicPixel',
        fontSize: '12px',
        align: 'left'
      })
      .setInteractive()

    this.exit.on('pointerdown', () => {
      this.scene.switch('Overworld')
    })

    let marketCards = [...dataCards]
    this.playerCards = []

    this.renderCurrentCards(this, store)

    let marketTitle = this.add.text(10, 20, `Cards on sale`, {
      fontFamily: 'PublicPixel',
      fontSize: '12px',
      align: 'left'
    })

    let sellingTitle = this.add.text(10, center.y, `Cards to sell`, {
      fontFamily: 'PublicPixel',
      fontSize: '12px',
      align: 'left'
    })

    this.yourCash = this.add.text(this.scale.width - 180, center.y, `Money: ${store.money}`, {
      fontFamily: 'PublicPixel',
      fontSize: '12px',
      align: 'left'
    })

    marketCards.forEach((card, index) => {
      let theCard = createCard(this, 200 * (index + 1), 170, card, () => {
        let price = theCard.getData('price')

        if (store.money >= price) {
          store.removeMoney(theCard.getData('price'))
          console.log('current money ', store.money)
          theCard.getByName('sold').setAlpha(1)

          console.log(theCard)
          this.yourCash.setText(`Money: ${store.money}`)

          theCard.getByName('front').preFX.addColorMatrix().grayscale(1)
          theCard.getByName('over').preFX.addColorMatrix().grayscale(1)
          theCard.clearFX()

          theCard.removeInteractive()

          store.addCard(theCard)
          this.renderCurrentCards(this, store)
        } else {
          console.log('no te alcanza')
        }
      })
    })
  }

  renderCurrentCards(scene, store) {
    scene.playerCards.forEach((card) => {
      card.destroy()
    })
    scene.playerCards.splice(0)

    store.cards.forEach((card, index) => {
      let theCard = createCard(scene, 150 * (index + 1), 550, card, () => {
        store.sellCard(index)
        theCard.removeInteractive()
        console.log(store.money)

        theCard.getByName('front').preFX.addColorMatrix().grayscale(1)
        theCard.getByName('over').preFX.addColorMatrix().grayscale(1)
        theCard.getByName('iconGraphic').preFX.addColorMatrix().grayscale(1)

        scene.add.tween({
          targets: theCard,
          duration: 1000,
          repeat: 0,
          ease: 'back.in',
          scale: 0
        })
        // .on('complete', () => {
        //   theCard.destroy()
        // })
        scene.yourCash.setText(`Money: ${store.money}`)
      })

      scene.playerCards.push(theCard)
    })
  }
}
