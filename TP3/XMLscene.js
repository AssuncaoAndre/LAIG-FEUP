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

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        this.first_graph=0;
        this.axis = new CGFaxis(this);
        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.are_cameras_inited=0;
        this.prev_camera;
        this.orchestrator=new MyGameOrchestrator(this);
        this.is_camera_moving=0;
        this.defaultAppearance=new CGFappearance(this);
        this.previous_time=0;
        this.previous_time_aux=0;
        this.total_time=0;
        this.first=0;
        this.first_time=0;
        this.difference=0;
        this.sprite_shader=new CGFshader(this.gl,"shaders/sprite_shader.vert","shaders/sprite_shader.frag");
        this.spriteanimations=[];
        this.camera_animation=new MyComputedAnimation();
        this.aux_camera=new CGFcamera(2,0.1,500,[0,0,0],[1,0,0]);
        this.second_aux_camera=new CGFcamera(2,0.1,500,[0,0,0],[1,0,0]);
        this.setPickEnabled(true);
        this.scenes=[];
        this.scene_names=[];
        this.current_scene="default_scene";
        this.changing_scene=0;
    }

    /**
     * Initializes the scene cameras.
     */
    

    //connect to the interface. updates the cameras when the dropdonw menu is changed
    Camerasupdate()
    {

        if(this.is_camera_moving==0)
        {
            this.camera = this.cameras[this.defaultCamera];
            if(this.prev_camera!=this.cameras[this.defaultCamera] &&this.prev_camera!=null)
            {
                this.change_camera();
            }
        }
        else 
        {
            this.update_moving_camera();
            
        }
        this.interface.setActiveCamera(this.camera);

        this.prev_camera=this.cameras[this.defaultCamera];

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

        this.initCameras();

        this.initLights();

        this.Camerasupdate();

        if(this.first_graph==0)
        {
            this.load_scenes();
            this.first_graph=1;
        }

        
        this.interface.create(this.graph);
       
        this.sceneInited = true;
        this.setUpdatePeriod(16);
        


    }

    load_scenes()
    {
        this.scenes["default_scene"]=this.default_scene;
        this.scene_names.push("default_scene");
        for (var i=0;i<this.graph.scenes.length;i++)
        {
            this.scenes[this.graph.scene_names[i]]=this.graph.scenes[i];
            this.scene_names.push(this.graph.scene_names[i]);
        }
        console.log(this.scene_names,this.scenes);

    }

    change_scene(scene)
    {
        this.changing_scene=1;
        new MySceneGraph(this.scenes[scene],this);
        this.current_scene=scene;
        this.orchestrator.on_scene_change();
    }

    initCameras() {

        this.cameras=[];
        this.cameras_name=[];
        this.defaultCamera=this.graph.defaultCamera;
  
        for (var key in this.graph.cameras) {
 

            if (this.graph.cameras.hasOwnProperty(key)) {
                var graphCamera = this.graph.cameras[key];
                this.cameras_name.push(key);
                this.cameras[key]=new CGFcamera(graphCamera.fov,graphCamera.near,graphCamera.far,graphCamera.position,graphCamera.target);
                
            }
        }
        console.log(this.cameras[this.defaultCamera]);
        this.are_cameras_inited=1;
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
        if(this.are_cameras_inited==1)
        {

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
                //this.axis.display();
                
                this.defaultAppearance.apply();
                
                this.Camerasupdate();
                
                // Displays the scene (MySceneGraph function).
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
        this.orchestrator.update(t);
    }

    onWhitePlayerChanged(v) {
        this.orchestrator.setWhitePlayer(v);
    }

    onBlackPlayerChanged(v) {
        this.orchestrator.setBlackPlayer(v);
    }

    reset()
    {
        this.orchestrator.reset();
    }

    movie()
    {
        if(this.orchestrator.move_stack.length==0)
        return;
        this.orchestrator.begin_movie();
        
    }


    change_camera()
    {
        if(this.changing_scene==0)
        {

            this.interface.gui.remove(this.interface.cameras_controller)
       
            this.aux_camera.position={...this.prev_camera.position};
            this.aux_camera.far=this.prev_camera.far;
            this.aux_camera.near=this.prev_camera.near;
            this.aux_camera.fov=this.prev_camera.fov;
            this.aux_camera.target={...this.prev_camera.target};
    
            this.second_aux_camera.position={...this.prev_camera.position};
            this.second_aux_camera.far=this.prev_camera.far;
            this.second_aux_camera.near=this.prev_camera.near;
            this.second_aux_camera.fov=this.prev_camera.fov;
            this.second_aux_camera.target={...this.prev_camera.target};
    
            //this.prev_camera=null;
    
            this.is_camera_moving=1;
    
            var max_height=2;
    
            this.camera_animation=new MyComputedAnimation();
    
            var distance=this.get_distance(this.camera.position,this.aux_camera.position);
            var distance_x = this.camera.position[0]-this.aux_camera.position[0];
            var distance_y = this.camera.position[1]-this.aux_camera.position[1];
            var distance_z = this.camera.position[2]-this.aux_camera.position[2];
            var divisions=distance*60;
    
    
            var increment_x=distance_x/divisions;
            var increment_y=distance_y/divisions;
            var increment_z=distance_z/divisions;
    
    
            for(var i=0;i<divisions;i++)
            {
    
                
                this.camera_animation.trans_vec.push([increment_x,increment_y,increment_z]); 
    
            }
            this.camera=this.second_aux_camera;
        }
    }

    update_moving_camera()
    {
        if(this.camera_animation.current>=this.camera_animation.trans_vec.length-1)
        {
            this.is_camera_moving=0;
            var sumx=0;
            var sumy=0;
            var sumz=0;
            for(var i=0;i<this.camera_animation.trans_vec.length;i++)
            {
                sumx=sumx+this.camera_animation.trans_vec[i][0];
                sumy=sumy+this.camera_animation.trans_vec[i][1];
                sumz=sumz+this.camera_animation.trans_vec[i][2];
            }
            
            this.prev_camera=this.cameras[this.defaultCamera];
            this.interface.setActiveCamera(this.camera);

           this.interface.cameras_controller= this.interface.gui.add(this,'defaultCamera',this.cameras_name).name('Cameras');
        }
        else{
            this.camera.position[0]=this.camera.position[0]+this.camera_animation.trans_vec[this.camera_animation.current][0];
            this.camera.position[1]=this.camera.position[1]+this.camera_animation.trans_vec[this.camera_animation.current][1];
            this.camera.position[2]=this.camera.position[2]+this.camera_animation.trans_vec[this.camera_animation.current][2];
            this.camera_animation.current++;
            //this.interface.setActiveCamera(this.camera);
        }
    }

    get_distance(from,to)
    {
        return Math.sqrt((from[0]-to[0])*(from[0]-to[0])+(from[1]-to[1])*(from[1]-to[1])+(from[2]-to[2])*(from[2]-to[2]))
    }

    quadratic(distance,x)
    {
        var f=(distance/2);
        var d=1/(f*f); //altura/(f*f)
        return (-d*(x-(distance/2))*(x-(distance/2))+1); // no fim é + altura
    }

}
