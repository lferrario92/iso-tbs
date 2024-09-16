import { Random, RandomFromArray } from '../helpers.js'
import { useGameStore } from '../stores/gameStore.js'

const earthTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15]
const earthTilesBase = [9, 11]
const rockTiles = [12, 13, 14, 15, 16]
const grassTiles = [23, 24, 25, 28, 29, 38, 39, 40]
const grassTilesBase = [23, 28]
const stoneTiles = [61, 63, 68, 69]

const tiles = [earthTilesBase, grassTilesBase, stoneTiles, rockTiles]

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
    const store = useGameStore()
    if (level === undefined) {
      level = Random(0, 1)
    }
    let { x, y } = board.grid.getWorldXY(tileXY.x, tileXY.y)

    if (isOverworld) {
      super(scene, x, y, 'overworldTiles', level + 11)
      this.scale = 1
    } else {
      const tileSet = tiles[store.warData.level || 0]
      let tile = tileSet[level]
      super(scene, x, y, 'battleTiles', tile)
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
