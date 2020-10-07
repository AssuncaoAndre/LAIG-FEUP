class MyCylinder extends CGFobject {
    constructor(scene,height,bottomRadius,topRadius, stacks, slices) {
        super(scene);
        this.slices = slices;
        this.stacks=stacks;
        this.height=height;
        this.bottomRadius=bottomRadius;
        this.topRadius=topRadius;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var angb = 0;
        var angt=0;
        var alphaAngb = 2 * Math.PI*this.bottomRadius / this.slices;
        var alphaAngt = 2 * Math.PI*this.topRadius/ this.slices;

        for (var i = 0; i < this.slices; i++) {
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa = Math.sin(angb);
            var saa = Math.sin(angb + alphaAngb);
            var ca = Math.cos(angt);
            var caa = Math.cos(angt + alphaAngt);

            this.vertices.push(ca , 0, -sa );
            this.vertices.push(caa , 0, -saa );
            this.vertices.push(ca , this.height, -sa );
            this.vertices.push(caa , this.height, -saa );

            this.normals.push(ca , 0, -sa );
            this.normals.push(caa , 0, -saa );
            this.normals.push(ca , 0, -sa );
            this.normals.push(caa , 0, -saa );

            this.indices.push(4 * i, (4 * i + 1), (4 * i + 2));
            this.indices.push((4 * i + 3), (4 * i + 2), (4 * i + 1));

            this.texCoords.push(1 / this.slices * i, 1);
            this.texCoords.push(1 / this.slices * (i + 1), 1);
            this.texCoords.push(1 / this.slices * i, 0);
            this.texCoords.push(1 / this.slices * (i + 1), 0);

            angb+= alphaAngb;
            angt+= alphaAngt;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}