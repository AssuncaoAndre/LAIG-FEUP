class MySpriteText extends CGFobject {
    /**
 * @method constructor
 * @param  {CGFscene} scene - MyScene object
 * @param  {CGFtexture} text - Text to write
 */
constructor(scene, text) {
    super(scene);
    this.stat=0
    this.text=text;
    this.font_tex="./scenes/images/Berlinfont.png";
    this.font_sprite=new MySpritesheet(this.scene,this.font_tex,16,16);
    this.rectangle= new MyRectangle (scene,0,0,0.5,0.5);

}

getCharacterPosition(character)
{
    return(
        (character<='Z' && character>='A')?
        4*16+1+character.charCodeAt(0)-65:
        (character<='z' && character>='a')?
        6*16+1+character.charCodeAt(0)-97:
        character==' '? 
        9:
        character<='9' && character>='0'?
        character.charCodeAt(0)-48+48: //- codigo ascii do 0 + posição do 0 na sprite
        0
  
        );
}

display(){

        //this.scene.setActiveShaderSimple(this.scene.sprite_shader);
        this.scene.setActiveShaderSimple(this.font_sprite.shader);
         for(var i=0;i<this.text.length;i++)
        { 
            this.font_sprite.activateCellP(this.getCharacterPosition( this.text[i]));
    
            this.rectangle.display();
            this.scene.translate(0.5,0,0);
        } 
        this.font_sprite.unbind();
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }




}