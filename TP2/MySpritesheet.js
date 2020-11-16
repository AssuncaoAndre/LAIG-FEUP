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
        this. sizeM =  sizeM;
        this.sizeN = sizeN;
        this.shader=new CGFshader(this.scene.gl,"shaders/sprite_shader.vert","shaders/sprite_shader.frag");
        


        this.shader.setUniformsValues({ uSampler2: 1 });
        this.shader.setUniformsValues({ sizeM: this.sizeM});
        this.shader.setUniformsValues({ sizeN: this.sizeN});
        this.shader.setUniformsValues({ n: 0});
        this.shader.setUniformsValues({ m: 0}); 

        

    }

    activateCellMN(m, n) 
    {
        
        

        this.shader.setUniformsValues({ n: n});
        
        this.shader.setUniformsValues({ m: m});
      
        this.texture.bind(0);
        
        
    }

    activateCellP(p)
    {
        
        this.activateCellMN(p%this.sizeN, Math.floor(p/this.sizeN)); 
    }

    unbind()
    {
        this.texture.unbind();
    }


   
}