import { Scene } from 'phaser'
import { QuadGrid } from 'phaser3-rex-plugins/plugins/board-components'
import { Board } from '../classes/Board.js'
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin'
import GesturesPlugin from 'phaser3-rex-plugins/plugins/pinch-plugin'
import { buildDrag, camera } from '../gameFunctions/Camera.js'
import { OverworldChess } from '../classes/OverworldUnits/OverworldChess.js'
import { createOverworldAnimations } from '../gameFunctions/Animations.js'
import { OverworldFriend } from '../classes/OverworldUnits/OverworldFriend.js'
import { OverworldFoe } from '../classes/OverworldUnits/OverworldFoe.js'
import { SoldierC } from '../classes/Soldier.js'
import { OrcEnemy } from '../classes/Enemies.js'
import { BuildingFriend } from '../classes/OverworldUnits/BuildingFriend.js'

export class TiledEx extends Scene {
  constructor() {
    super('TiledEx')
  }

  // preload() {
  //   this.load.scenePlugin({
  //     key: 'rexboardplugin',
  //     url: BoardPlugin,
  //     sceneKey: 'rexBoard'
  //   })

  //   this.load.plugin({
  //     key: 'rexpinchplugin',
  //     url: GesturesPlugin
  //   })
  //   this.load.image('tiles', '')
  //   this.load.tilemapTiledJSON('map', 'test.json')
  // }

  // create() {
  //   var map = this.add.tilemap('map')
  //   var tiles = map.addTilesetImage('Desert', 'overworldTiles')
  //   var layer = map.createLayer('Ground', tiles)

  //   var board = this.rexBoard.createBoardFromTilemap(map)
  // }

  preload() {
    this.load.scenePlugin({
      key: 'rexboardplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js',
      sceneKey: 'rexBoard'
    })

    this.load.setPath('assets')
    // this.load.tilemapTiledJSON('map', 'test.json')
  }

  create() {
    debugger
    var map = this.add.tilemap('map')
    var tiles = map.addTilesetImage('Isometric_MedievalFantasy_Tiles', 'overworldTiles')
    var layer = map.createLayer('Tile Layer 1', tiles)

    var board = this.rexBoard.createBoardFromTilemap(map)

    // var moveTo = this.rexBoard.add.moveTo(chess, {
    //   moveableTest: function (fromTileXYZ, toTileXYZ, direction, board) {
    //     var tile = board.tileXYZToChess(toTileXYZ.x, toTileXYZ.y, 'Ground')
    //     return tile.index === 30
    //   }
    // })
    // moveTo.on('complete', function () {
    //   moveTo.moveToRandomNeighbor()
    // })
    // moveTo.moveToRandomNeighbor()
  }
}
