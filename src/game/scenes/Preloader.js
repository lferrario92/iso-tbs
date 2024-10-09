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
    this.load.image('snow', 'snow.png')
    this.load.image('knight', 'knight.png')

    // this.load.image('grass', 'isometric tileset/separated images/tile_022.png')
    // this.load.image('grass2', 'isometric tileset/separated images/tile_027.png')

    // ICONS

    this.load.image('endTurnImage', 'ingame_ui/icons/endturn.png')
    this.load.image('primaryAttackImage', 'ingame_ui/icons/attack_boost.png')
    this.load.image('secondaryAttackImage', 'ingame_ui/icons/critical_boost.png')

    // ENTITIES

    this.load.image('castle', 'entities/castletest2.png')

    // BACKGROUNDS

    this.load.image('woodsBack', 'backgrounds/woods_back.png')
    this.load.image('shopInterior', 'backgrounds/shop_interior_test.jpg')
    // this.load.image('platform', 'platform.png')

    // MARKERS

    this.load.image('selector', 'ingame_ui/markers/select_placeholder.png')
    this.load.image('attack_place', 'ingame_ui/markers/attack_placeholder.png')
    this.load.image('move_place', 'ingame_ui/markers/move_placeholder.png')

    // STONE UI

    this.load.image('stonePanel', 'stone/stone_panel.png')
    this.load.image('stoneButton', 'stone/stone_button.png')
    this.load.image('stoneButtonLarge', 'stone/stone_button_large.png')
    this.load.image('stoneTabActive', 'stone/stone_tab_active.png')
    this.load.image('stoneDialogBox', 'stone/stone_dialog_box.png')

    // this.load.tilemapTiledJSON('map', 'test.json')
    this.load.tilemapCSV('map', 'test.csv')

    //CARDS

    // this.load.spritesheet('cards', 'pixelCardAssest.png', {
    //   frameWidth: 114,
    //   frameHeight: 128
    // })

    this.load.spritesheet('cardsBack', 'cards_ui/cardsBack.png', {
      frameWidth: 100,
      frameHeight: 128
    })

    this.load.spritesheet('cardIcons', 'cards_ui/cardIcons.png', {
      frameWidth: 22,
      frameHeight: 20
    })
    this.load.image('modifier_back', 'cards_ui/modifier_panel.png')
    this.load.image('cardOver', 'cards_ui/cardOver.png')
    this.load.image('selectedCardFrame', 'cards_ui/selected_card_frame.png')

    // CHARACTER SPRITES

    this.load.spritesheet('merchant', 'sprites/merchant.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('eye', 'sprites/eye.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('Orc', 'sprites/Orc.png', {
      frameWidth: 100,
      frameHeight: 100
    })
    this.load.spritesheet('Soldier', 'sprites/Soldier.png', {
      frameWidth: 100,
      frameHeight: 100
    })

    // BATTLE

    this.load.spritesheet('battleTiles', 'isometric_sprites/battle_spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.image('snowTest', 'isometric_sprites/snow_test.png')
    this.load.image('snowTest2', 'isometric_sprites/snow_test2.png')

    // OVERWORLD

    this.load.spritesheet(
      'overworldTiles',
      'isometric_sprites/Isometric_MedievalFantasy_Tiles.png',
      {
        frameWidth: 16,
        frameHeight: 17
      }
    )

    this.load.spritesheet('entitest', 'isometric_sprites/entitest.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    this.load.spritesheet('settler', 'isometric_sprites/settler.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    this.load.spritesheet(
      'overworldIndicators',
      'isometric_sprites/TRPGIsometricAssetPack_MapIndicators.png',
      {
        frameWidth: 16,
        frameHeight: 8
      }
    )

    this.load.spritesheet(
      'overworldEntities',
      'isometric_sprites/IsometricTRPGAssetPack_OutlinedEntities.png',
      {
        frameWidth: 16,
        frameHeight: 16
      }
    )
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start('MainMenu')
  }
}
