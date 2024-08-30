import { EventBus } from '../EventBus'
import { Scene } from 'phaser'
import { delay, Random } from '../helpers'
import { useGameStore } from '../stores/gameStore'

export class BattleCutscene extends Scene {
  constructor() {
    super('BattleCutscene')
  }

  create() {
    const store = useGameStore()
    if (!store.fightCutscene) {
      // store.fightCutscene = () => {
      //   return new Promise((resolve) => {
      //     resolve('resolved')
      //   })
      // }
    }

    EventBus.emit('current-scene-ready', this)

    const center = {
      x: this.scale.width / 2,
      y: this.scale.height / 2
    }

    this.bg = this.add.image(Random(200, 570), center.y - 80, 'summer5')
    this.bg.scale = 0.5

    if (store.currentFriend.texture.key == 'eye' || store.currentFoe.texture.key == 'eye') {
      this.scene.switch('Game')
    }

    const friendKey = store.currentFriend.texture.key
    const foeKey = store.currentFoe.texture.key

    let friend = this.add.sprite(center.x - 100, center.y + 60, friendKey)
    friend.scale = 8
    const friendIdle = `${friendKey.toLowerCase()}Idle`
    const friendDamage = `${friendKey.toLowerCase()}Damage`
    const friendDeath = `${friendKey.toLowerCase()}Death`
    const friendAttack = `${friendKey.toLowerCase()}${store.currentFriend.attackType}Attack`

    friend.play(friendIdle)

    let foe = this.add.sprite(center.x + 100, center.y + 60, foeKey)
    foe.setFlipX(true)
    foe.scale = 8
    const foeIdle = `${foeKey.toLowerCase()}Idle`
    const foeDamage = `${foeKey.toLowerCase()}Damage`
    const foeDeath = `${foeKey.toLowerCase()}Death`
    const foeAttack = `${foeKey.toLowerCase()}${store.currentFoe.attackType}Attack`

    foe.play(foeIdle)

    let damageDelay = 1200

    if (store.currentFriend.attackType === 'Bow') {
      friend.x = friend.x - 150
      damageDelay = 1800
    }

    var textConfig = { fontSize: '25px', color: 'red', fontFamily: 'Arial' }
    this.foeHealth = this.add.text(
      center.x + 100,
      center.y + 140,
      store.currentFoe.health,
      textConfig
    )

    this.friendHealth = this.add.text(
      center.x - 100,
      center.y + 140,
      store.currentFriend.health,
      textConfig
    )

    friend.playAfterDelay(friendAttack, 1000)
    foe.playAfterDelay(foeDamage, damageDelay)

    friend.on('animationcomplete', (anim) => {
      if (anim.key === friendAttack) {
        friend.play(friendIdle)
      } else if (anim.key === friendDamage) {
        let result = store.currentFriend.takeDamage(store.currentFoe.damage)
        this.friendHealth.setText(store.currentFriend.health)

        if (result === 'die') {
          friend.play(friendDeath)
          this.endAll(store, 500)
        } else {
          friend.play(friendIdle)
        }
      }
    })

    foe.on('animationcomplete', (anim) => {
      if (anim.key === foeDamage) {
        let result = store.currentFoe.takeDamage(store.currentFriend.damage)
        this.foeHealth.setText(store.currentFoe.health)

        if (result === 'die') {
          foe.play(foeDeath)
          this.endAll(store)
        } else {
          if (store.currentFriend.attackType === store.currentFoe.attackType) {
            foe.play(foeIdle)
            setTimeout(() => {
              foe.playAfterDelay(foeAttack, 1000)
              friend.playAfterDelay(friendDamage, 1200)

              this.endAll(store, 2200)
            }, 100)
            return
          } else {
            foe.play(foeIdle)
            this.endAll(store)
          }
        }
        // friend.play(friendIdle)
      } else if (anim.key === foeAttack) {
        foe.play(foeIdle)
        this.endAll(store)
      }
    })
  }

  endAll(store, time) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      store.cutSceneResolve()
      this.scene.switch('Game')
    }, time || 1500)
  }

  resetFightCutscenePromise() {
    return new Promise((resolve) => {
      asereje(resolve)
    })
  }

  restart() {
    this.scene.restart()
  }

  changeScene() {
    this.scene.switch('Game')
  }
}
