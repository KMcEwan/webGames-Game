class loader extends Phaser.Scene
{
    constructor()
    {
        super({key : "loaderKey"});
    }

    preload()
    {
       this.load.image('player1', '../assets/pinkPlayer.png');
        this.load.image('player2', '../assets/bluePlayer.png');
        this.load.image('background', '../assets/background.png');
        this.load.image('laser', '../assets/laser.png');
        this.load.image('enemyBullets', '../assets/enemy.png');


        this.load.audio("titleMusic", '../assets/Audio/music/music1.mp3');
    };

    create()
    {
        this.scene.start("mainMenuKey");
        
    };

    update()
    {

    };



}