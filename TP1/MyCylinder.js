class MyCylinder extends CGFobject {
    constructor(scene, bottomRadius, topRadius, height,  slices, stacks) {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;

        for (var i = 0; i < this.slices; i++) {
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa = Math.sin(ang);
            var saa = Math.sin(ang + alphaAng);
            var ca = Math.cos(ang);
            var caa = Math.cos(ang + alphaAng);

            this.vertices.push(ca , 0, -sa );
            this.vertices.push(caa , 0, -saa );
            this.vertices.push(ca , 1, -sa );
            this.vertices.push(caa , 1, -saa );

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

            ang += alphaAng;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}