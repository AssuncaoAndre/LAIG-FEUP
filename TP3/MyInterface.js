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
        var light=this.gui.addFolder('lights');
        
        
        for (var key in graph.lights) {
            light.add(this.scene.lights[i], 'enabled').name(key);
            i++;
        }
        
        this.gui.add(this.scene,'defaultCamera',this.scene.cameras_name).name('Cameras');
        this.gui.add(this.scene.orchestrator,'promotion',this.scene.orchestrator.promotions).name('Promotion');
        this.gui.add(this.scene.orchestrator,'evaluation_on',this.scene.orchestrator.evaluation_on).name('Evaluation');

        this.gui.add(this.scene,"reset").name("Reset");

        this.gui.add(this.scene.orchestrator,'white_player',this.scene.orchestrator.players).name('White Player').onChange(this.scene.onWhitePlayerChanged.bind(this.scene));
        this.gui.add(this.scene.orchestrator,'black_player',this.scene.orchestrator.players).name('Black Player').onChange(this.scene.onBlackPlayerChanged.bind(this.scene));
        
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