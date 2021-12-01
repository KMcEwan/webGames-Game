
var config = 
{
    type: Phaser.AUTO,      
    width: 600,
    height: 800, 
    scale:
    {   parent: 'game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // width: 600,
        // height: 800
    },

    scene: [loader, mainMenu, controls, mainGame, gameOver, gameWon],

    physics:
    {
        default: 'arcade',
        arcade:
        {
            debug: true,
            gravity: { y: 0 }
        }
    },
    
    
   
},
player1,
player2,
building1,
building2,
building3,
building4,
building5,
building6,
ground,
topGround,
game = new Phaser.Game(config);