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
    vTextureCoord = aTextureCoord;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

}
