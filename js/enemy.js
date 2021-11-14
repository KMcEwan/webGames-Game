class enemy extends Phaser.GameObjects.Sprite
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
        
    };

    update()
    {

    };
}
