class mainMenu extends Phaser.Scene
{
    constructor ()
    {
        super({key: "mainMenuKey"});
    }

    preload()
    {

    };

    create()
    {
        /*ADD BACKGROUND IMAGE */
        this.backgroundSun = this.add.image(300,400, 'backgroundSun');
        this.add.image(300, 400, 'background');  

        /* START BUTTON CREATION */
        const startButton = this.add.image(config.width / 2, config.height / 2 - 100, 'startButton');
        startButton.setInteractive();

        /* CONTROL BUTTON CREATION */
        const controlButton = this.add.image(config.width / 2, config.height / 2 + 100, 'controlButton');
        controlButton.setInteractive();

        /* TITLE MUSIC CREATION */
        const TitleMusic = this.sound.add("titleMusic");
        TitleMusic.play();


        /* ON START BUTTON CLICK */
        startButton.on('pointerdown', () => 
        {
            console.log('start button');
            this.scene.start("gameKey");
            TitleMusic.stop();
        });

        /* ON CONTROL BUTTON CLICK */
        controlButton.on('pointerdown', () =>
        {
           console.log('controls button');
           this.scene.start("controlsKey");
        });
    
        
    };

    update()
    {

    };
}