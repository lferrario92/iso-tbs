import { EventBus } from '../EventBus'
import { useGameStore } from '../stores/gameStore'
import { BuildingFriend } from './BuildingFriend'
import { OverworldActionMarker } from './Markers'
import { OverworldChess } from './OverworldChess'

export class OverworldFriend extends OverworldChess {
  constructor(board, scene, x, y, animation, units, key, tileXY) {
    super(board, scene, x, y, animation, key, tileXY)

    const store = useGameStore()
    this.units = units

    this.UI = new Phaser.GameObjects.Container(scene, 0, 0)

    this.moveButton = scene.add.sprite(15, -4, 'over_move_button')
    this.moveButton.setInteractive()
    this.actionButton = scene.add.sprite(-15, -4, 'over_attack_button')
    this.actionButton.setInteractive()
    this.moveButton.setInteractive()
    this.closeUIButton = scene.add.sprite(0, -19, 'over_wait_button')
    this.closeUIButton.setInteractive()
    this.buildUIButton = scene.add.sprite(0, 11, 'over_build_button')
    this.buildUIButton.setInteractive()
    this.UI.add([this.moveButton, this.actionButton, this.closeUIButton, this.buildUIButton])

    this.add(this.UI)
    this.UI.setVisible(false)
    this.UI.setDepth(999)
    this.on(
      'board.pointerdown',
      function () {
        this.select()
      },
      this
    )
    this.moveButton.on(
      'pointerdown',
      function () {
        if (!this.hasMoved && !this.hasActed) {
          store.removeUnitUI(this)
          this.showMoveableArea()
        }
      },
      this
    )
    this.actionButton.on(
      'pointerdown',
      function () {
        if (!this.hasActed) {
          store.removeUnitUI(this)
          this.showPossibleActions()
        }
      },
      this
    )
    this.closeUIButton.on(
      'pointerdown',
      function () {
        store.removeUnitUI(this)
        this.hasActed = true
      },
      this
    )

    this.buildUIButton.on(
      'pointerdown',
      function () {
        store.removeUnitUI(this)
        this.build()
      },
      this
    )
  }

  afterMove() {
    this.hasMoved = true
    this.moveButton.setVisible(false)
    this.UI.setVisible(true)
  }

  build() {
    let building = new BuildingFriend(
      this.rexChess.board,
      this.scene,
      0,
      0,
      'castle',
      () => {
        building.testCallback()
      },
      0,
      this.rexChess.tileXYZ
    )

    this.destroy()
  }

  resetMoveFlag() {
    this.moveButton.setVisible(true)
    this.hasMoved = false
    return this
  }

  showPossibleActions() {
    this.hidePossibleActions()
    if (this.hasActed) {
      return
    }

    // var tileXYArray = this.rexChess.board.getNeighborTileXY(this.rexChess.tileXYZ, null)
    var tileXYArray = this.rexChess.board.getNeighborChess(this.rexChess.tileXYZ).forEach((x) => {
      if (x instanceof OverworldFriend) {
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

  select() {
    this.selector.setAlpha(1)
    EventBus.emit('selectUnit', this)
    EventBus.emit('clearUI', this)
    if (this.hasActed) {
      return
    }
    this.UI.setAlpha(0)
    this.UI.setScale(0.5)

    this.UI.setVisible(true)
    this.scene.add.tween({
      targets: this.UI,
      duration: 100,
      scale: 1,
      alpha: 1,
      repeat: 0
    })
    // if (!this.hasMoved && !this.hasActed) {
    //   this.showMoveableArea()
    // }
    // if (!this.hasActed) {
    //   this.showPossibleActions()
    // }
    return this
  }
}
