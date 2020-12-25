attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;


uniform float sizeC;
uniform float sizeL;
uniform float linha;
uniform float coluna;


uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

void main() {
//vTextureCoord = aTextureCoord;
	vTextureCoord =vec2(aTextureCoord.x/sizeC+coluna/sizeC,aTextureCoord.y/sizeL+linha/sizeL);

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

}
