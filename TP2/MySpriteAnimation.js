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
    this.startTime=0;
    this.begin=0;
    this.cycles=0;
    
    
    this.rectangle= new MyRectangle (scene,0,0,0.5,0.5);
    //this.scene.setUpdatePeriod(50);

}

  update(t)
{
    if(this.begin==0)
    {
        this.startTime=t;
        this.begin=1;
    }

    this.currentCell=this.currentCell+1;
    if(this.currentCell>this.endCell)
    {
        this.cycles++;
        this.currentCell=this.startCell;
    }



/*     if(((this.startTime-t)/1000)*(this.endCell-this.endCell+1)>=this.duration*this.cycles)
    {


    }
 */

    
    
} 

display(){

    this.scene.setActiveShaderSimple(this.sprite.shader);
    
    this.sprite.activateCellP(this.currentCell);
    this.rectangle.display();
    
    this.scene.setActiveShaderSimple(this.scene.defaultShader);   
    this.sprite.unbind();
} 

}