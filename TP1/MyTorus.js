class MyTorus extends CGFobject {
    constructor(scene, innerRadius, outerRadius, slices, loops) {
        super(scene);
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.slices = slices;
        this.loops = loops;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (var slice = 0; slice <= this.slices; slice++) {
          var v = slice / this.slices;
          var ang = v * 2 * Math.PI;
          var cos_slices = Math.cos(ang);
          var sin_slices = Math.sin(ang);
          var sliceRadius = this.outerRadius + this.innerRadius * cos_slices;

          for (var loop = 0; loop <= this.loops; loop++) {
            var u = loop / this.loops;
            var loop_angle = u * 2 * Math.PI;
            var cos_loops = Math.cos(loop_angle);
            var sin_loops = Math.sin(loop_angle);

            var x = sliceRadius * cos_loops;
            var y = sliceRadius * sin_loops;
            var z = this.innerRadius * sin_slices;

            this.vertices.push(x, y, z);
            this.normals.push(x,y,z);


            this.texCoords.push(u);
              this.texCoords.push(v);
          }
        }

        var vertsPerSlice = this.loops + 1;
        for (var i = 0; i < this.slices; ++i) {
          var v1 = i * vertsPerSlice;
          var v2 = v1 + vertsPerSlice;

          for (var j = 0; j < this.loops; ++j) {

            this.indices.push(v1);
            this.indices.push(v1 + 1);
            this.indices.push(v2);

            this.indices.push(v2);
            this.indices.push(v1 + 1);
            this.indices.push(v2 + 1);

            v1 += 1;
            v2 += 1;
          }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
