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
        this.scene.explosionSound.play();
        enemy.play('destroyEnemy', true)
        enemy.once('animationcomplete', ()=> 
        {
            this.scene.explosionSound.stop();
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
      //  this.specialAbility1 = 300;
        this.gainLives = 600;
        this.specialAttack = 600;
        this.playerVelocity = 200;
        this.combinedWinScore = 2500;
        this.thrustPlayingOne = false;
        this.thrustPlayingTwo = false;
        this.deathAnimationRunning = false;
        this.deathAnimationRunning2 = false;
        this.destroyAnimationRunning = false;
        this.destroyAnimationRunning2 = false;
        this.buildingName;
       
        // const gameMusic = this.sound.add("mainGameMusic");
        // gameMusic.play();

        this.thrustEffect = this.sound.add("thrust");
        this.thrustEffect2 = this.sound.add("thrust");                                               // Keep two audios, needed so one doesnt switch the other off.
        this.explosionSound = this.sound.add("enemyExplosion");
        this.laserEffect = this.sound.add("laserFire", {volume: 0.5});
        this.specialLaserBeam = this.sound.add("specialLaserBeam");
        this.lifeLost = this.sound.add("lifeLost");
        this.gainLife = this.sound.add("gainLife");
        this.gainHealth = this.sound.add("gainHealth");

        this.inputKey = this.input.keyboard.createCursorKeys(); 

        this.buildingCount = 6;

        ground = this.createGround(300, 796, 'ground', ground);
        topGround = this.createGround(300, 1, 'ground', topGround);


        this.backgroundSun = this.add.image(300,400, 'backgroundSun');
        this.background = this.createBackground();
  
 
        player1 = this.createPlayer(200, 500, 'player1', player1);
        player2 = this.createPlayer(400, 500, 'player2', player2);
        player1.setSize(50, 40, true);
        player2.setSize(50, 40, true);
       
        building1 = this.createBuilding(43, 712, 'building1');
        building1.setScale(2);
        building1.setSize(43, 78, true);
        building1.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => building1.setTexture('building1'))
        building1.play('building1OnOff');


        building2 = this.createBuilding(163, 712, 'building2');
        building2.setScale(2);
        building2.setSize(77, 78, true);
        building2.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => building2.setTexture('building2'))
        building2.play('building2OnOff');

        building3 = this.createBuilding(283, 712, 'building3');
        building3.setScale(2);
        building3.setSize(43, 78, true);
        building3.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => building3.setTexture('building3'))
        building3.play('building3OnOff');

        building4 = this.createBuilding(403, 712, 'building4');
        building4.setScale(2);
        building4.setSize(77, 78, true);
        building4.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => building4.setTexture('building4'))
        building4.play('building4OnOff');
        
        building5 = this.createBuilding(523, 712, 'building5');
        building5.setScale(2);
        building5.setSize(43, 78, true);
        building5.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => building5.setTexture('building5'))
        building5.play('building5OnOff');

        building6 = this.createBuilding(583, 712, 'building6');
        building6.setScale(2);
        building6.setSize(17, 78, true);
        building6.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => building6.setTexture('building6'))
        building6.play('building6OnOff');



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
        this.physics.add.overlap(building1, this.enemies, this.bulletHitBuilding, null, this);   
        this.physics.add.overlap(building2, this.enemies, this.bulletHitBuilding, null, this);   
        this.physics.add.overlap(building3, this.enemies, this.bulletHitBuilding, null, this);   
        this.physics.add.overlap(building4, this.enemies, this.bulletHitBuilding, null, this);   
        this.physics.add.overlap(building5, this.enemies, this.bulletHitBuilding, null, this);   
        this.physics.add.overlap(building6, this.enemies, this.bulletHitBuilding, null, this);   
        
        this.player1Image = this.add.image(135,40, 'player1');
        this.player1Image.setScale(0.75)

        this.player1Image = this.add.image(425,40, 'player2');
        this.player1Image.setScale(0.75)
     
        
        this.playerOneScore = this.add.text (5,55, 'score : 0', { fontFamily: 'CustomFont', fill: '#df03fc'});
        this.playerTwoScore = this.add.text (460, 55, 'score : 0', {fontFamily: 'CustomFont', fill: '#0377fc'});


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



        this.lastFiredOne = new Date().getTime();
        this.shotFreqOne = 300;
        this.lastFiredTwo = new Date().getTime();
        this.shotFreqTwo = 300;
    };

    bulletHitBuilding(building, enemy)
    {
        enemy.body.setEnable(false);
        this.explosionSound.play();
        this.enemyCount--;
        enemy.play('destroyEnemy', true)
        enemy.once('animationcomplete', ()=> 
        {
            this.explosionSound.stop();
            enemy.destroy(); 
        })
        if(building.health > 0)
        {
            building.health -= 10;
        }
        else
        {
           
            if(building == building1)
            {
                this.buildingName = "building1destroyBuilding";
                building.body.setEnable(false);
            }
            else if (building == building2)
            {
                this.buildingName = "building2destroyBuilding";
                building.body.setEnable(false);
            }
            else if (building == building3)
            {
                this.buildingName = "building3destroyBuilding";
                building.body.setEnable(false);
            }
            else if (building == building4)
            {
                this.buildingName = "building4destroyBuilding";
                building.body.setEnable(false);
            }
            else if (building == building5)
            {
                this.buildingName = "building5destroyBuilding";
                building.body.setEnable(false);
            }
            else
            {
                this.buildingName = "building6destroyBuilding";
                //building.body.setEnable(false);
            }

           // building.setActive(false).setVisible(false);
            


           // building.anims.stop();
            console.log("BUILDING DESTROYED");
            building.play(this.buildingName, true)
            building.once('animationcomplete', ()=> 
            {
                //this.explosionSound.stop();
                building.destroy(); 
                this.buildingCount--;
            })

          

            
            // DESTROY BUILDING
        }
    }
    setHealthbarPlayerOne()
    {
        this.width = 100;
        this.percent = Phaser.Math.Clamp(player1.health, 0, 100) / 100;
        this.graphicsPlayerOneHealth.clear();
        this.graphicsPlayerOneHealth.fillStyle(0x808080);
        this.graphicsPlayerOneHealth.fillRoundedRect(5, 40, this.width, 10, 5);
 
        if(this.percent >= .1)
        {
            this.drawPlayer1Health();
            console.log(this.percent);
        }
        else 
        {
            this.lifeLost.play();
            console.log(this.percent);
          
            player1.lives --;                     
            this.setPlayers1Lives();
          
          

            if(player1.lives > 0)
            {
                player1.health = 100;                
                this.percent = Phaser.Math.Clamp(player1.health, 0, 100) / 100;
                this.drawPlayer1Health();
            }
            else
            {
                player1.isAlive = false;
                this.destroyPlayer1();
                this.checkPlayersAlive();
            }

            if(!this.destroyAnimationRunning)
            {
                this.respawnPlayer1();  
            }
        }
    }

    destroyPlayer1()
    {
        console.log("Destroy enemy 1");
        this.destroyAnimationRunning = true;
        player1.play('dead2', true)
        player1.once('animationcomplete', ()=> 
        {
           console.log("TEST ANIMATIONS");
            //player2.destroy(); 
            this.destroyAnimationRunning = false;
            player1.setActive(false).setVisible(false);
            player1.body.setEnable(false);
        })
        
    }

    respawnPlayer1()
    {   
        console.log(this.deathAnimationRunning);   
        this.deathAnimationRunning = true;
        console.log("respawning function");
        player1.play('deathFlash', true)
        player1.once('animationcomplete', ()=> 
        {           
            console.log("respawn");  
            player1.x = 200;
            player1.y = 500;       
            this.deathAnimationRunning = false;
            console.log(this.deathAnimationRunning);   
        })

    
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

    checkPlayersAlive()
    {
        if(!player1.isAlive && !player2.isAlive)
        {
            this.scene.start("gameOverKey", player1, player2);
            this.game.sound.stopAll();
        }
    }

    
    setHealthbarPlayerTwo()
    {
        this.width = 100;
        this.percent = Phaser.Math.Clamp(player2.health, 0, 100) / 100;
        this.graphicsPlayerTwoHealth.clear();
        this.graphicsPlayerTwoHealth.fillStyle(0x808080);
        this.graphicsPlayerTwoHealth.fillRoundedRect(455, 40, this.width, 10, 5);
 
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
                this.drawPlayer2Health();
            }
            else
            {
                console.log("DEAD");
                player2.isAlive = false;
                this.destroyPlayer2();
                this.checkPlayersAlive();
            }

            if(!this.destroyAnimationRunning2)
            {
                this.respawnPlayer2();  
            }
           
            
        }
    }

    destroyPlayer2()
    {
        console.log("Destroy enemy 2");
        this.destroyAnimationRunning2 = true;
        player2.play('dead2', true)
        player2.once('animationcomplete', ()=> 
        {
           console.log("TEST ANIMATIONS");
            //player2.destroy(); 
            this.destroyAnimationRunning2 = false;
            player2.setActive(false).setVisible(false);
            player2.body.setEnable(false);
        })
        
    }

    respawnPlayer2()
    {   
        //console.log(this.deathAnimationRunning2);   
        this.deathAnimationRunning2 = true;
        //console.log("respawning function");
        player2.play('deathFlash2', true)
        player2.once('animationcomplete', ()=> 
        {           
            console.log("respawn");  
            player2.x = 400;
            player2.y = 500;       
            this.deathAnimationRunning2 = false;
           // console.log(this.deathAnimationRunning2);   
        })

    
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

        if(this.buildingCount <= 0)
        {
            this.scene.start("gameOverKey", player1, player2);
            this.game.sound.stopAll();
        }
        /* DEBUGGING USE ONLY */
        if(this.inputKey.down.isDown)                                       
        {
            // player1.score = 1000;
             player2.score = 1000;     
             player1.score = 1000;           
            //player2.health -= 10;
           // this.scene.start("gameWonKey", player1, player2);
        }
        /* DEBUGGING USE ONLY END */
        
        this.playerOneScore.setText('score : ' + player1.score);
        this.playerTwoScore.setText('score : ' + player2.score);

        if(!this.deathAnimationRunning && !this.destroyAnimationRunning && this.aKey.isDown || !this.deathAnimationRunning && !this.destroyAnimationRunning && this.dKey.isDown)
        {
            this.movePlayer1();
        }
        else
        {
            player1.setVelocityX(0);  
            if(!this.deathAnimationRunning && !this.destroyAnimationRunning)         
            {
                player1.play('player1Stationary');      
                this.thrustPlayingOne = false;
                this.thrustEffect.stop();
            }

        }

        if(!this.deathAnimationRunning2 && !this.destroyAnimationRunning2 && this.inputKey.left.isDown || !this.deathAnimationRunning2 && !this.destroyAnimationRunning2 && this.inputKey.right.isDown)
        {
            this.movePlayer2();
        }
        else
        {
            player2.setVelocityX(0);
            if(!this.deathAnimationRunning2 && !this.destroyAnimationRunning2)         
            {
                player2.play('player2Stationary');
                this.thrustPlayingTwo = false;
                this.thrustEffect2.stop();
            }
        }


        // PLAYER 1 FIRING
        if(this.Wkey.isDown && this.aKey.isDown)
        {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastFiredOne > this.shotFreqOne) {
                this.laserEffect.play();
                var canLaser = new cannonLaser(this, player1.x, player1.y - 40, 'laser', player1);
                this.lastFiredOne = currentTime;
               
            }
            player1.play('fireLeft1');
        }
        else if (this.Wkey.isDown && this.dKey.isDown)
        {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastFiredOne > this.shotFreqOne) {
                this.laserEffect.play();
                var canLaser = new cannonLaser(this, player1.x, player1.y - 40, 'laser', player1);
                this.lastFiredOne = currentTime;               
            }
            player1.play('fireRight1');
        }
        else if (this.Wkey.isDown && player1.isAlive)
        {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastFiredOne > this.shotFreqOne) {
                this.laserEffect.play();
                var canLaser = new cannonLaser(this, player1.x, player1.y - 40, 'laser', player1);
                this.lastFiredOne = currentTime;                             
            }
            player1.play('fireStationary1');
        }


        //PLAYER 2 FIRING
        if(this.inputKey.up.isDown && this.inputKey.left.isDown)
        {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastFiredOne > this.shotFreqOne) {
                this.laserEffect.play();
                var canLaser = new cannonLaser(this, player2.x, player2.y - 40, 'laser2', player2);
                this.lastFiredOne = currentTime;
               
            }
            player2.play('fireLeft2');
        }
        else if (this.inputKey.up.isDown && this.inputKey.right.isDown)
        {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastFiredOne > this.shotFreqOne) {
                this.laserEffect.play();
                var canLaser = new cannonLaser(this, player2.x, player2.y - 40, 'laser2', player2);
                this.lastFiredOne = currentTime;               
            }
            player2.play('fireRight2');
        }
        else
        if(this.inputKey.up.isDown && player2.isAlive)
        {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastFiredTwo > this.shotFreqTwo) {
                this.laserEffect.play();
                var canLaser = new cannonLaser(this, player2.x, player2.y - 40, 'laser2', player2);
                this.lastFiredTwo = currentTime;
               
            }
            player2.play('fireStationary2'); 
        }  

        if(this.specialAbility1.isDown || this.healBoth.isDown || this.healSelf.isDown)
        {
            this.specialsPlayer1();
        }

        if(this.specialAbility2.isDown || this.healBoth2.isDown || this.healSelf2.isDown)
        {
            this.SpecialsPlayer2();
        }
        
        if(player1.score + player2.score > this.combinedWinScore)
        {
            this.thrustEffect.stop();
            this.thrustEffect2.stop();
            this.laserEffect.stop();
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

        if(this.maxScore >= 0 && this.maxScore < 300)
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
        if(this.maxScore > 300 && this.maxScore < 600)
        {
            this.enemiesInScene = this.secondWave - this.enemyCount;   
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
        if(this.maxScore > 600)
        {
            this.enemiesInScene = this.thirdWave - this.enemyCount;   
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
                this.gainLife.play();
                player1.score -= this.specialAttack;
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
                player1.score -= this.scoreForHealSelf;
                this.setHealthbarPlayerOne();
                this.setHealthbarPlayerTwo();
                this.gainHealth.play();
            }     
        }
        else
        if(Phaser.Input.Keyboard.JustDown(this.healBoth))
        {
            if(player1.score >= this.scoreForHealBoth)
            {
                player1.health = 100;
                player2.health = 100;
                player1.score -= this.scoreForHealBoth;
                this.setHealthbarPlayerOne();
                this.setHealthbarPlayerTwo();
                this.gainHealth.play();
            }
        }
    }

    SpecialsPlayer2()
    {
        if(Phaser.Input.Keyboard.JustDown(this.specialAbility2))
        {
           // console.log("special attack");
            if(player2.score >= this.specialAttack)
            {
                this.DefenceLaser = this.createDefenceLaser(300, 800, 'laserDefence', this.DefenceLaser);
                this.specialLaserBeam.play();
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
                this.gainHealth.play();
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
                this.gainHealth.play();
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
               // console.log(" THRUST TEST")
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
               // console.log(" THRUST TEST")
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
        player.score = 0; 
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
            frameRate: 1,
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

        this.anims.create
        ({
            key: 'deathFlash',
            frames: 
            [
                { key: 'player1',frame:6 },
                { key: 'player1',frame:0 },
            ],
            frameRate: 6,
            repeat:2
        }); 

        this.anims.create
        ({
            key: 'dead',
            frames: 
            [
                { key: 'player1',frame:7 },
                { key: 'player1',frame:8 },
                { key: 'player1',frame:9 },
                { key: 'player1',frame:10 },
                { key: 'player1',frame:11 },
                { key: 'player1',frame:12 },
                { key: 'player1',frame:13 },
            ],
            frameRate: 7,
            repeat:0
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
        this.anims.create
        ({
            key: 'deathFlash2',
            frames: 
            [
                { key: 'player2',frame:6 },
                { key: 'player2',frame:0 },
            ],
            frameRate: 6,
            repeat:2
        }); 

        this.anims.create
        ({
            key: 'dead2',
            frames: 
            [
                { key: 'player2',frame:7 },
                { key: 'player2',frame:8 },
                { key: 'player2',frame:9 },
                { key: 'player2',frame:10 },
                { key: 'player2',frame:11 },
                { key: 'player2',frame:12 },
                { key: 'player2',frame:13 },
            ],
            frameRate: 7,
            repeat:0
        }); 

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.specialAbility1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.healSelf = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.healBoth = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);


        this.specialAbility2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE);
        this.healSelf2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO);
        this.healBoth2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE);

        return player;
    }


    createBuilding(xPos, yPos, key) {
        let building = this.physics.add.sprite(xPos, yPos, key);
        building.health = 100;
        building.isAlive = true;


        this.anims.create
            ({
                key: key + 'OnOff',
                frames:
                    [
                        { key: key, frame: 0 },
                        { key: key, frame: 1 },
                        { key: key, frame: 2 },
                        { key: key, frame: 3 },
                    ],
                frameRate: 1,
                repeat: -1
            });

            this.anims.create
            ({
                key: key + 'destroyBuilding',
                frames:
                    [
                        { key: key, frame: 4 },
                        { key: key, frame: 5 },
                        { key: key, frame: 6 },
                        { key: key, frame: 7 },
                        { key: key, frame: 8 },
                        { key: key, frame: 9 },


                    ],
                frameRate: 3,
                repeat: 0
            });

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


