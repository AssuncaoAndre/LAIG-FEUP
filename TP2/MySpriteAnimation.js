class MySpriteAnimation extends CGFobject {
    /**
 * @method constructor
 * @param  {CGFscene} scene - MyScene object
 * @param  {MySpritesheet} sprite - spritesheet
 * @param  {float} sprite - spritesheet
 * @param  {startCell} sprite - spritesheet
 * @param  {endCell} sprite - spritesheet
 */
constructor(scene, sprite, duration, startCell, endCell) {
    super(scene);
    this.sprite=sprite;
    this.duration=duration;
    this.startCell=startCell;
    this.endCell=endCell;
    this.currentCell=startCell;
    this.previous=0;
    
    
    this.rectangle= new MyRectangle (scene,0,0,0.5,0.5);
   

}

  update(t)
{

    if(((t-this.previous)/1000)>=this.duration/(this.endCell-this.startCell+1))
    {
        this.previous=t;
        this.currentCell=this.currentCell+1;
        if(this.currentCell>this.endCell)
        {

            this.currentCell=this.startCell;
        }
    

    }
   
} 

display(){

    this.scene.setActiveShaderSimple(this.sprite.shader);
    
    this.sprite.activateCellP(this.currentCell);
    this.rectangle.display();
    
    this.scene.setActiveShaderSimple(this.scene.defaultShader);   
    this.sprite.unbind();
} 

}