class MySpritesheet extends CGFobject {
        /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {CGFtexture} texture- Rdius of the centre circle
     * @param  {integer} sizeM - Radius of the tube
     * @param  {integer} sizeN - number of slices around Y axis
     */
    constructor(scene, texture, sizeM, sizeN) {
        super(scene);
        this.texture = new CGFtexture(this.scene,texture);
        
        this.sizeC =  sizeM;
        this.sizeL = sizeN;
        this.shader=new CGFshader(this.scene.gl,"shaders/sprite_shader.vert","shaders/sprite_shader.frag");
        


        this.shader.setUniformsValues({ uSampler2: 1 });
        this.shader.setUniformsValues({ sizeC: this.sizeC});
        this.shader.setUniformsValues({ sizeL: this.sizeL});
        this.shader.setUniformsValues({ linha: 0});
        this.shader.setUniformsValues({ coluna: 0}); 

        

    }

    activateCellMN(coluna, linha) 
    {
        

        this.shader.setUniformsValues({ coluna: coluna});
        
        this.shader.setUniformsValues({ linha: linha});
      
        this.texture.bind(0);
        
        
    }

    activateCellP(p)
    {
        
        this.activateCellMN(p%this.sizeC, Math.floor(p/this.sizeC)); 
    }

    unbind()
    {
        this.texture.unbind();
    }


   
}