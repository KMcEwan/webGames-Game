
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
            debug: true,
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
            createEnemyBullets: createEnemyBullets,
            //createBullet: createBullet
            //initPlayer2Controls: initPlayer2Controls
        }
    }
   
};

var game = new Phaser.Game(config);


let player1;
let player2;
let inputKey;
let aKey, dKey, spaceShoot, zeroShoot;
let testKey;

// Player bullets
var bullets;
var ship;
var speed;
var stats;
var cursors;
var lastFired = 0;



// Enemy bullets
let enemyBullets;
let enemyBulletCount = 0;
let enemy;

function preload ()                                                                                         // loads all assets
{
    
    this.load.image('player1', 'assets/pinkPlayer.png');
    this.load.image('player2', 'assets/bluePlayer.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('laser', 'assets/laser.png');
    this.load.image('enemyBullets', 'assets/enemy.png');
}

function create ()
{
   this.add.image(400, 300, 'background');                                                                  // Load background into scene, 
   inputKey = this.input.keyboard.createCursorKeys();                                                       // create keyboard controls
   initPlayer2Controls.call(this);


   spaceShoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);    
   zeroShoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
   testKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
   
   player1 = this.createPlayer(200, 500, 'player1');
   player2 = this.createPlayer(600, 500, 'player2');

   
   enemy = this.createEnemyBullets(game, 'enemyBullets');
   
   enemy.setVelocityY(10);


   console.log("player health" + player1.health);
   this.physics.add.collider(player1, enemy);
//    this.physics.add.collider(bullets, enemy);

    // enemyBullets = [];
    // for(let i = 0; i < 10; i++)
    // {
    //     enemyBullets[i] = enemyBullets.push(this.createEnemyBullets(game, 'enemyBullets'));
    // }

    //enemyBullets = this.createEnemyBullets(game, 'enemyBullets');                                             // Spawn first enemy bullet

    //enemy = this.createEnemyBullets(game, 'enemyBullets');

    

    // BULLET 
   var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'laser');

        this.speed = Phaser.Math.GetSpeed(400, 1);              // speed of lasers
    },

    fire: function (x, y)   
    {
        this.setPosition(x, y - 10);                            // give bullet position, x and y are set to player pos within controls

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
    },
    });

    bullets = this.physics.add.group({
    classType: Bullet,
    maxSize: 10,
    runChildUpdate: true
    })
   

this.physics.add.collider(bullets, enemy, testFunc());



}  
// END OF BULLET

function testFunc()
{
    console.log("collision");
    enemy.destroy();
}


function update()
{
    checkMovement();  
//     if (enemyBulletCount < 20)  
//     {
//         //enemyBullets = [];
//         enemyBullets = this.createEnemyBullets(game, 'enemyBullets');
//         enemyBulletCount++;
//         enemyBullets.setVelocityY(Phaser.Math.Between(60, 150));
//     }
   

//    // console.log("position" + enemyBullets.y);
//     for(let i = 0; i < enemyBullets.maxSize; i++)
//     {
//         if(enemyBullets.y > game.config.height)
//     {
//         enemyBullets.destroy();
//         enemyBulletCount--;
//         console.log("count" + enemyBulletCount);
//     }
//     }
    
}

function checkMovement()
{
    checkPlayer1Movement();
    checkPlayer2Movement();
}

function initPlayer2Controls()
{   
  aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    
  dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}

function checkPlayer1Movement()
{
    //test
    if(testKey.isDown)
    {
        player1.health -= 10;
        console.log(player1.health);
    }
    // End of testing

    player1.setVelocityY(0);

    if(aKey.isDown&& player1.x >= 15)
    {
        player1.setVelocityX(-300);
    }
    else if(dKey.isDown&& player1.x <= 785)
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

    if(inputKey.left.isDown && player2.x >= 15)
    {
        console.log(player2.x);
        player2.setVelocityX(-300);
    }
    else if(inputKey.right.isDown && player2.x <= 785)
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
    let player = this.physics.add.sprite(x, y, key);
    player.health = 100;  
    return player;
 }

createPlayer.prototype.playerDamage = function()        // prototype causes inheritance from createPlayer
{
    this.health -= 10;
}

//  function createBullet(key, player)
//  {
//     bullet = this.load.image(key);
//     setPosition(player.x, player.y);
//     setActive(true);
//     setVisible(true);
//  }

 function fire()
 {

 }
 
function createEnemyBullets(game, key)
{
    let x = Phaser.Math.Between(0, game.config.width);
    let y = 0.5;

    let enemyBullet = this.physics.add.sprite(x,y,key);
    this.alive = true;
    return enemyBullet;
}
