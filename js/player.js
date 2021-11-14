class player  extends Phaser.GameObjects.Sprite
{
    constructor (config)
    {        
        super(config.scene,config.xPos, config.yPos, config.key);

        this.health = 100;
        this.lives = 3; 
        this.isAlive = true;
        console.log("Player class")
        config.scene.add.existing(this);
    }  

    preload()
    {

    };

    create()
    {
        keys = this.input.keyboard.addKeys
        ({
            left: 'left',
            right: 'right'
        });
    };

    update()
    {
        console.log("Update");
        this.movePlayerTwo();        
    };

    movePlayerTwo()
    {
        console.log("Player 2 movement");
        if(this.keys.left)
        {
            this.setVelocity(-10);
            console.log("move left");
        }
        else 
        if(this.keys.right)
        {
            this.setVelocity(10);
            console.log("move right");
        }
    };
}
