class MyAuxiliarBoard extends CGFobject {
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
    constructor(scene, x1, y1, x2, y2) {

        super(scene);
        this.x1 = x1;
        this.x2 = x2;
        this.y2 = y2;
        this.y1 = y1;

        this.matrix=[];

        this.tile=new CGFtexture(this.scene, "./scenes/images/wood.jpg");

        this.default_material=new CGFappearance(scene);
        this.default_material.setAmbient(0, 0, 0, 1.0);
        this.default_material.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.default_material.setSpecular(0.5, 0.5, 0.5, 1.0);



        for (var i = 0; i < 4; i++) { 
            var mat = []; 
            for (var j = 0; j < 8; j++) {
            mat.push(new MyTile(this.scene,0.5,0.5,this.tile,0,null));
            }
            this.matrix.push(mat);
        }  
        
    }

    display(){            
        this.scene.pushMatrix();
        this.scene.translate(6.0,0,0);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        for (var i = 0; i < 4; i++) {
            this.scene.pushMatrix();
            for (var j = 0; j < 8; j++) {
               
                this.default_material.apply();
                this.scene.pushMatrix();
                this.scene.rotate(-Math.PI/2,0,0,1);
                this.matrix[i][j].display();
                this.scene.popMatrix();
                this.scene.translate(0.5,0,0);
            }
            this.scene.popMatrix();
            this.scene.translate(0,0.5,0);
         }  
         this.scene.popMatrix();
    }
}