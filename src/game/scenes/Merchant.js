import { LEFT, Scene } from 'phaser'
import { Card } from '../classes/Card'
import { createCard, delay, Random } from '../helpers'
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
    let back = this.add.image(280, 155, 'shopInterior')

    back.setScale(0.6)

    this.merchantDude = this.add.sprite(140, 270, 'merchant', 0)
    this.merchantDude.setScale(5)
    this.merchantDude.play('merchantIdle')
    // console.log('base, ', this.merchantDude)

    // speech limits X: 10-200; Y: 0-150
    let dialogBox = this.add.image(5, 5, 'stoneDialogBox')
    dialogBox.setOrigin(0, 0)

    this.storeSpeech = this.add.text(10, 10, '', {
      fontFamily: 'PublicPixel',
      fontSize: '11px',
      align: 'left',
      lineSpacing: 3,
      stroke: 'black',
      strokeThickness: 2,
      // backgroundColor: 'black',
      wordWrap: { width: 170 }
    })

    this.wordByWord(this, true)

    this.marketGroup = this.add.group()
    this.playerGroup = this.add.group()

    this.exit = this.add
      .text(10, this.scale.height - 20, `Exit`, {
        fontFamily: 'PublicPixel',
        fontSize: '12px',
        align: 'left'
      })
      .setInteractive()

    this.exit.on('pointerdown', () => {
      this.scene.stop('Merchant')
      this.scene.switch('Overworld')
    })

    let marketCards = [...dataCards]
    this.playerCards = []
    let panelCenter = this.scale.width - 252
    let panel = this.add.image(panelCenter - 5, this.scale.height / 2 + 25, 'stonePanel')

    this.renderCurrentCards(this, store)

    // let marketTitle = this.add.text(10, 20, `Cards on sale`, {
    //   fontFamily: 'PublicPixel',
    //   fontSize: '12px',
    //   align: 'left'
    // })

    // let sellingTitle = this.add.text(10, center.y, `Cards to sell`, {
    //   fontFamily: 'PublicPixel',
    //   fontSize: '12px',
    //   align: 'left'
    // })

    this.yourCash = this.add.text(this.scale.width - 180, 26, `Money: ${store.money}`, {
      fontFamily: 'PublicPixel',
      fontSize: '12px',
      align: 'left'
    })

    let sellButtonText = this.add.text(0, 0, `Sell`, {
      fontFamily: 'PublicPixel',
      fontSize: '10px',
      align: 'center'
    })
    sellButtonText.setOrigin()

    let sellButtonSprite = this.add.image(0, 0, 'stoneTabActive')

    let sellButton = this.add.container(350, 46, [sellButtonSprite, sellButtonText])
    sellButton.setSize(56, 27)
    sellButton.setInteractive()

    let buyButtonText = this.add.text(0, 0, `Buy`, {
      fontFamily: 'PublicPixel',
      fontSize: '10px',
      align: 'center'
    })
    buyButtonText.setOrigin()

    let buyButtonSprite = this.add.image(0, 0, 'stoneTabActive')

    let buyButton = this.add.container(280, 46, [buyButtonSprite, buyButtonText])
    buyButton.setSize(56, 27)
    // buyButton.setInteractive()

    buyButton.on('pointerdown', () => {
      if (this.wordTimeEvent) {
        this.wordTimeEvent.destroy()
      }
      buyButton.removeInteractive()
      sellButton.setInteractive()
      this.marketGroup.setVisible(true)
      this.playerGroup.setVisible(false)
      sellButton.setAlpha(0.8)
      buyButton.setAlpha(1)
      this.wordByWord(this, true)
    })

    sellButton.on('pointerdown', () => {
      if (this.wordTimeEvent) {
        this.wordTimeEvent.destroy()
      }
      sellButton.removeInteractive()
      buyButton.setInteractive()
      this.marketGroup.setVisible(false)
      this.playerGroup.setVisible(true)
      this.renderCurrentCards(this, store)
      sellButton.setAlpha(1)
      buyButton.setAlpha(0.8)
      this.wordByWord(this, false)
    })

    sellButton.setAlpha(0.8)
    this.playerGroup.setVisible(false)

    marketCards.forEach((card, index) => {
      let theCard = createCard(this, 110 * (index + 1), 100, card, () => {
        let price = theCard.getData('price')

        if (store.cards.length >= 8) {
          console.log('limite de cartas')
          return
        }

        if (store.money >= price) {
          store.removeMoney(theCard.getData('price'))
          theCard.getByName('sold').setAlpha(1)

          this.yourCash.setText(`Money: ${store.money}`)

          theCard.getByName('front').preFX.addColorMatrix().grayscale(1)
          theCard.getByName('over').preFX.addColorMatrix().grayscale(1)
          theCard.clearFX()

          theCard.removeInteractive()

          store.addCard(theCard)
        } else {
          console.log('no te alcanza')
        }
      })
      this.marketGroup.add(theCard)
    })

    Phaser.Actions.GridAlign(this.marketGroup.children.entries, {
      width: 4,
      height: 2,
      cellWidth: 120,
      cellHeight: 145,
      x: 260,
      y: 70
    })
  }

  renderCurrentCards(scene, store) {
    scene.playerCards.forEach((card) => {
      card.destroy()
    })
    scene.playerCards.splice(0)

    store.cards.forEach((card, index) => {
      let theCard = createCard(scene, 110 * (index + 1), 250, card, () => {
        store.sellCard(index)
        theCard.removeInteractive()

        theCard.getByName('front').preFX.addColorMatrix().grayscale(1)
        theCard.getByName('over').preFX.addColorMatrix().grayscale(1)
        theCard.getByName('iconGraphic').preFX.addColorMatrix().grayscale(1)

        scene.add
          .tween({
            targets: theCard,
            duration: 1000,
            repeat: 0,
            ease: 'back.in',
            scale: 0
          })
          .on('complete', () => {
            theCard.destroy()
          })
        scene.yourCash.setText(`Money: ${store.money}`)
      })

      scene.playerCards.push(theCard)
      scene.playerGroup.add(theCard)
    })

    Phaser.Actions.GridAlign(scene.playerGroup.children.entries, {
      width: 4,
      height: 2,
      cellWidth: 120,
      cellHeight: 145,
      x: 260,
      y: 70
    })
  }

  wordByWord(scene, buying) {
    let text = ''
    if (buying) {
      text =
        'Look at this spells. . .   They will surely give you a priceless advantage on the battlefield. . . .'
    } else {
      text = "Well. . .   Let's see what you have."
    }

    let currentText = ''
    scene.storeSpeech.setText(currentText)

    scene.wordTimeEvent = scene.time.addEvent({
      callback: () => {
        currentText = currentText + ' ' + (text.split(' ')[currentText.split(' ').length - 1] || '')

        // TODO: sound cling cling
        scene.storeSpeech.setText(currentText)
      },
      delay: 250,
      repeat: text.split(' ').length
    })
  }
}
