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
        this.add.image(400, 300, 'background');  

        /* START BUTTON CREATION */
        const startButton = this.add.image(100, 100, 'player1');
        startButton.setInteractive();

        /* CONTROL BUTTON CREATION */
        const controlButton = this.add.image(200, 200, 'player1');
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