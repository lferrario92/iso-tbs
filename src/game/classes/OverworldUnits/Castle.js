import { EventBus } from '../../EventBus'
import { BuildingFriend } from './BuildingFriend'
import { OverworldActionMarker } from '../Markers'
import units from '../../data/units.json'
import { useGameStore } from '../../stores/gameStore'

export class Castle extends BuildingFriend {
  constructor(board, scene, x, y, sprite, callback, frame, tileXY, name) {
    super(board, scene, x, y, sprite, callback, frame, tileXY, name)

    this.menuButtons = [...units]
    this.board = board
    this._actionMarkers = []
    this._foodTexts = []
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

  showPossibleActions(unitType) {
    this.hidePossibleActions()

    var tileXYArray = this.rexChess.board
      .getEmptyTileXYArrayInRange(this.rexChess.tileXYZ, 1, 1)
      .forEach((tileXY) => {
        this._actionMarkers.push(
          new OverworldActionMarker(
            this,
            tileXY,
            this.scene.midGroup,
            'overworldIndicators',
            2,
            1,
            () => {
              const store = useGameStore()
              EventBus.emit(`create${unitType}At`, {
                key: 0,
                position: tileXY
              })
              store.removeMoney(
                units.find((unit) => unit.type === unitType).requirements.money || 0
              )
              EventBus.emit('updateResourcesUI')
              this.hidePossibleActions()
            }
          )
        )
      })
    return tileXYArray
  }

  calculateFood() {
    const isWinter = this.board.season === 'winter';
    let totalFood = 0;
    
    const tiles = this.board.tileXYArrayToChessArray(this.getBorderTiles(), 0);
    tiles.forEach((tile) => {
      // Calculate food based on tile's food value and season
      totalFood += isWinter ? Math.max(0, tile.food - 1) : tile.food;
    });

    return totalFood;
  }

  showFoodText() {
    this.hideFoodText();
    this._foodTexts = [];
    
    const isWinter = this.board.season === 'winter';
    const tiles = this.board.tileXYArrayToChessArray(this.getBorderTiles(), 0);

    tiles.forEach((tile) => {
      const effectiveFood = isWinter ? Math.max(0, tile.food - 1) : tile.food;
      
      if (effectiveFood > 0) {
        const foodText = this.scene.add
          .text(tile.x, tile.y - 2, effectiveFood, {
            fontFamily: 'PublicPixel',
            fontSize: '12px',
            align: 'left',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
          })
          .setOrigin(0, 0)
          .setScale(0.2)
          .setShadow(1, 1, '#000000', 2);
        
        this._foodTexts.push(foodText);
      }
    });
  }

  hideFoodText() {
    if (this._foodTexts) {
      this._foodTexts.forEach(text => text.destroy());
      this._foodTexts = [];
    }
  }

  select() {
    this.showFoodText();
    return this;
  }

  deselect() {
    this.hideFoodText();
  }

  createArmy() {
    this.showPossibleActions('Army')
  }
  createSettler() {
    this.showPossibleActions('Settler')
  }
  createFarmer() {
    this.showPossibleActions('Farmer')
  }
}
