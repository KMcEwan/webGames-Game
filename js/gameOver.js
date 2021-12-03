class gameOver extends Phaser.Scene
{
    constructor (player1, player2)
    {
        super({key: "gameOverKey", player1, player2});
    }

    preload()
    {

    };

    create()
    {
        this.backgroundSun = this.add.image(300,400, 'backgroundSun');
        this.add.image(300, 400, 'background');  
        console.log("controls script");

        this.gameOver = this.add.text (config.width / 2 - 170, config.height / 2 - 300, 'GAME OVER', { font: '56px CustomFont', fill: '#e357ff' });

        this.playerOneScore = this.add.text (config.width / 2 - 200, config.height / 2 + 50, 'P1 score : 0', { font: '48px CustomFont', fill: '#e357ff' });
        this.playerTwoScore = this.add.text (config.width / 2 - 200, config.height / 2 + 130, 'P2 score : 0', {font: '48px CustomFont', fill: '#0377fc'});

        this.playerOneScore.setText('P1 score : ' + player1.score);
        this.playerTwoScore.setText('P2 score : ' + player2.score);

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