class gameOver extends Phaser.Scene
{
    constructor ()
    {
        super({key: "gameOverKey"});
    }

    preload()
    {

    };

    create()
    {
        this.backgroundSun = this.add.image(300,400, 'backgroundSun');
        this.add.image(300, 400, 'background');  
        console.log("controls script");

        const startButton = this.add.image(config.width / 2, config.height / 2 - 100, 'startButton');
        startButton.setInteractive();

        startButton.on('pointerdown', () => 
        {
            console.log('start button');
            this.scene.start("gameKey");
            this.game.sound.stopAll();
        });
        
    };

    update()
    {

    };
}