class MyTriangle extends CGFobject {
    constructor(scene,x1,y1,x2,y2,x3,y3) {
        super(scene);
        this.x1=x1;
        this.x2=x2;
        this.x3=x3;
        this.y1=y1;
        this.y2=y2;
        this.y3=y3;


        this.initBuffers();
    }
    initBuffers() {
        this.vertices=[];

        //organizes the vertices so they are always in the same order
        if(this.x1<=this.x2 && this.x1<=this.x3)
        {
            this.vertices.push(this.x1,this.y1,0);
            if(this.x2<this.x3 || (this.x2==this.x3 && (this.y1-this.y2)<(this.y1-this.y3)))
            {
                this.vertices.push(this.x2,this.y2,0);
                this.vertices.push(this.x3,this.y3,0);
            }
            else{
                this.vertices.push(this.x3,this.y3,0);                
                this.vertices.push(this.x2,this.y2,0);
            }
        }

        else if(this.x2<=this.x1 && this.x2<=this.x3)
        {
            this.vertices.push(this.x2,this.y2,0);
            if(this.x1<this.x3 || (this.x1==this.x3 && (this.y2-this.y1)<(this.y2-this.y3)))
            {
                this.vertices.push(this.x1,this.y1,0);
                this.vertices.push(this.x3,this.y3,0);
            }
            else{
                this.vertices.push(this.x3,this.y3,0);                
                this.vertices.push(this.x1,this.y1,0);
            }
        }

        else if(this.x3<=this.x2 && this.x3<=this.x1)
        {
            this.vertices.push(this.x3,this.y3,0);
            if(this.x1<this.x2 || (this.x1==this.x2 && (this.y3-this.y1)<(this.y3-this.y2)))
            {
                this.vertices.push(this.x1,this.y1,0);
                this.vertices.push(this.x2,this.y2,0);
            }
            else{
                this.vertices.push(this.x2,this.y2,0);
                this.vertices.push(this.x1,this.y1,0);                
            }
        }
        

        this.indices = [2, 1, 0];



        this.normals = [];
        for (var i = 0; i < 3; i++) {
            this.normals.push(0, 0, 1);
        }



        this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
		]

        this.primitiveType = this.scene.gl.TRIANGLES;
        
        this.initGLBuffers();
    }
    updateTexCoords(afs,aft) {
        var a=[this.vertices[0],this.vertices[1]];
        var b=[this.vertices[3],this.vertices[4]];
        var c=[this.vertices[6],this.vertices[7]];

        this.texCoords = [
            0,Math.abs((a[1]-b[1]))/afs,
            0,0,
            Math.abs((c[0]-b[0]))/afs,Math.abs((c[1]-b[1]))/aft,

        ]; 


		this.updateTexCoordsGLBuffers();
	}
}