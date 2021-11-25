class player extends Phaser.Physics.Arcade.Sprite
{
   
    //cursorKeys;
    constructor(scene, xPos, yPos,key)
    {
        scene.add.existing(this);
        this.setVelocityY(-10);
    }

}