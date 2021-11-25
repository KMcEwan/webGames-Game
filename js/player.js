class player extends Phaser.Physics.Arcade.Sprite
{
   
    //cursorKeys;
    constructor(scene, xPos, yPos,key, player)
    {
        super(scene, xPos, yPos, key);

        this.health = 100;
        this.lives = 3; 
        this.isAlive = true;
        this.score = 0;
        scene.add.existing(this);
        scene.physics.world.enableBody(this);    
        this.setCollideWorldBounds(true);

        if(player == 0)
        {
            this.player1Movement = this.scene.input.keyboard.addKeys({
                'left': Phaser.Input.Keyboard.KeyCodes.A,
                'right': Phaser.Input.Keyboard.KeyCodes.D,
                'fire': Phaser.Input.Keyboard.KeyCodes.SPACE,
                'special': Phaser.Input.Keyboard.KeyCodes.X
              });       
        }
        else
        {
            this.player2Movement = this.scene.input.keyboard.addKeys({
                'left2': Phaser.Input.Keyboard.KeyCodes.LEFT,
                'right2': Phaser.Input.Keyboard.KeyCodes.RIGHT,
                'fire2': Phaser.Input.Keyboard.KeyCodes.SPACE,
                'special2': Phaser.Input.Keyboard.KeyCodes.X
              });  
        }      
          
         
          
    }

    // update()
    // {
    //     if(!this.player1Movement.left.isDown || !this.player1Movement.right.isDown || !this.player2Movement.left2.isDown || !this.player2Movement.right2.isDown) 
    //     {
    //         this.setVelocityX(0);
    //     }
     
    //     this.movePlayers();
    // }

    // movePlayers()
    // {
    //     if(this.player1Movement.left.isDown || this.player1Movement.right.isDown || this.player2Movement.left2.isDown || this.player2Movement.right2.isDown)
    //     {
    //         this.movePlayer1();
    //         this.movePlayer2();
    //         console.log("movePlayers");
    //     }       
    // }

    // movePlayer1()
    // {
    //     if(this.player1Movement.left.isDown)
    //     {
    //         console.log("player move");
    //         this.setVelocityX(-100);
    //     }
    //     else
    //     if(this.player1Movement.right.isDown)
    //     {
    //         console.log("player move");
    //         this.setVelocityX(100);
    //     }
    // }

    // movePlayer2()
    // {
    //     console.log("PLAYER 2");
    //     if(this.player2Movement.left2.isDown)
    //     {
    //         console.log("player move");
    //         this.setVelocityX(-100);
    //     }
    //     else
    //     if(this.player2Movement.right2.isDown)
    //     {
    //         console.log("player move");
    //         this.setVelocityX(100);
    //     }
    // }

}
