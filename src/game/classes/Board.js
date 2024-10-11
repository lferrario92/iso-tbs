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

    this.season = 'summer'

    this
      // Fill tiles
      .forEachTileXY(function (tileXY, board) {
        new Tile(board, tileXY, isOverworld)
      })
      // Enable touch events
      .setInteractive()
  }

  nextSeason() {
    if (this.season === 'summer') {
      this.season = 'winter'
      this.getTiles().forEach((x) => {
        this.scene.tweens
          .addCounter({
            from: 255,
            to: 0,
            duration: 1000,
            onUpdate: function (tween) {
              const value = Math.floor(tween.getValue())

              x.setTint(Phaser.Display.Color.GetColor(value, value, value))
            }
          })
          .on('complete', () => {
            x.setSnowy()
            this.scene.tweens.addCounter({
              from: 120,
              to: 255,
              duration: 1000,
              onUpdate: function (tween) {
                const value = Math.floor(tween.getValue())

                x.setTint(Phaser.Display.Color.GetColor(value, value, value))
              }
            })
          })
      })
    } else {
      this.season = 'summer'
      this.getTiles().forEach((x) => x.setSummer())
    }
  }

  getTiles() {
    return this.getAllChess().filter((x) => x instanceof Tile)
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
      let key = tileSet[level]
      super(scene, x, y, 'battleTiles', key)
      this.key = key
      this.scale = 1
    }

    this.isOverworld = isOverworld
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

  setSnowy() {
    if (this.isOverworld) {
      this.setTexture('overworldTiles', this.getData('level') + 33)
    } else {
      this.getData('level') ? this.setTexture('snowTest') : this.setTexture('snowTest2')
    }
  }

  setSummer() {
    if (this.isOverworld) {
      this.setTexture('overworldTiles', this.getData('level') + 11)
    } else {
      this.setTexture('battleTiles', this.key)
    }
  }
}
