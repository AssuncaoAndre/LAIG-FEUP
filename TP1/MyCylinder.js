class MyCylinder extends CGFobject {
    constructor(scene, height,bottomRadius, topRadius,  slices, stacks) {
        super(scene);
        this.slices = slices;
        this.height=height;
        this.stacks=stacks;
        this.bottomRadius=bottomRadius;
        this.topRadius=topRadius;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        var height_increment=this.height/this.stacks;
        var current_height=0;
        var current_radius=this.bottomRadius;
        var horizontal_difference=(this.topRadius-this.bottomRadius)/this.stacks;
       
        var offset=0;

        for (var j = 0; j < this.stacks; j++) {
            var ang = 0;
            var alphaAng = 2 * Math.PI / this.slices;
            
            
            var next_radius=current_radius+horizontal_difference;
            
        for (var i = 0; i < this.slices; i++) {
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals
            // in each face will be different
            
            var sa = Math.sin(ang);
            var saa = Math.sin(ang + alphaAng);
            var ca = Math.cos(ang);
            var caa = Math.cos(ang + alphaAng);
            

            this.vertices.push(ca*current_radius , -sa*current_radius, current_height );
            this.vertices.push(caa*current_radius, -saa*current_radius , current_height  );
            this.vertices.push(ca*next_radius, -sa*next_radius  , current_height+height_increment);
            this.vertices.push(caa*next_radius, -saa*next_radius, current_height+height_increment );
//             console.log(current_height+height_increment);

            this.normals.push(ca*current_radius , -sa*current_radius, 0);
            this.normals.push(caa*current_radius , -saa*current_radius, 0 );
            this.normals.push(ca*next_radius , -sa*next_radius, 0);
            this.normals.push(caa*next_radius, -saa*next_radius, 0 );


            this.indices.push(4 * (i+(j*this.slices)), (4 * (i+(j*this.slices)) + 2), (4 * (i+(j*this.slices)) + 1));
            this.indices.push((4 * (i+(j*this.slices)) + 3), (4 * (i+(j*this.slices)) + 1), (4 * (i+(j*this.slices)) + 2)); 
           
            this.texCoords.push(1 / this.slices * i, 1);
            this.texCoords.push(1 / this.slices * (i + 1), 1);
            this.texCoords.push(1 / this.slices * i, 0);
            this.texCoords.push(1 / this.slices * (i + 1), 0);

            ang += alphaAng;
        }
        current_radius=current_radius+horizontal_difference;
        current_height=current_height+height_increment;
    }
        
        this.vertices.push(0 , 0, 0);
        this.normals.push(0 , 0, -1 );

        this.vertices.push(0 , 0, this.height);
        this.normals.push(0 , 0, 1 );

        for(var i=0;i<this.slices*4;i=i+4)
        {
            this.indices.push(i+1,this.stacks*this.slices*4,i);
            this.indices.push(this.stacks*this.slices*4-i+2,this.stacks*this.slices*4+1,this.stacks*this.slices*4-i+3);
        }
        this.indices.push(this.stacks*this.slices*4-this.slices*4+2,this.stacks*this.slices*4+1,this.stacks*this.slices*4-this.slices*4+3);
 
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    updateTexCoords(afs,aft) {
        /* 		this.texCoords = [...coords];
            this.updateTexCoordsGLBuffers(); */
          } 
}
