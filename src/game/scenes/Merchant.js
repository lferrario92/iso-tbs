import { Scene } from 'phaser'
import { Card } from '../classes/Card'
import { Random } from '../helpers'
import { useGameStore } from '../stores/gameStore'

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

    this.merchantDude.on('pointerdown', () => {
      this.scene.switch('Overworld')
    })

    // const card = this.add.plane(150, 150, 'card')
    // const card2 = this.add
    //   .plane(350, 150, 'cards', 0)
    //   .setInteractive()
    //   .on('pointerdown', () => {
    //     this.tweens.add({
    //       targets: card2,
    //       props: {
    //         scaleX: { value: 0, duration: 100, yoyo: true },
    //         texture: { value: ['cards', 0], duration: 0, delay: 100 }
    //       }
    //     })
    //   })

    // card.setScale(2)
    // card2.setScale(2)

    let marketCards = [
      { key: 'cards', frame: 1, price: 100 },
      { key: 'cards', frame: 1, price: 50 }
    ]

    this.renderCurrentCards(this, store)

    marketCards.forEach((card, index) => {
      let theCard = this.createCard(
        this,
        150 * (index + 1),
        150,
        card.key,
        card.frame,
        card.price,
        () => {
          let price = theCard.getData('price')

          if (store.money >= price) {
            store.removeMoney(theCard.getData('price'))
            console.log('current money ', store.money)
            theCard.getByName('sold').setAlpha(1)

            console.log(theCard)

            theCard.getByName('front').preFX.addColorMatrix().grayscale(1)
            theCard.getByName('sign').preFX.addColorMatrix().grayscale(1)
            theCard.clearFX()

            theCard.removeInteractive()

            this.renderCurrentCards(this, store)
          } else {
            console.log('no te alcanza')
          }
        }
      )
    })

    // this.card3 = this.createCard(this, 550, 150, 'cards', 1, 103, () => {
    //   let price = this.card3.getData('price')
    //   if (store.money >= price) {
    //     store.removeMoney(this.card3.getData('price'))
    //     console.log('current money ', store.money)
    //     this.card3.getByName('sold').setAlpha(1)
    //     console.log(this.card3)

    //     this.card3.getByName('front').preFX.addColorMatrix().grayscale(1)
    //     this.card3.getByName('sign').preFX.addColorMatrix().grayscale(1)
    //     this.card3.clearFX()

    //     this.card3.removeInteractive()
    //   } else {
    //     console.log('no te alcanza')
    //   }
    // })

    // const fx = card.postFX.addShine(1, 0.2, 5)
    // const fx2 = card2.postFX.addShine(1, 0.2, 5)

    // card.setInteractive().on('pointerdown', () => {
    //   this.add.tween({
    //     targets: card,
    //     duration: 500,
    //     repeatDelay: 0,
    //     rotateY: 360,
    //     repeat: 0,
    //     scale: 0
    //   })
    // })

    // this.add.tween({
    //   targets: [card],
    //   duration: 500,
    //   repeatDelay: 2800,
    //   rotateY: 360,
    //   repeat: -1
    // })
  }

  renderCurrentCards (scene, store) {
    store.cards.forEach((card, index) => {
      let theCard = scene.createCard(
        scene,
        150 * (index + 1),
        550,
        card.key,
        card.frame,
        card.price,
        () => {
          store.sellCard(index)
          theCard.removeInteractive()
          console.log(store.money)

          theCard.getByName('front').preFX.addColorMatrix().grayscale(1)
          theCard.getByName('sign').preFX.addColorMatrix().grayscale(1)
          this.add.tween({
            targets: theCard,
            duration: 500,
            repeatDelay: 0,
            rotateY: 360,
            repeat: 0,
            scale: 0
          }).on('complete', () => { theCard.destroy() });
        }
      )
    })
  }

  createCard(scene, x, y, key, frame, price, callback) {
    let card = new Phaser.GameObjects.Container(scene, x, y, [])

    card.setData('price', price)
    let width = 114
    let height = 128

    let front = scene.add.image(0, 0, key, frame)
    front.name = 'front'
    let sold = scene.add.image(0, 0, 'star')
    sold.name = 'sold'
    let sign = scene.add.image(12, 47, 'sign', 0)
    sign.name = 'sign'

    let text = scene.add.text(-15, 47, `Esto vale ${price}`, {
      fontFamily: 'PublicPixel',
      fontSize: '8px',
      align: 'left'
    })

    sold.setAlpha(0)

    card.add([front, sign, text, sold])
    card.setScale(1)
    card.postFX.addShine(1, 0.2, 5)

    card.setSize(width, height)
    card.setInteractive().on('pointerdown', callback)

    return scene.add.existing(card)
  }
}
