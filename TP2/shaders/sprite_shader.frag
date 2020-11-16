#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform float n;
uniform float m;
uniform float sizeN;
uniform float sizeM;


uniform sampler2D uSampler;
uniform sampler2D uSampler2;

void main() {
	
	vec4 color = texture2D(uSampler, vTextureCoord+vec2(m/sizeM,n/sizeN));

	gl_FragColor = color ;
}


