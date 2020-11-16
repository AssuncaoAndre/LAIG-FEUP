attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform sampler2D uSampler;

uniform float sizeN;
uniform float sizeM;


uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

void main() {
   
	vTextureCoord =vec2(aTextureCoord.x/sizeN,aTextureCoord.y/sizeM);

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

}
