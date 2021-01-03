class MyTile extends CGFobject {
    /**
     * Builds a plane object 
     * 
     * @param {CGFscene} scene main scene
     * @param {Number} npointsU number of divisions in U
     * @param {Number} npointsV number of divisions in V
     * @param {Number} npartsU number of divisions in U
     * @param {Number} npartsV number of divisions in V
     * @param {Number} controlPoints number of divisions in V
     * 
     */
    constructor(scene,sizex,sizey,tile,selected,shader) {
        super(scene);
        this.shader=shader;
        this.tile_texture=tile;
        this.selected_texture=selected;
        this.sizex=sizex;
        this.sizey=sizey;
        this.piece=null;
        this.rectangle=new MyPlane(this.scene,40,40);

        this.is_selected=0;

        if(shader!=null)
        this.shader.setUniformsValues({ uSampler2: 1 });
        
    }

    display(){        
        this.scene.pushMatrix();
        this.scene.scale(this.sizex,this.sizey,1);
        
        this.tile_texture.bind(0);
        if(this.is_selected==1)
        {       
            this.selected_texture.bind(1);
            //this.shader.setUniformsValues({ selected: 1 });
            
            this.scene.setActiveShaderSimple(this.shader); 
        }
/*         else 
        {
            this.shader.setUniformsValues({ selected: 0 });
            
        } */
        this.rectangle.display();
    
        if(this.is_selected==1)
        this.scene.setActiveShaderSimple(this.scene.defaultShader);

        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0,1,0);
        
        
        
        if(this.piece!=null)
        this.piece.display();
        
        this.scene.popMatrix();
    }
}