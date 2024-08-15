import { EventBus } from '../EventBus.js'
import { killChessAt } from '../helpers.js'
import { MoveableMarker, ActionMarker } from './Markers.js'

export class Chess extends Phaser.GameObjects.Sprite {
  constructor(board, scene, x, y, key, tileXY) {
    super(scene, x, y, key)
    this.health = 100
    this.damage = 10

    this.scale = 2
    if (tileXY === undefined) {
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
        return preLevel >= curLevel ? 1 : 3
      },
      cacheCost: false
    })

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
      if (x instanceof Chess) {
        return
      }
      this._actionMarkers.push(new ActionMarker(this, x.rexChess.tileXYZ))
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
    var tileXYArray = this.pathFinder.findArea(3)
    for (var i = 0, cnt = tileXYArray.length; i < cnt; i++) {
      this._markers.push(new MoveableMarker(this, tileXYArray[i]))
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
    this.play('soldierIdle')

    if (!endTile) {
      debugger
    }
    var tileXYArray = this.pathFinder.getPath(endTile.rexChess.tileXYZ)
    this.moveAlongPath(tileXYArray)
    return true
  }

  moveAlongPath(path, andAct) {
    this.hidePossibleActions()
    this.play('walk')

    if (path.length === 0) {
      //   this.setFillStyle(0x404040)
      this.showMoveableArea()
      this.play('soldierIdle')
      EventBus.emit('clearUI', this)

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
    return this
  }

  resetMoveFlag() {
    this.hasMoved = false
    return this
  }

  resetActedFlag() {
    this.hasActed = false
    // this.setFillStyle(0xff5c8d, 1)
    return this
  }

  takeDamage(damage) {
    this.health = this.health - damage

    if(this.health <= 0) {
        this.killMe()
        return 'die'
    }
  }

  killMe() {
    killChessAt(this.rexChess)
  }

  select() {
    if (this.hasActed) {
      return
    }
    EventBus.emit('selectUnit', this)
    EventBus.emit('clearUI', this)
    // this.setFillStyle(0x2541b2, 1)
    if (!this.hasMoved) {
      this.showMoveableArea()
    }
    if (!this.hasActed) {
      this.showPossibleActions()
    }
    return this
  }
}
