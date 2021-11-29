class gameWon extends Phaser.Scene
{
    constructor (player1, player2)
    {
        super({ key: "gameWonKey",  player1, player2});
    }

    preload()
    {

    };

    create()
    {
        this.backgroundSun = this.add.image(300,400, 'backgroundSun');
        this.add.image(300, 400, 'background');  
        this.playerOneScore = this.add.text (config.width / 2 - 200, config.height / 2 + 50, 'P1 score : 0', { font: '48px CustomFont', fill: '#0000FF' });
        this.playerTwoScore = this.add.text (config.width / 2 - 200, config.height / 2 + 130, 'P2 score : 0', {font: '48px CustomFont', fill: '#df03fc'});

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