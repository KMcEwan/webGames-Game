var config = 
{
    type: Phaser.AUTO,       
    scale:
    {   parent: 'game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },

    physics:
    {
        default: 'arcade',
        arcade:
        {
            gravity: { y: 0 }
        }
    },
    scene: 
    {
        preload,
        create,
        update,
    }
   
};

var game = new Phaser.Game(config);


let player1;
let player2;
let inputKey;
let wKey, aKey, sKey, dKey;


function preload ()                                              // loads all assets
{
    
    this.load.image('player1', 'assets/pinkPlayer.png');
    this.load.image('player2', 'assets/bluePlayer.png');
    this.load.image('background', 'assets/background.png');
}

function create ()
{
   this.add.image(400, 300, 'background');                                                                  // Load background into scene, 
   inputKey = this.input.keyboard.createCursorKeys();          // create keyboard controls
   player1 = this.physics.add.sprite(200,500, 'player1')
   player2 = this.physics.add.sprite(600,500, 'player2')
   //initPlayer2Controls();

//    let playerOne = new Phaser.Class
//    (
//     {
//         initialize:

//         function playerOne(scene, x, y)
//         { 
//             this.setTexture('player1');
//             this.setPosition(x * 16, y * 16);
//             this.setOrigin(0);
//         }
//     }
//    )
}

function update()
{
    checkMovement();    
}

function checkMovement()
{
    checkPlayer1Movement();
   // checkPlayer2Movement();
}

// function initPlayer2Controls()
// {   
//     aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    
//     dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
// }

function checkPlayer1Movement()
{
    player1.setVelocityY(0);

    if(inputKey.left.isDown)
    {
        player1.setVelocityX(-300);
    }
    else if(inputKey.right.isDown)
    {
        player1.body.setVelocityX(300);
    }
    else
    {
        player1.body.setVelocityX(0);
    }
}

// function checkPlayer2Movement()
// {
//     player2.setVelocityY(0);

//     if(inputKey.aKey.isDown)
//     {
//         player2.setVelocityX(-300);
//     }
//     else if(inputKey.dKey.isDown)
//     {
//         player2.body.setVelocityX(300);
//     }
//     else
//     {
//         player2.body.setVelocityX(0);
//     }
// }
