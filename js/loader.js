class loader extends Phaser.Scene
{
    constructor()
    {
        super({key : "loaderKey"});
    }

    preload()
    {
      //  this.load.image('player1', '../assets/pinkPlayer.png');
        this.load.image('player2', '../assets/bluePlayer.png');
        this.load.image('background', '../assets/background.png');
        this.load.image('laser', '../assets/laser.png');
        this.load.image('laser2', '../assets/laser2.png');
        this.load.image('building1', '../assets/building1.png');
        this.load.image('building2', '../assets/building2.png');
        this.load.image('building3', '../assets/building3.png');
        this.load.image('building4', '../assets/building4.png');
        this.load.image('building5', '../assets/building5.png');
        this.load.image('ground', '../assets/ground2.png');


        /* SPRITE SHEETS OF SCENE PLAYERS*/
        this.load.spritesheet('enemy', '../assets/enemySheet.png', { frameWidth: 20, frameHeight: 20 });
        this.load.spritesheet('player1', '../assets/pinkPlayerSheet.png', { frameWidth: 50, frameHeight: 50 });

        /* AUDIO - MUSIC */
        this.load.audio("titleMusic", '../assets/Audio/music/music1.mp3');


        /* BUTTONS */
        this.load.image('startButton', '../assets/images/buttons/startButton.png');
        this.load.image('controlButton', '../assets/images/buttons/controlButton.png');
    };

    create()
    {
        this.scene.start("mainMenuKey");        
    };

    update()
    {

    };



}