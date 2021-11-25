class loader extends Phaser.Scene
{
    constructor()
    {
        super({key : "loaderKey"});
    }

    preload()
    {
      //  this.load.image('player1', '../assets/pinkPlayer.png');
        //this.load.image('player2', '../assets/bluePlayer.png');
        this.load.image('background', '../assets/environment/background.png');
        this.load.image('laser', '../assets/playerAssets/laser.png');
        this.load.image('laser2', '../assets/playerAssets/laser2.png');
        this.load.image('building1', '../assets/building/building1.png');
        this.load.image('building2', '../assets/building/building2.png');
        this.load.image('building3', '../assets/building/building3.png');
        this.load.image('building4', '../assets/building/building4.png');
        this.load.image('building5', '../assets/building/building5.png');
        this.load.image('ground', '../assets/environment/ground2.png');
        this.load.image('heartFull', '../assets/UI/fullHeart.png');
        this.load.image('heartEmpty', '../assets/UI/emptyHeart.png');


        /* SPRITE SHEETS OF SCENE PLAYERS*/
        this.load.spritesheet('enemy', '../assets/enemy/enemySheet.png', { frameWidth: 20, frameHeight: 20 });
        this.load.spritesheet('player1', '../assets/playerAssets/pinkPlayerSheet.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('player2', '../assets/playerAssets/bluePlayerSheet.png', { frameWidth: 64, frameHeight: 64 });

        /* AUDIO - MUSIC */
        this.load.audio("titleMusic", '../assets/Audio/music/music1.mp3');


        /* BUTTONS */
        this.load.image('startButton', '../assets/UI/startButton.png');
        this.load.image('controlButton', '../assets/UI/controlButton.png');

        this.load.text('font', '../assets/fonts/AstroSpace.ttf');



    };

    create()
    {
        this.scene.start("mainMenuKey");        
    };

    update()
    {

    };



}