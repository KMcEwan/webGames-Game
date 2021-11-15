class player extends Phaser.Physics.Arcade.Sprite
{
    static aKey;
    cursorKeys;
    constructor(scene, xPos, yPos,key, playerInput)
    {
        super(scene, xPos, yPos, key);
       // if (playerInput == null) playerInput = 0;
        this.cursorKeys = scene.playerInput;
        this.health = 100;
        this.lives = 3; 
        this.isAlive = true;
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);  
    }

    preload()
    {

    }

    create()
    {
        console.log("create");
        
    }

    update()
    {
        this.movePlayers();
        //console.log("player update");
    }

    movePlayers()
    {
        this.setVelocityX(0);
        if(aKey.isDown)
        {
            console.log("player move");
            this.setVelocityX(-100);
        }
        else
        if(this.cursorKeys.right.isDown)
        {
            console.log("player move");
            this.setVelocityX(100);
        }
    }

}
