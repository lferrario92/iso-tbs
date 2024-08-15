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
      y: this.scale.height / 2,
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
    const friendAttack = `${friendKey.toLowerCase()}${store.currentFriend.attackType}Attack`

    friend.play(friendIdle)
    
    let foe = this.add.sprite(center.x + 100, center.y + 60, foeKey)
    foe.setFlipX(true)
    foe.scale = 8
    const foeIdle = `${foeKey.toLowerCase()}Idle`
    const foeDamage = `${foeKey.toLowerCase()}Damage`
    const foeDeath = `${foeKey.toLowerCase()}Death`

    foe.play(foeIdle)

    
    let foeDamageDelay = 1200

    if (store.currentFriend.attackType === 'Bow') {
      friend.x = friend.x - 150
      foeDamageDelay = 1800
    }

    var textConfig = { fontSize: '25px', color: 'red', fontFamily: 'Arial' }
    this.foeHealth = this.add.text(
      center.x + 100,
      center.y + 140,
      store.currentFoe.health,
      textConfig
    )

    friend.playAfterDelay(friendAttack, 1000)
    foe.playAfterDelay(foeDamage, foeDamageDelay)
    
    friend.on('animationcomplete', (anim) => {
      if (anim.key === friendAttack) {
        friend.play(friendIdle)
      }
    })

    foe.on('animationcomplete', (anim) => {
      if (anim.key === foeDamage) {
        let result = store.currentFoe.takeDamage(store.currentFriend.damage)
        this.foeHealth.setText(store.currentFoe.health)

        if (result === 'die') {
          foe.play(foeDeath)
        } else {
          foe.play(foeIdle)
        }
        // friend.play(friendIdle)

        setTimeout(() => {
          store.cutSceneResolve()
          this.scene.switch('Game')
        }, 1000);
      }
    })
  }
  
  resetFightCutscenePromise () {
    return new Promise((resolve) => {
      asereje(resolve)
    })
  }

  restart () {
    this.scene.restart()
  }
  
  changeScene() {
    this.scene.switch('Game')
  }
}
