#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

/*  uniform int selected;  */
uniform sampler2D uSampler;
uniform sampler2D uSampler2;



	
void main() {
	
	vec4 color = texture2D(uSampler, vTextureCoord);
	vec4 color_selected = texture2D(uSampler2, vTextureCoord);
/*   	if(selected==1)
	{   */
		if (color_selected.a!=0.0)
		color =color_selected;
	  /* }   */
	
	gl_FragColor = color;
}



