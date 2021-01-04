/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.lights_interface=[];
        this.first_graph=0
        this.initKeys();

        return true;
    }

    //creates lights and camera interface after the scene graph is created
    /**
     * @method interface_create
     * @param  {Graph} graph - Scene Graph
     */
    create(graph)
    { 
        var i=0;
        if(this.first_graph==0)
        {
            this.first_graph=1;
        }
        else 
        {
            this.gui.destroy();
            this.gui = new dat.GUI();
        }

        this.lights_folder=this.gui.addFolder('lights');

        for (var key in graph.lights) {
            this.lights_interface.push(this.lights_folder.add(this.scene.lights[i], 'enabled').name(key));
            i++;
        }
        
        this.cameras_controller=this.gui.add(this.scene,'defaultCamera',this.scene.cameras_name).name('Cameras');
        this.scenes_interface=this.gui.add(this.scene, "current_scene", this.scene.scene_names).name("Scene").onChange(this.scene.change_scene.bind(this.scene));
        
        this.white_player_interface=this.gui.add(this.scene.orchestrator,'white_player',this.scene.orchestrator.players).name('White Player').onChange(this.scene.onWhitePlayerChanged.bind(this.scene));
        this.black_player_interface=this.gui.add(this.scene.orchestrator,'black_player',this.scene.orchestrator.players).name('Black Player').onChange(this.scene.onBlackPlayerChanged.bind(this.scene));
        this.promotion_interface=this.gui.add(this.scene.orchestrator,'promotion',this.scene.orchestrator.promotions).name('Promotion');
        this.time_interface=this.gui.add(this.scene.orchestrator,'time_per_play',10,600).name('Time Per Play').step(1);
        
        this.reset_interface=this.gui.add(this.scene,"reset").name("Reset");
        this.movie_interface=this.gui.add(this.scene,"movie").name("Movie");
        this.undo_interface=this.gui.add(this.scene,"undo").name("Undo");
        this.scene.changing_scene=0;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}