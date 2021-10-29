
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

        extend:
        {
            createPlayer: createPlayer,
            createBullet: createBullet
            //initPlayer2Controls: initPlayer2Controls
        }
    }
   
};

var game = new Phaser.Game(config);


let player1;
let player2;
let inputKey;
let aKey, dKey, spaceShoot, zeroShoot;


var bullets;
var ship;
var speed;
var stats;
var cursors;
var lastFired = 0;


function preload ()                                                                                         // loads all assets
{
    
    this.load.image('player1', 'assets/pinkPlayer.png');
    this.load.image('player2', 'assets/bluePlayer.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('laser', 'assets/laser.png');
}

function create ()
{
   this.add.image(400, 300, 'background');                                                                  // Load background into scene, 
   inputKey = this.input.keyboard.createCursorKeys();                                                       // create keyboard controls
   //initPlayer2Controls();
   aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    
   dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

   spaceShoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);    
   zeroShoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
   
   player1 = this.createPlayer(200, 500, 'player1');
   player2 = this.createPlayer(600, 500, 'player2');


   var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'laser');

        this.speed = Phaser.Math.GetSpeed(400, 1);
    },

    fire: function (x, y)
    {
        this.setPosition(x, y - 50);

        this.setActive(true);
        this.setVisible(true);
    },

    update: function (time, delta)
    {
        this.y -= this.speed * delta;

        if (this.y < -50)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

bullets = this.add.group({
    classType: Bullet,
    maxSize: 10,
    runChildUpdate: true
});
}  



function update()
{
    checkMovement();    
}

function checkMovement()
{
    checkPlayer1Movement();
    checkPlayer2Movement();
}

// function initPlayer2Controls()
// {   
//   aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    
//   dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
// }

function checkPlayer1Movement()
{
    player1.setVelocityY(0);

    if(aKey.isDown)
    {
        player1.setVelocityX(-300);
    }
    else if(dKey.isDown)
    {
        player1.body.setVelocityX(300);   
    }
    else if(spaceShoot.isDown)
    {
        //fire bullet 
    }
    else
    {
        player1.body.setVelocityX(0);
    }
}

function checkPlayer2Movement()
{
   player2.setVelocityY(0);

    if(inputKey.left.isDown)
    {
        player2.setVelocityX(-300);
    }
    else if(inputKey.right.isDown)
    {      
        player2.body.setVelocityX(300);
    }
    else if(zeroShoot.isDown)
    {        
        var bullet = bullets.get()

        if (bullet)
        {
            bullet.fire(player1.x, player1.y);          
        }
    }
    else
    {
        player2.body.setVelocityX(0);
    }

}


 function createPlayer(x, y, key)
 {
    const player = this.physics.add.sprite(x, y, key);
    return player;
 }

 function createBullet(key, path, player)
 {
    bullet = this.load.image(key, path);
    setPosition(player.x, player.y);
    setActive(true);
    setVisible(true);
 }

 function fire()
 {

 }
 
