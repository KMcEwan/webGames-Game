class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, key)
    {
       super(scene, x, y, key);                                                     // Super calls parent class which is Phaser.Physics.Arcade.Sprite
       //this.scene.physics.world.enable(this);
       this.anims.create
       ({
        key: 'flash',
        frames: [
            { key: 'enemy',frame:0 },
            { key: 'enemy',frame:1 },
            { key: 'enemy',frame:2 },
        ],
        frameRate: 2,
        repeat: -1
    });
    }
}

class cannonLaser extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, xPos, yPos, key, playerKey)
    {
        super(scene, xPos, yPos, key);
        this.body = this.scene.physics.add.sprite(xPos, yPos, key)
        this.scene.physics.world.enable(this);
        this.body.setVelocityY(-500);        
       // console.log(playerKey);
        
        this.player = playerKey;
        //this.scene.physics.add.collider(this.body, this.scene.enemies, function (body, enemy) {this.bulletHitEnemy(enemy, playerKey)}, null, this);

        this.scene.physics.add.collider(this.body, this.scene.enemies, this.bulletHitEnemy, null, this);


        //this.scene.physics.add.overlap(building1, this.scene.enemies, this.bulletHitEnemy, null, this);       // bring back in when buildings added back in


        this.scene.physics.add.overlap(this.body, topGround, this.laserOutOfScreen, null, this);
    }


    bulletHitEnemy(laser, enemy)
    {     
        laser.destroy(true);
        enemy.destroy(true);       
        this.scene.enemyCount--;
        this.player.score += 10;
    }


    laserOutOfScreen(laser, topGround)
    {
        laser.destroy(true);
    }

    preUpdate() 
    {
        this.y -= this.body;
    }
}

class mainGame extends Phaser.Scene
{

    constructor ()
    {
        super({key: "gameKey"});
        /* KEY INPUTS */
        let aKey;
        let dKey;
        let fireSpcace;
        let inputKey;
        let specialAttack;
        let healSelf;
        let healBoth;

        var laser;
        let maxScore; 
        
        /*ENEMY */
        let enemy;
        let enemies;
        let enemyCount;
        let enemiesInScene;

        /* ENEMY SPAWN */
        let firstWave;
        let secondWave;
        let thirdWave;
        let ForthWave;

        /* PLAYER */
        let lastFired;
        let shotFreq;
       

        this.lasers = new Array();
        
    }


    create()
    {
        
       
        this.inputKey = this.input.keyboard.createCursorKeys(); 
        this.add.image(400, 300, 'background');  
        player1 = this.createPlayer(200, 500, 'player1', player1);
        player2 = this.createPlayer(600, 500, 'player2', player2);
        //console.log("player score", player1.score);

        // building1 = this.createBuilding(75, 700, 'building1', building1);
        // building2 = this.createBuilding(225, 700, 'building2', building2);
        // building3 = this.createBuilding(375, 700, 'building3', building3);
        // building4 = this.createBuilding(525, 700, 'building4', building4);

        ground = this.createGround(300, 796, 'ground', ground);
        topGround = this.createGround(300, 1, 'ground', topGround);
        //top = this.createGround(300, 796, 'ground', top);

        this.enemyCount = 0;
        this.enemiesInScene = 0;
        this.firstWave = 10;
        this.secondWave = 20;
        this.thirdWave = 30;
        this.ForthWave = 40;
        this.enemies = this.physics.add.group();
        this.enemies2 = new Array();
        this.physics.add.overlap(ground, this.enemies, this.enemyOutOfScreen, null, this);
        this.physics.add.overlap(player2, this.enemies,  this.enemyHitPlayer, null, this);
        this.physics.add.overlap(player1, this.enemies,  this.enemyHitPlayer, null, this);

        this.lastFired = new Date().getTime();
        this.shotFreq = 300;
    };



    enemyHitPlayer(player, enemy) 
    {      
       //console.log("enemy hit");
       player.health -= 10;
       enemy.destroy(true);      
       this.scene.enemyCount--;  
     // console.log("PLAYER HEALTH : " + player.health);
      // console.log("player score :" + player.score);
    }


    /* UPDATE FUNCTION START */
    update()
    { 
        if(this.aKey.isDown || this.dKey.isDown || this.inputKey.left.isDown || this.inputKey.right.isDown)
        {
            this.movePlayers();
        }
        else
        {
            player1.setVelocityX(0);
            player2.setVelocityX(0);
            player1.play('playerStationary');
        }
        if(this.fireSpcace.isDown)
        {          
            var currentTime = new Date().getTime();
            if (currentTime - this.lastFired > this.shotFreq) {
                var canLaser = new cannonLaser(this, player1.x, player1.y, 'laser', player1);
                this.lastFired = currentTime;
            }
        }
        if(this.inputKey.up.isDown)
        {
            var canLaser = new cannonLaser(this, player2.x, player2.y, 'laser2', player2);         
        }  

        if(this.specialAttack.isDown || this.healBoth.isDown || this.healSelf.isDown)
        {
            this.specials();
            console.log("player 1 score ", player1.score);
            console.log("player 2 score ", player2.score);
        }
        
        

        this.checkPlayersScore();
        
    }/* UPDATE FUNCTION END */


