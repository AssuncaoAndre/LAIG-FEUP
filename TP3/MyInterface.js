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
        
        this.gui.add(graph,'defaultCamera',graph.camerasName).name('Cameras');
        this.gui.add(this.scene.orchestrator,'promotion',this.scene.orchestrator.promotions).name('Promotion');
        
        
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