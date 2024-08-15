import { EventBus } from '../EventBus';
import { killChessAt } from '../helpers.js'
import { MoveableMarker, OverworldActionMarker } from './Markers.js'

export class OverworldChess extends Phaser.GameObjects.Container {
  constructor(board, scene, x, y, key, health, damage, tileXY) {
    super(scene, x, y, [])

    this.selector = scene.add.image(0, 0, 'overworldIndicators',  5)
    this.sprite = scene.add.sprite(0, -4, 'overworldEntities', 0)
    this.texture = this.sprite.texture
    this.attackType = 'Melee'

    this.add(this.sprite)
    this.add(this.selector)
    this.selector.setAlpha(0)
    this.selector.scale = 1.8
    this.bringToTop(this.sprite)

    this.scene.topGroup.add(this)

    this.health = health || 100
    this.damage = damage || 10

    this.sprite.play('overworldIdle')

    // var textConfig = { fontSize: '20px', color: 'white', fontFamily: 'Arial' }
    // this.text = scene.add.text(0, 0, this.health, textConfig)

    // this.add(this.text)
    this.scale = 0.5
    if (tileXY === undefined) {
      // implement cardinal points
      tileXY = board.getRandomEmptyTileXY(1)
    }

    board.addChess(this, tileXY.x, tileXY.y, 1)

    scene.add.existing(this)
    this.hasMoved = false
    this.hasActed = false

    this.on(
      'board.pointerdown',
      function () {
        this.select()
      },
      this
    )

    // add behaviors
    this.moveTo = scene.rexBoard.add.moveTo(this)
    this.pathFinder = scene.rexBoard.add.pathFinder(this, {
      occupiedTest: true,
      pathMode: 'random',
      cost: function (curTile, preTile, pathFinder) {
        var board = pathFinder.board
        curTile = board.tileXYZToChess(curTile.x, curTile.y, 0)
        preTile = board.tileXYZToChess(preTile.x, preTile.y, 0)
        var curLevel = curTile.getData('level')
        var preLevel = preTile.getData('level')
        return 1
      },
      cacheCost: false
    })

    this.moveTo.setSpeed(20)

    // private members
    this._markers = []
    this._actionMarkers = []
  }
  showPossibleActions() {
    this.hidePossibleActions()
    if (this.hasActed) {
      return
    }

    // var tileXYArray = this.rexChess.board.getNeighborTileXY(this.rexChess.tileXYZ, null)
    var tileXYArray = this.rexChess.board.getNeighborChess(this.rexChess.tileXYZ).forEach((x) => {
      if (x instanceof OverworldChess) {
        return
      }
      this._actionMarkers.push(
        new OverworldActionMarker(
          this,
          x.rexChess.tileXYZ,
          this.scene.midGroup,
          'overworldIndicators',
          2,
          1
        )
      )
    })
    return tileXYArray
  }

  hidePossibleActions() {
    if (!this._actionMarkers && !this._actionMarkers.length) {
      return
    }
    for (var i = 0, cnt = this._actionMarkers.length; i < cnt; i++) {
      this._actionMarkers[i].destroy()
    }
    this._actionMarkers.length = 0
    return this
  }

  showMoveableArea() {
    this.hideMoveableArea()
    if (this.hasMoved) {
      return
    }
    var tileXYArray = this.pathFinder.findArea(2)
    for (var i = 0, cnt = tileXYArray.length; i < cnt; i++) {
      this._markers.push(
        new MoveableMarker(this, tileXYArray[i], this.scene.midGroup, 'overworldIndicators', 1, 1)
      )
    }
    return this
  }

  hideMoveableArea() {
    for (var i = 0, cnt = this._markers.length; i < cnt; i++) {
      this._markers[i].destroy()
    }
    this._markers.length = 0
    return this
  }

  moveToTile(endTile) {
    if (this.moveTo.isRunning) {
      return false
    }
    // this.sprite.play('soldierIdle')

    if (!endTile) {
      debugger
    }
    var tileXYArray = this.pathFinder.getPath(endTile.rexChess.tileXYZ)
    this.moveAlongPath(tileXYArray)
    return true
  }

  moveAlongPath(path, andAct) {
    this.hidePossibleActions()

    if (path.length === 0) {
      this.showMoveableArea()
      EventBus.emit('clearUI', this)
      this.resetMoveFlag()

      if (andAct) {
        this.checkPossibleAction()
      }
      return
    }

    this.moveTo.once(
      'complete',
      function () {
        this.hasMoved = true
        this.moveAlongPath(path, andAct)
      },
      this
    )
    this.moveTo.moveTo(path.shift())
    if ([1, 2].includes(this.moveTo.destinationDirection)) {
      this.sprite.setFlipX(true)
    }
    if ([0, 3].includes(this.moveTo.destinationDirection)) {
      this.sprite.setFlipX(false)
    }
    return this
  }

  resetMoveFlag() {
    this.hasMoved = false
    return this
  }

  resetActedFlag() {
    this.hasActed = false
    return this
  }

  //   takeDamage(damage) {
  //     this.health = this.health - damage
  //     this.text.setText(this.health)

  //     if (this.health <= 0) {
  //       this.killMe()
  //       return 'die'
  //     }
  //   }

  killMe() {
    killChessAt(this.rexChess)
  }

  select() {
    if (this.hasActed) {
      return
    }
    this.selector.setAlpha(1)
    EventBus.emit('selectUnit', this)
    EventBus.emit('clearUI', this)
    // this.setFillStyle(0x2541b2, 1)
    if (!this.hasMoved && !this.hasActed) {
      this.showMoveableArea()
    }
    if (!this.hasActed) {
      this.showPossibleActions()
    }
    return this
  }
}