    enemyOutOfScreen(ground, enemy)
    {
        enemy.destroy(true);
        this.enemyCount--;
    }



    checkPlayersScore()
    {
            
        if (player1.score > player2.score)
        {
            this.maxScore = player1.score;
        }
        else
        {
            this.maxScore = player2.score;
        }

        if(this.maxScore < 300)
        {
            //console.log("ENEMIES ALIVE : "+ this.enemyCount);
            this.enemiesInScene = this.firstWave - this.enemyCount;         
           // console.log("ENEMIES IN SCENE :" + this.enemiesInScene);            

            for (let k = 0; k < this.enemiesInScene; k++) 
            {
                //console.log("ENEMIES ALIVE : "+ this.enemyCount);
                let x = Phaser.Math.Between(590, 10);   
                let vel = Phaser.Math.Between(300, 10);   
               // console.log("velocity : ", vel);    
                this.enemy = new Enemy(this, x, 0, 'enemy');
                this.enemy.play('flash');
                this.add.existing(this.enemy);
                this.enemies.add(this.enemy);
                //this.enemies.setVelocityY(vel);
                this.enemy.setVelocityY(vel);
                this.enemies2.push(this.enemy);
                this.enemyCount++;
               // console.log("ENEMIES TO BE SPAWNED : " + this.enemiesInScene);
               // console.log("COUNT OF ENEMIES : " + this.enemyCount);
            }
        }
        else
        if(this.maxScore < 600)
        {
            console.log("Second set of enemies");
        }
        else
        if(this.maxScore < 900)
        {
            console.log("Second set of enemies");
        }

    }

    specials()
    {
        if(Phaser.Input.Keyboard.JustDown(this.specialAttack))
        {
            console.log("special attack");
        }
        else 
        if(Phaser.Input.Keyboard.JustDown(this.healSelf))
        {
            console.log("Heal self");
        }
        else
        if(Phaser.Input.Keyboard.JustDown(this.healBoth))
        {
            console.log("Heal both");
        }
    }

    movePlayers()
    {
        if(this.aKey.isDown || this.dKey.isDown || this.inputKey.left.isDown || this.inputKey.right.isDown)
        {
            this.movePlayer1();
            this.movePlayer2();
            this.score += 10;        
        }       
    }

    movePlayer1()
    {
        if(this.aKey.isDown)
        {
            player1.setVelocityX(-100);
            player1.play('playerMoveLeft');
        }
        else
        if(this.dKey.isDown)
        {
            player1.setVelocityX(100);
            player1.play('playerMoveRight');
        }
    }

    movePlayer2()
    {
        if(this.inputKey.left.isDown)
        {
            player2.setVelocityX(-100);
        }
        else
        if(this.inputKey.right.isDown)
        {
            player2.setVelocityX(100);
        }
    }

     createPlayer(xPos, yPos, key, player)
    {
        player = this.physics.add.sprite(xPos, yPos, key);
        player.health = 100;
        player.lives = 3; 
        player.isAlive = true;
        player.score = 0; 
        player.setCollideWorldBounds(true); 


        this.anims.create
       ({
            key: 'playerMoveLeft',
            frames: 
            [
                { key: 'player1',frame:0 },
            ],
            frameRate: 24,
            repeat: 0
        });

        this.anims.create
            ({
            key: 'playerMoveRight',
            frames: 
            [
                { key: 'player1',frame:2 },
            ],
            frameRate: 24,
            repeat: 0
         });

        this.anims.create
        ({
            key: 'playerStationary',
            frames: 
            [
                { key: 'player1',frame:1 },
            ],
            frameRate: 24,
            repeat: 0
        }); 

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.fireSpcace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.fire0 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO);
        this.specialAttack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.healSelf = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.healBoth = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

        return player;
    }

    createBuilding(xPos, yPos, key, building)
    {
        building = this.physics.add.sprite(xPos, yPos, key);
        building.health = 100;
        building.isAlive = true;

        return building;
    }


    createGround(xPos, yPos, key, ground)
    {
        ground = this.physics.add.sprite(xPos, yPos, key);
       // this.scene.physics.add.overlap(ground, this.scene.enemies, this.enemyOutOfScreen, null, this);
        return ground;
    }
}


