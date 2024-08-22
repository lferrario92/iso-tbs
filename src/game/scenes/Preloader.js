import { Scene } from 'phaser'

export class Preloader extends Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, 'background')
    this.add.image(512, 384, 'summer5')

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets')

    this.load.image('logo', 'logo.png')
    this.load.image('star', 'star.png')
    this.load.image('knight', 'knight.png')

    this.load.image('grass', 'isometric tileset/separated images/tile_022.png')
    this.load.image('grass2', 'isometric tileset/separated images/tile_027.png')
    this.load.image('selector', 'select_placeholder.png')
    this.load.image('attack_place', 'attack_placeholder.png')
    this.load.image('move_place', 'move_placeholder.png')
    this.load.image('endTurnImage', 'teleportation_spell.png')
    this.load.image('primaryAttackImage', 'attack_boost.png')
    this.load.image('secondaryAttackImage', 'critical_boost.png')
    this.load.image('castle', 'castletest2.png')

    this.load.spritesheet('merchant', 'merchant.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('eye', 'eye.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('Orc', 'Orc.png', {
      frameWidth: 100,
      frameHeight: 100
    })
    this.load.spritesheet('Soldier', 'Soldier.png', {
      frameWidth: 100,
      frameHeight: 100
    })

    this.load.spritesheet('battleTiles', 'isometric tileset/spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('overworldTiles', 'Isometric_MedievalFantasy_Tiles.png', {
      frameWidth: 16,
      frameHeight: 17
    })

    this.load.spritesheet('overworldIndicators', 'TRPGIsometricAssetPack_MapIndicators.png', {
      frameWidth: 16,
      frameHeight: 8
    })

    this.load.spritesheet('overworldEntities', 'IsometricTRPGAssetPack_OutlinedEntities.png', {
      frameWidth: 16,
      frameHeight: 16
    })
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start('MainMenu')
  }
}
