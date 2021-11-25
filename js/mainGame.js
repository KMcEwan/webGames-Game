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


        /* PLAYER */
        let lastFired;
        let shotFreq;
       

        this.lasers = new Array();
        
    }


    create()
    {

        this.scoreForHealSelf = 200;
        this.scoreForHealBoth = 300;
        this.specialAbility = 300;
        
        this.playerVelocity = 200;
        
       
        this.inputKey = this.input.keyboard.createCursorKeys(); 
        this.add.image(400, 300, 'background');  
        player1 = this.createPlayer(200, 500, 'player1', player1);
        player2 = this.createPlayer(600, 500, 'player2', player2);
        player1.setSize(50, 40, true);
        player2.setSize(50, 40, true);
       
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


        this.player1Image = this.add.image(135,40, 'player1');
        this.player1Image.setScale(0.75)

        this.player1Image = this.add.image(425,40, 'player2');
        this.player1Image.setScale(0.75)
     
        
        this.playerOneScore = this.add.text (5,55, 'score : 0', { fontFamily: 'CustomFont', fill: '#df03fc'});
        this.playerTwoScore = this.add.text (460, 55, 'score : 0', {fontFamily: 'CustomFont', fill: '#0000FF'});


        this.graphicsPlayerOneHealth = this.add.graphics();
        this.graphicsPlayerTwoHealth = this.add.graphics();

        this.setHealthbarPlayerOne();
        this.setHealthbarPlayerTwo();

        this.player1Hearts = this.add.group({classType : Phaser.GameObjects.Image});
        this.player1Hearts.createMultiple
        ({
            key: 'heartFull',
            setXY: {
                x: 25,
                y: 20,
                stepX: 30
            },
            quantity: 3
        });

        this.player2Hearts = this.add.group({classType : Phaser.GameObjects.Image});
        this.player2Hearts.createMultiple
        ({
            key: 'heartFull',
            setXY: {
                x: 470,
                y: 20,
                stepX: 30
            },
            quantity: 3
        });



        this.lastFired = new Date().getTime();
        this.shotFreq = 300;
    };

    setHealthbarPlayerOne()
    {
        this.width = 100;
        this.percent = Phaser.Math.Clamp(player1.health, 0, 100) / 100;
        this.graphicsPlayerOneHealth.clear();
        this.graphicsPlayerOneHealth.fillStyle(0x808080);
        this.graphicsPlayerOneHealth.fillRoundedRect(5, 40, this.width, 10, 5);
        console.log("player lives : " , player1.lives);
 
        if(this.percent >= .1)
        {

            this.graphicsPlayerOneHealth.fillStyle(0x00ff00);
            this.graphicsPlayerOneHealth.fillRoundedRect(5,40, this.width * this.percent, 10, 5);  
        }
        else
        {
            player1.lives --;
            
            this.player1Hearts.children.each((go, idx) =>           
            {
                this.player1Heart = go;
                if(idx < player1.lives)
                {
                    this.player1Heart.setTexture('heartFull') ;
                }
                else
                {
                    this.player1Heart.setTexture('heartEmpty') ;
                }
                
            } )
          

            if(player1.lives > 0)
            {
                player1.health = 100;                
                this.percent = Phaser.Math.Clamp(player1.health, 0, 100) / 100;
                console.log("player lives : " , player1.lives);
                this.graphicsPlayerOneHealth.fillStyle(0x00ff00);
                this.graphicsPlayerOneHealth.fillRoundedRect(5,40, this.width * this.percent, 10, 5);  
            }
            else
            {
                this.scene.start("gameOverKey");
                this.game.sound.stopAll();
            }
        }
    }


    
    setHealthbarPlayerTwo()
    {
        this.width = 100;
        this.percent = Phaser.Math.Clamp(player2.health, 0, 100) / 100;
        this.graphicsPlayerTwoHealth.clear();
        this.graphicsPlayerTwoHealth.fillStyle(0x808080);
        this.graphicsPlayerTwoHealth.fillRoundedRect(455, 40, this.width, 10, 5);
        console.log("player lives : " , player2.lives);
 
        if(this.percent >= .1)
        {

            this.graphicsPlayerTwoHealth.fillStyle(0x00ff00);
            this.graphicsPlayerTwoHealth.fillRoundedRect(455,40, this.width * this.percent, 10, 5);  
        }
        else
        {
            player2.lives --;
            this.player2Hearts.children.each((go, idx) =>           
            {
                this.player2Heart = go;
                if(idx < player2.lives)
                {
                    this.player2Heart.setTexture('heartFull') ;
                }
                else
                {
                    this.player2Heart.setTexture('heartEmpty') ;
                }
                
            } )
     
            if(player2.lives > 0)
            {
                player2.health = 100;                
                this.percent = Phaser.Math.Clamp(player2.health, 0, 100) / 100;
                console.log("player lives : " , player2.lives);
                this.graphicsPlayerTwoHealth.fillStyle(0x00ff00);
                this.graphicsPlayerTwoHealth.fillRoundedRect(455,40, this.width * this.percent, 10, 5);  
            }
            else
            {
                this.scene.start("gameOverKey");
                this.game.sound.stopAll();
            }
        }
    }


    enemyHitPlayer(player, enemy) 
    {      

        player.health -= 10;
        this.enemyCount--;
        enemy.destroy(true);      
        if(player == player1)
        {
            this.setHealthbarPlayerOne();
        }   
        else
        if(player == player2)
        {
            this.setHealthbarPlayerTwo();
        }          
    }


    /* UPDATE FUNCTION START */
    update()
    { 

        this.playerOneScore.setText('score : ' + player1.score);
        this.playerTwoScore.setText('score : ' + player2.score);

        if(this.aKey.isDown || this.dKey.isDown || this.inputKey.left.isDown || this.inputKey.right.isDown)
        {
            this.movePlayers();
        }
        else
        {
            player1.setVelocityX(0);
            player2.setVelocityX(0);
            player1.play('player1Stationary');
            player2.play('player2Stationary');
        }
        if(this.fireSpcace.isDown && this.aKey.isDown)
        {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastFired > this.shotFreq) {
                var canLaser = new cannonLaser(this, player1.x, player1.y - 40, 'laser', player1);
                this.lastFired = currentTime;
               
            }
            player1.play('fireLeft1');
        }
        else if (this.fireSpcace.isDown && this.dKey.isDown)
        {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastFired > this.shotFreq) {
                var canLaser = new cannonLaser(this, player1.x, player1.y - 40, 'laser', player1);
                this.lastFired = currentTime;
               
            }
            player1.play('fireRight1');
        }
        else if (this.fireSpcace.isDown)
        {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastFired > this.shotFreq) {
                var canLaser = new cannonLaser(this, player1.x, player1.y - 40, 'laser', player1);
                this.lastFired = currentTime;
               
            }
            player1.play('fireStationary1');
        }

        if(this.inputKey.up.isDown)
        {
            var canLaser = new cannonLaser(this, player2.x, player2.y, 'laser2', player2);         
        }  

        if(this.specialAttack.isDown || this.healBoth.isDown || this.healSelf.isDown)
        {
            this.specialsPlayer1();
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

        if(this.maxScore > 0)
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

    specialsPlayer1()
    {
        if(Phaser.Input.Keyboard.JustDown(this.specialAttack))
        {
            console.log("special attack");
        }
        else 
        if(Phaser.Input.Keyboard.JustDown(this.healSelf))
        {
            if(player1.score >= this.scoreForHealSelf)
            {
                player1.health = 100;
                player1.score -= 200;
                this.setHealthbarPlayerOne();
                this.setHealthbarPlayerTwo();
            }     
        }
        else
        if(Phaser.Input.Keyboard.JustDown(this.healBoth))
        {
            if(player1.score >= this.scoreForHealBoth)
            {
                player1.health = 100;
                player2.health = 100;
                player1.score -= 300;
                this.setHealthbarPlayerOne();
                this.setHealthbarPlayerTwo();
            }
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
            player1.setVelocityX(-this.playerVelocity);
            player1.play('player1MoveLeft');
        }
        else
        if(this.dKey.isDown)
        {
            player1.setVelocityX(this.playerVelocity);
            player1.play('player1MoveRight');
        }
    }

    movePlayer2()
    {
        if(this.inputKey.left.isDown)
        {
            player2.setVelocityX(-this.playerVelocity);
            player2.play('player2MoveLeft');
        }
        else
        if(this.inputKey.right.isDown)
        {
            player2.setVelocityX(this.playerVelocity);
            player2.play('player2MoveRight');
        }
    }

     createPlayer(xPos, yPos, key, player)
    {
        player = this.physics.add.sprite(xPos, yPos, key);
        player.health = 100;
        player.lives = 3; 
        player.isAlive = true;
        player.score = 1000; 
        player.setCollideWorldBounds(true); 

        // PLAYER 1
        this.anims.create
       ({
            key: 'player1MoveLeft',
            frames: 
            [
                { key: 'player1',frame:1 },
            ],
            frameRate: 24,
            repeat: 0
        });

        this.anims.create
            ({
            key: 'player1MoveRight',
            frames: 
            [
                { key: 'player1',frame:2 },
            ],
            frameRate: 24,
            repeat: 0
         });

        this.anims.create
        ({
            key: 'player1Stationary',
            frames: 
            [
                { key: 'player1',frame:0 },
            ],
            frameRate: 24,
            repeat: 0
        }); 
        this.anims.create
        ({
            key: 'fireStationary1',
            frames: 
            [
                { key: 'player1',frame:3 },
            ],
            frameRate: 24,
            repeat: 5
        }); 
        this.anims.create
        ({
            key: 'fireRight1',
            frames: 
            [
                { key: 'player1',frame:5 },
            ],
            frameRate: 24,
            repeat: 0
        }); 
        this.anims.create
        ({
            key: 'fireLeft1',
            frames: 
            [
                { key: 'player1',frame:4 },
            ],
            frameRate: 24,
            repeat: 0
        }); 

        //PLAYER 2
        this.anims.create
       ({
            key: 'player2MoveLeft',
            frames: 
            [
                { key: 'player2',frame:1 },
            ],
            frameRate: 24,
            repeat: 0
        });

        this.anims.create
            ({
            key: 'player2MoveRight',
            frames: 
            [
                { key: 'player2',frame:2 },
            ],
            frameRate: 24,
            repeat: 0
         });

        this.anims.create
        ({
            key: 'player2Stationary',
            frames: 
            [
                { key: 'player2',frame:0 },
            ],
            frameRate: 24,
            repeat: 0
        }); 
        this.anims.create
        ({
            key: 'fireStationary2',
            frames: 
            [
                { key: 'player2',frame:3 },
            ],
            frameRate: 24,
            repeat: 0
        }); 
        this.anims.create
        ({
            key: 'fireRight2',
            frames: 
            [
                { key: 'player2',frame:5 },
            ],
            frameRate: 24,
            repeat: 0
        }); 
        this.anims.create
        ({
            key: 'fireLeft2',
            frames: 
            [
                { key: 'player2',frame:4 },
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


