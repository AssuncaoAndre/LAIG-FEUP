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
        this.vertices = [
            this.x1,this.y1,0, //0
            this.x2,this.y2,0, //1
            this.x3,this.y3,0, //2

        ];

        //Counter-clockwise reference of vertices
        this.indices = [0, 1, 2];



        this.normals = [];
        for (var i = 0; i < 3; i++) {
            this.normals.push(0, 0, 1);
        }



        this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
		]
        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}