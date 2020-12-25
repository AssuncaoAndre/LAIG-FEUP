/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.chess=new Chess();
        this.gameState=this.chess.board();
        this.gameboard=null
        this.sceneInited = false;
        this.is_moving=null;
        this.is_moving2=null;

        this.is_promoting=null;
        this.promotions=['Queen','Rook','Knight','Bishop'];
        this.promotion='Queen';
        this.promotions_map=[];
        this.promotions_map['Queen']='q';
        this.promotions_map['Rook']='r';
        this.promotions_map['Knight']='n';
        this.promotions_map['Bishop']='b';


        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.axis = new CGFaxis(this);
        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);
        this.previous_time=0;
        this.previous_time_aux=0;
        this.total_time=0;
        this.first=0;
        this.first_time=0;
        this.difference=0;
        this.sprite_shader=new CGFshader(this.gl,"shaders/sprite_shader.vert","shaders/sprite_shader.frag");
        this.spriteanimations=[];
        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    //connect to the interface. updates the cameras when the dropdonw menu is changed
    Camerasupdate()
    {
        
        this.camera= this.graph.cameras[this.graph.defaultCamera];
        this.interface.setActiveCamera( this.camera );

    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
       
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);

                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.Camerasupdate();

        this.interface.create(this.graph);
        
        this.sceneInited = true;
        this.setUpdatePeriod(1);
        


    }


    logPicking() {
		if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
                        var customId = this.pickResults[i][1];
                       
                        
                            var letra_n=Math.floor(customId%8);
                            var numero=Math.floor(customId/8+1);
                            var letra=String.fromCharCode("a".charCodeAt(0)+letra_n);
                            var move=letra+numero;
                            if(this.gameboard.is_tile_selected(move)==0)
                            {
                                this.gameboard.current_move=move;
                                var possible_moves=this.chess.moves({square:move, verbose:true});
                                
                                this.gameboard.resetSelection();
                                this.gameboard.selectPossibleMoves(possible_moves);					
                            }
                            else 
                            {
                                var prom=0;
                                var turn=this.chess.turn();
                                this.move_flags=this.chess.move({from: this.gameboard.current_move, to: move });
                                console.log(this.move_flags);
                                if(this.move_flags==null)
                                {
                                    prom=this.promotions_map[this.promotion];
                                    this.chess.move({from: this.gameboard.current_move, to: move, promotion: prom });                              
                                    
                                }
                                this.gameState=this.chess.board();
                                this.gameboard.resetSelection();
                                
                                this.gameboard.move(this.gameboard.current_move, move);
                                
                                if(prom!=0)
                                this.is_promoting=turn;
                                
                                if(this.chess.game_over())
                                alert("game Over");
                            }
                        

					}
				}
				this.pickResults.splice(0, this.pickResults.length);
			}
		}
	}

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        //this.setActiveShader(shader);
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(false);
            this.lights[i].update();
        }
        
        
        if (this.sceneInited) {
            // Draw axis
            this.axis.display();
            
            this.defaultAppearance.apply();
            
            this.Camerasupdate();
            
            // Displays the scene (MySceneGraph function).
          /*   if(this.asking_promotion==1)
            {
            }
            */
           this.graph.displayScene();
          
            
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);

            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
       
     
    }
    update(t)
    {
        if(this.first==0)
        {
            this.first=1;
            this.first_time=t;
            this.difference=0;
        }
        else this.difference=t-this.previous_time;
        this.total_time=t-this.first_time;
        
        this.previous_time=t;
        this.graph.update(this.difference,this.total_time/1000);
        for (var i=0;i<this.spriteanimations.length;i++)
        {
            this.spriteanimations[i].update(t);
        }

        if(this.is_moving!=null)
        {
            if(this.is_moving[4]==null)
            {
                if(this.gameboard.matrix[this.is_moving[0]][this.is_moving[1]].piece.update(t)==1)
                this.gameboard.stop_move();

            }
            else{
                var aux_to_coords=[this.is_moving[2],this.is_moving[3]];
                if(this.move_flags.flags=="e")
                {
                    
                    if(this.move_flags.color=="w")
                    {
                        aux_to_coords[0]=aux_to_coords[0]-1;                       
                    }
                    else aux_to_coords[0]=aux_to_coords[0]+1;
                }

                if(this.gameboard.matrix[aux_to_coords[0]][aux_to_coords[1]].piece.update(t)==1)
                this.gameboard.stop_move();
            }
        }
        
    }

    
}

