class player extends Phaser.GameObjects.Sprite
{
    constructor (config)
    {        
        super(config.scene,config.xPos, config.yPos, config.key, config.playerControls);

        this.health = 100;
        this.lives = 3; 
        this.isAlive = true;
        console.log("Player class")
        config.scene.add.existing(this);
        this.cursorKeys = config.scene.playerControls;
    }  

    preload()
    {

    };

    create()
    {
        
    };

    update()
    {
        console.log("Update");
        this.movePlayerTwo();        
    };

    movePlayerTwo()
    {
        console.log("Player 2 movement");
        if(this.cursorKeys.left.isDown)
        {
            //this.setVelocity(-10);
            console.log("move left");
        }
        // else 
        // if('right')
        // {
        //     //this.setVelocity(10);
        //     console.log("move right");
        // }
    };
}
