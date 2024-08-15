import { Random, RandomFromArray } from '../helpers.js'

const earthTiles = [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 15]
const rockTiles = [12, 13, 14, 15, 16]
const grassTiles = [23, 24, 25, 28, 29, 38, 39, 40]
const stoneTiles = [61, 63, 68, 69]

const tiles = [
  grassTiles,
  stoneTiles,
  rockTiles,
  earthTiles,
]

export class Board extends RexPlugins.Board.Board {
  constructor(scene, config, isOverworld) {
    super(scene, config)

    this
      // Fill tiles
      .forEachTileXY(function (tileXY, board) {
        new Tile(board, tileXY, isOverworld)
      })
      // Enable touch events
      .setInteractive()
  }
}

export class Tile extends Phaser.GameObjects.Sprite {
  constructor(board, tileXY, isOverworld, level) {
    var scene = board.scene
    if (level === undefined) {
      level = Random(0, 1)
    }
    let {x, y} = board.grid.getWorldXY(tileXY.x, tileXY.y)
    let keys = ['grass', 'grass2']
    
    if (isOverworld) {
      super(scene, x, y, 'overworldTiles', level + 11)
      this.scale = 1
    } else {
      super(scene, x, y, 'battleTiles', RandomFromArray(tiles[level]))
      this.scale = 1
    }
    
    board.addChess(this, tileXY.x, tileXY.y, 0)
    if (isOverworld) {
      // this.y = this.y + 3
    }

    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    if (level) {
    //   this.y = this.y - 2
    }
    scene.add.existing(this)
    // this.setStrokeStyle(1, 0xffffff)
    this.setData('level', level) // Store level value for cost function
  }
}
