class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, key)
    {
       super(scene, x, y, key);                                                     // Super calls parent class which is Phaser.Physics.Arcade.Sprite
       this.setScale(1.4);
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

    this.anims.create
    ({
     key: 'destroyEnemy',
     frames: [
         { key: 'enemy',frame:2 },
         { key: 'enemy',frame:3 },
         { key: 'enemy',frame:4 },
         { key: 'enemy',frame:5 },
     ],
     frameRate: 8,
     repeat: 0
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
        enemy.body.setEnable(false);
        enemy.play('destroyEnemy', true)
        enemy.once('animationcomplete', ()=> 
        {
          //  console.log("anmiation complete");
            enemy.destroy();
        })
           
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
        this.lasers = new Array();        
    }


    create()
    {

        /* TESTING PURPOSES ONLY */


        /* TESTING PURPOSES ONLY END */

        this.scoreForHealSelf = 200;
        this.scoreForHealBoth = 300;
        this.specialAbility1 = 300;
        this.gainLives = 1000;
        this.specialAttack = 1000;
        this.playerVelocity = 200;
        this.combinedScore = 2050;
        this.thrustPlayingOne = false;
        this.thrustPlayingTwo = false;
       
        // const gameMusic = this.sound.add("mainGameMusic");
        // gameMusic.play();

        this.thrustEffect = this.sound.add("thrust");
        this.thrustEffect2 = this.sound.add("thrust");                                               // Keep two audios, needed so one doesnt switch the other off.

        this.inputKey = this.input.keyboard.createCursorKeys(); 
        this.backgroundSun = this.add.image(300,400, 'backgroundSun');
        this.background = this.createBackground();
  
 
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
       // console.log("player lives : " , player1.lives);
 
        if(this.percent >= .1)
        {
            this.drawPlayer1Health();
        }
        else
        {
            player1.lives --;
            
            this.setPlayers1Lives();
          

            if(player1.lives > 0)
            {
                player1.health = 100;                
                this.percent = Phaser.Math.Clamp(player1.health, 0, 100) / 100;
               // console.log("player lives : " , player1.lives);
                this.drawPlayer1Health();
            }
            else
            {
                this.scene.start("gameOverKey");
                this.game.sound.stopAll();
            }
        }
    }

    drawPlayer1Health()
    {
        this.graphicsPlayerOneHealth.fillStyle(0x00ff00);
        this.graphicsPlayerOneHealth.fillRoundedRect(5,40, this.width * this.percent, 10, 5);  
    }

    setPlayers1Lives()
    {
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
    }


    
    setHealthbarPlayerTwo()
    {
        this.width = 100;
        this.percent = Phaser.Math.Clamp(player2.health, 0, 100) / 100;
        this.graphicsPlayerTwoHealth.clear();
        this.graphicsPlayerTwoHealth.fillStyle(0x808080);
        this.graphicsPlayerTwoHealth.fillRoundedRect(455, 40, this.width, 10, 5);
       // console.log("player lives : " , player2.lives);
 
        if(this.percent >= .1)
        {
            this.drawPlayer2Health();
        }
        else
        {
            player2.lives --;
            this.setPlayers2Lives();
     
            if(player2.lives > 0)
            {
                player2.health = 100;                
                this.percent = Phaser.Math.Clamp(player2.health, 0, 100) / 100;
              //  console.log("player lives : " , player2.lives);
                this.drawPlayer2Health();
            }
            else
            {
                this.scene.start("gameOverKey");
                this.game.sound.stopAll();
            }
        }
    }

    drawPlayer2Health()
    {
        this.graphicsPlayerTwoHealth.fillStyle(0x00ff00);
        this.graphicsPlayerTwoHealth.fillRoundedRect(455,40, this.width * this.percent, 10, 5);  
    }

    setPlayers2Lives()
    {
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
    }


    enemyHitPlayer(player, enemy) 
    {      

        player.health -= 10;
        this.enemyCount--;
        //enemy.play('destroyEnemy');
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

        if(this.aKey.isDown || this.dKey.isDown)
        {
            this.movePlayer1();
        }
        else
        {
            player1.setVelocityX(0);           
            player1.play('player1Stationary');      
            this.thrustPlayingOne = false;
            this.thrustEffect.stop();
        }

        if(this.inputKey.left.isDown || this.inputKey.right.isDown)
        {
            this.movePlayer2();
        }
        else
        {
            player2.setVelocityX(0);
            player2.play('player2Stationary');
            this.thrustPlayingTwo = false;
            this.thrustEffect2.stop();
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

        if(this.specialAbility1.isDown || this.healBoth.isDown || this.healSelf.isDown)
        {
            this.specialsPlayer1();
        }

        if(this.specialAbility2.isDown || this.healBoth2.isDown || this.healSelf2.isDown)
        {
            this.SpecialsPlayer2();
        }
        
        if(player1.score + player2.score > this.combinedScore)
        {
            this.scene.start("gameWonKey", player1, player2);
        }

        this.checkPlayersScore();
        
    }/* UPDATE FUNCTION END */


    enemyOutOfScreen(ground, enemy)
    {
        enemy.play('destroyEnemy')
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
            this.enemiesInScene = this.firstWave - this.enemyCount;         

            for (let k = 0; k < this.enemiesInScene; k++) 
            {
                let x = Phaser.Math.Between(580, 20);   
                let vel = Phaser.Math.Between(300, 10);   
                this.enemy = new Enemy(this, x, 0, 'enemy');
                this.enemy.play('flash');
                this.add.existing(this.enemy);
                this.enemies.add(this.enemy);
                this.enemy.setVelocityY(vel);
                this.enemies2.push(this.enemy);
                this.enemyCount++;
            }
        }
        else
        if(this.maxScore < 600)
        {
           // console.log("Second set of enemies");
        }
        else
        if(this.maxScore < 900)
        {
            //console.log("Second set of enemies");
        }

    }

    specialsPlayer1()
    {
        if(Phaser.Input.Keyboard.JustDown(this.specialAbility1))
        {
            if(player1.score >= this.gainLives)
            {
                if(player1.lives < 3)
                {
                    player1.lives++;
                }
                if(player2.lives < 3)
                {
                    player2.lives++;
                }
                player1.score -= 1000;
                this.setPlayers1Lives();
                this.setPlayers2Lives();
            }
          //  this.DefenceLaser = this.createDefenceLaser(300, 800, 'laserDefence', this.DefenceLaser);
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

    SpecialsPlayer2()
    {
        if(Phaser.Input.Keyboard.JustDown(this.specialAbility2))
        {
            console.log("special attack");
            if(player2.score >= this.specialAttack)
            {
                this.DefenceLaser = this.createDefenceLaser(300, 800, 'laserDefence', this.DefenceLaser);
                player2.score -= this.specialAttack;
            }
         
        }
        else 
        if(Phaser.Input.Keyboard.JustDown(this.healSelf2))
        {
            if(player2.score >= this.scoreForHealSelf)
            {
                player2.health = 100;
                player2.score -= this.scoreForHealSelf;
                this.setHealthbarPlayerOne();
                this.setHealthbarPlayerTwo();
            }     
        }
        else
        if(Phaser.Input.Keyboard.JustDown(this.healBoth2))
        {
            if(player2.score >= this.scoreForHealBoth)
            {
                player1.health = 100;
                player2.health = 100;
                player2.score -= this.scoreForHealBoth;
                this.setHealthbarPlayerOne();
                this.setHealthbarPlayerTwo();
            }
        }
    }
   

    movePlayer1()
    {  
     
        if(Phaser.Input.Keyboard.JustDown(this.aKey))
        {          
            player1.setVelocityX(-this.playerVelocity);
            player1.play('player1MoveLeft');          
            if (this.thrustPlayingOne !== true) {
                this.thrustEffect.play();
                this.thrustPlayingOne = true;             
            }           
        }
        else
        if(Phaser.Input.Keyboard.JustDown(this.dKey))
        {
            player1.setVelocityX(this.playerVelocity);
            player1.play('player1MoveRight');
            if (this.thrustPlayingOne !== true) {
                this.thrustEffect.play();
                this.thrustPlayingOne = true;               
            }           
        }

    }

   
    movePlayer2()
    {
        if(Phaser.Input.Keyboard.JustDown(this.inputKey.left))
        {
            player2.setVelocityX(-this.playerVelocity);
            player2.play('player2MoveLeft');
            if (this.thrustPlayingTwo !== true) {
                console.log(" THRUST TEST")
                this.thrustEffect2.play();
                this.thrustPlayingTwo = true;
            }           
        }
        else
        if(Phaser.Input.Keyboard.JustDown(this.inputKey.right))
        {
            player2.setVelocityX(this.playerVelocity);
            player2.play('player2MoveRight');
            if (this.thrustPlayingTwo !== true) {
                console.log(" THRUST TEST")
                this.thrustEffect2.play();
                this.thrustPlayingTwo = true;
            }           
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
        this.specialAbility1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.healSelf = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.healBoth = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);


        this.specialAbility2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE);
        this.healSelf2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO);
        this.healBoth2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE);

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

    createDefenceLaser(xPos, yPos, key, defenceLaser)
    {
        defenceLaser = this.physics.add.sprite(xPos, yPos, key);
        defenceLaser.setVelocityY(-200);
        this.physics.add.overlap(defenceLaser, this.enemies,  this.defenceLaserEnemy, null, this);
        return ground;
    }

    defenceLaserEnemy(defence, enemies)
    {
        enemies.destroy(true);
        //enemies.play('destroyEnemy');
        this.enemyCount--;
    }

    createBackground()
    {
       // this.background = this.add.tileSprite(300, 400, 600, 800, 'background')
        this.background = this.physics.add.sprite(300, 400, 'background');
        this.anims.create
        ({
         key: 'backgroundMove',
         frames: [
             { key: 'background',frame:0 },
             { key: 'background',frame:1 },
             { key: 'background',frame:2 },
             { key: 'background',frame:3 },
             { key: 'background',frame:4 },
             { key: 'background',frame:5 },
             { key: 'background',frame:6 },
             { key: 'background',frame:7 },
             { key: 'background',frame:8 },
             { key: 'background',frame:9 },
             { key: 'background',frame:10 },
             { key: 'background',frame:11 },
             { key: 'background',frame:12 },
             { key: 'background',frame:13 },
             { key: 'background',frame:14 },
             { key: 'background',frame:15 },
             { key: 'background',frame:16 },
             { key: 'background',frame:17 },
             { key: 'background',frame:18 },
             { key: 'background',frame:19 },
             { key: 'background',frame:20 },
             { key: 'background',frame:21 },
             { key: 'background',frame:22 },
             { key: 'background',frame:23 },
            //  { key: 'background',frame:24 },

         ],
         frameRate: 6,
         repeat: -1
     });
     this.background.play('backgroundMove');
     return this.background;   
    }
}


