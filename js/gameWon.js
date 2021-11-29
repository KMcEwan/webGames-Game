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
        this.playerOneScore = this.add.text (config.width / 2, config.height / 2 + 200, 'score : 0', { fontFamily: 'CustomFont', fill: '#df03fc'});
        this.playerTwoScore = this.add.text (config.width / 2, config.height / 2 + 300, 'score : 0', {fontFamily: 'CustomFont', fill: '#0000FF'});

        this.playerOneScore.setText('score : ' + player1.score);
        this.playerTwoScore.setText('score : ' + player2.score);

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