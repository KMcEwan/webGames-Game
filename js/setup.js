
var config = 
{
    type: Phaser.AUTO,       
    scale:
    {   parent: 'game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 1080
    },

    scene: [loader, mainMenu],

    physics:
    {
        default: 'arcade',
        arcade:
        {
            debug: true,
            gravity: { y: 0 }
        }
    },
    
    
   
};

console.log("Set up");
var game = new Phaser.Game(config);