import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { BattleCutscene } from './scenes/BattleCutscene';
import { UI } from './scenes/UI';
import { Overworld } from './scenes/Overworld';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    // width: 1024,
    // height: 768,
    width: '100%',
    height: '100%',
    max: {
        width: 1600,
        height: 1200
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
        GameOver
    ]
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });
}

export default StartGame;
