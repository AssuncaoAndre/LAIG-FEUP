
class LightingScene extends CGFscene
{
	init(application)
	{
		super.init(application);

		this.initCameras();

		this.initLights();

		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.axis = new CGFaxis(this);

		// Scene elements
		this.texture=new CGFtexture(this, "models/madeira_texture.jpg");
		this.pawn = new CGFOBJModel(this, 'models/Pawn.obj');
		this.king = new CGFOBJModel(this, 'models/King.obj');
		this.bishop = new CGFOBJModel(this, 'models/Bishop.obj');
		this.knight = new CGFOBJModel(this, 'models/Knight.obj');
		this.rook = new CGFOBJModel(this, 'models/Rook.obj');
		this.queen = new CGFOBJModel(this, 'models/Queen.obj');

	
		// Materials
		this.material = new CGFappearance(this);
		
		this.enableTextures(true);

	};

	initCameras() {
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 15, 30), vec3.fromValues(0, 5, 0));
	};

	initLights() {
		this.setGlobalAmbientLight(0, 0 ,0, 1);

		var height = 50;
		var spread = 10;

		this.lights[0].setPosition(spread, height, spread, 1);
		this.lights[0].setAmbient(0, 0, 0, 1);
		this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[0].setSpecular(1.0, 1.0, 1.0, 1.0);
		this.lights[0].enable();

		this.lights[1].setPosition(spread, height, -spread, 1.0);
		this.lights[1].setAmbient(0, 0, 0, 1);
		this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[1].setSpecular(1.0, 1.0, 1.0, 1.0);
		this.lights[1].enable();

		this.lights[2].setPosition(-spread, height, -spread, 1.0);
		this.lights[2].setAmbient(0, 0, 0, 1);
		this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[2].setSpecular(1.0, 1.0, 1.0, 1.0);
		this.lights[2].enable();

		this.lights[3].setPosition(-spread, height, spread, 1.0);
		this.lights[3].setAmbient(0, 0, 0, 1);
		this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[3].setSpecular(1.0, 1.0, 1.0, 1.0);
		this.lights[3].enable();

	};

	updateLights() {
		for (var i = 0; i < this.lights.length; i++)
			this.lights[i].update();
	};

	display() {

		// ---- BEGIN Background, camera and axis setup

		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Initialize Model-View matrix as identity (no transformation)
		this.updateProjectionMatrix();
		this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		// Update all lights used
		this.updateLights();

		// Draw axis
		this.axis.display();

		this.material.apply();
		this.texture.bind();
		// ---- END Background, camera and axis setup
		
		
		// ---- BEGIN Primitive drawing section
		
		// suzanne
		/*  		this.pushMatrix();
		
		this.translate(5, 5, 0);

		this.suzanne.display();

		this.popMatrix();
		

		// male
		this.pushMatrix();

		this.scale(0.5, 0.5, 0.5);
		
		this.male.display();
		
		this.popMatrix();

		
		// navigator
		this.pushMatrix();
		
		this.translate(-10, 0, 0);
		this.scale(2, 2, 2);
		this.translate(0, 3, 0);
		this.rotate(-Math.PI/2, 1, 0, 0);
		
		this.navigator.display();
		
		this.popMatrix();  */
		
		
		
		this.texture.bind(0);
		this.bishop.display();
	


		// ---- END Primitive drawing section

	};
};
