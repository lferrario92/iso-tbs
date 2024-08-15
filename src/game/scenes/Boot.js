import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        this.load.image('summer5', 'assets/backgrounds/summer5/Summer5.png');
        this.load.image('clouds4', 'assets/Clouds/Clouds 4/1.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
