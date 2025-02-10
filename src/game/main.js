import { Boot } from './scenes/Boot'
import { Game } from './scenes/Game'
import { GameOver } from './scenes/GameOver'
import { MainMenu } from './scenes/MainMenu'
import Phaser from 'phaser'
import { Preloader } from './scenes/Preloader'
import { BattleCutscene } from './scenes/BattleCutscene'
import { UI } from './scenes/UI'
import { Overworld } from './scenes/Overworld'
import { Merchant } from './scenes/Merchant'
import { TiledEx } from './scenes/TestTiled'
import { PreBattle } from './scenes/PreBattle'
import { Snowing } from './scenes/Snowing'
import { OverworldUI } from './scenes/OverworldUI'
import { TechTree } from './scenes/TechTree'
import { Sunshine } from './scenes/Sunshine'

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  width: 740,
  height: 360,
  max: {
    width: 740,
    height: 360
  },
  parent: 'game-container',
  pixelArt: true,
  scene: [
    Boot,
    Preloader,
    MainMenu,
    BattleCutscene,
    Game,
    UI,
    Overworld,
    Merchant,
    GameOver,
    TiledEx,
    PreBattle,
    OverworldUI,
    Snowing,
    Sunshine,
    TechTree
  ]
}

const StartGame = (parent) => {
  return new Phaser.Game({ ...config, parent })
}

export default StartGame
