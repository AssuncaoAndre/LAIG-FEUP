const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var SCENES_INDEX = 7;
var ANIMATIONS_INDEX = 8;
var NODES_INDEX = 8;
var NODES_INDEX_ANIMATIONS = 9;




/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {

  /**
   * Constructor for MySceneGraph class.
   * Initializes necessary variables and starts the XML file reading process.
   * @param {string} filename - File that defines the 3D scene
   * @param {XMLScene} scene
   */
  constructor(filename, scene) {
    this.loadedOk = null;
   
    // Establish bidirectional references between scene and graph.
    this.scene = scene;
    this.scene.graph = this;

    this.scenes=[];
    this.scene_names=[]
    this.nodes = [];

    this.idRoot = null; // The id of the root element.

    this.axisCoords = [];
    this.axisCoords["x"] = [1, 0, 0];
    this.axisCoords["y"] = [0, 1, 0];
    this.axisCoords["z"] = [0, 0, 1];
    this.defaultCamera;
    // File reading
    this.reader = new CGFXMLreader();
    this.gameboard_count=0;

    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */
    this.reader.open("scenes/" + filename, this);
  }

  /*
   * Callback to be executed after successful reading
   */
  onXMLReady() {
    this.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseXMLFile(rootElement);

    if (error != null) {
      this.onXMLError(error);
      return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
  
  }

  /*
   * Callback to be executed on any read error, showing an error on the console.
   * @param {string} message
   */
  onXMLError(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
  }

  /**
   * Callback to be executed on any minor error, showing a warning on the console.
   * @param {string} message
   */
  onXMLMinorError(message) {
    console.warn("Warning: " + message);
  }

  /**
   * Callback to be executed on any message.
   * @param {string} message
   */
  log(message) {
    console.log("   " + message);
  }

  /**
   * Parses the XML file, processing each block.
   * @param {XML root element} rootElement
   */
  parseXMLFile(rootElement) {
    if (rootElement.nodeName != "lsf") return "root tag <lsf> missing";

    var nodes = rootElement.children;

    // Reads the names of the nodes to an auxiliary buffer.
    var nodeNames = [];

    for (var i = 0; i < nodes.length; i++) {
      nodeNames.push(nodes[i].nodeName);
    }

    var error;

    // Processes each node, verifying errors.

    // <initials>
    var index;
    if ((index = nodeNames.indexOf("initials")) == -1)
      return "tag <initials> missing";
    else {
      if (index != INITIALS_INDEX)
        this.onXMLMinorError("tag <initials> out of order " + index);

      //Parse initials block
      if ((error = this.parseInitials(nodes[index])) != null) return error;
    }

    // <views>
    if ((index = nodeNames.indexOf("views")) == -1)
      return "tag <views> missing";
    else {
      if (index != VIEWS_INDEX)
        this.onXMLMinorError("tag <views> out of order");

      //Parse views block
      if ((error = this.parseViews(nodes[index])) != null) return error;
    }

    // <illumination>
    if ((index = nodeNames.indexOf("illumination")) == -1)
      return "tag <illumination> missing";
    else {
      if (index != ILLUMINATION_INDEX)
        this.onXMLMinorError("tag <illumination> out of order");

      //Parse illumination block
      if ((error = this.parseIllumination(nodes[index])) != null) return error;
    }

    // <lights>
    if ((index = nodeNames.indexOf("lights")) == -1)
      return "tag <lights> missing";
    else {
      if (index != LIGHTS_INDEX)
        this.onXMLMinorError("tag <lights> out of order");

      //Parse lights block
      if ((error = this.parseLights(nodes[index])) != null) return error;
    }
    // <textures>
    if ((index = nodeNames.indexOf("textures")) == -1)
      return "tag <textures> missing";
    else {
      if (index != TEXTURES_INDEX)
        this.onXMLMinorError("tag <textures> out of order");

      //Parse textures block
      if ((error = this.parseTextures(nodes[index])) != null) return error;
    }

    if ((index = nodeNames.indexOf("spritesheets")) == -1)
      return "tag <spritesheets> missing";
    else {
      if (index != SPRITESHEETS_INDEX)
        this.onXMLMinorError("tag <spritesheets> out of order");

      //Parse textures block
      if ((error = this.parseSpritesheets(nodes[index])) != null) return error;
    }

    // <materials>
    if ((index = nodeNames.indexOf("materials")) == -1)
      return "tag <materials> missing";
    else {
      if (index != MATERIALS_INDEX)
        this.onXMLMinorError("tag <materials> out of order");

      //Parse materials block
      if ((error = this.parseMaterials(nodes[index])) != null) return error;
    }

    if (nodeNames.indexOf("scenes") != -1)
    {
      index=nodeNames.indexOf("scenes");
      if (index != SCENES_INDEX)
        this.onXMLMinorError("tag <scenes> out of order");

        if ((error = this.parseScenes(nodes[index])) != null) return error;

    }
    
    var animations_enabled=0;
    //animations
    if (nodeNames.indexOf("animations") != -1)
    {
      index=nodeNames.indexOf("animations");
      animations_enabled=1;
      if (index != ANIMATIONS_INDEX)
        this.onXMLMinorError("tag <animations> out of order");
    }

    //Parse materials block
    if ((error = this.parseAnimations(nodes[index])) != null) return error;


    // <nodes>
    if ((index = nodeNames.indexOf("nodes")) == -1)
      return "tag <nodes> missing";
    else {
      if (index != NODES_INDEX_ANIMATIONS && animations_enabled)
        this.onXMLMinorError("tag <nodes> out of order");
      else if(index != NODES_INDEX && !animations_enabled)
        this.onXMLMinorError("tag <nodes> out of order");
      //Parse nodes block
      if ((error = this.parseNodes(nodes[index])) != null) return error;
    }
    this.log("all parsed");
  }

  /**
   * Parses the <initials> block.
   * @param {initials block element} initialsNode
   */
  parseInitials(initialsNode) {
    var children = initialsNode.children;
    var nodeNames = [];

    for (var i = 0; i < children.length; i++)
      nodeNames.push(children[i].nodeName);

    var rootIndex = nodeNames.indexOf("root");
    var referenceIndex = nodeNames.indexOf("reference");

    // Get root of the scene.
    if (rootIndex == -1) return "No root id defined for scene.";

    var rootNode = children[rootIndex];
    var id = this.reader.getString(rootNode, "id");
    if (id == null) return "No root id defined for scene.";

    this.idRoot = id;

    // Get axis length
    if (referenceIndex == -1)
      this.onXMLMinorError(
        "no axis_length defined for scene; assuming 'length = 1'"
      );

    var refNode = children[referenceIndex];
    var axis_length = this.reader.getFloat(refNode, "length");
    if (axis_length == null)
      this.onXMLMinorError(
        "no axis_length defined for scene; assuming 'length = 1'"
      );

    this.referenceLength = axis_length || 1;

    this.log("Parsed initials");

    return null;
  }

  /**
   * Parses the <views> block.
   * @param {view block element} viewsNode
   */
  parseViews(viewsNode) {
    this.cameras=[];
    this.camerasName=[];
    var camerasNo=0;
    var def_set=false;
    this.defaultCamera = viewsNode.getAttribute("default");
    for (var i = 0; i < viewsNode.children.length; i++) {

      if (viewsNode.children[i].nodeName == "perspective") {

        var cameraID = viewsNode.children[i].getAttribute("id");
        var near = parseFloat(viewsNode.children[i].getAttribute("near"));
        var far = parseFloat(viewsNode.children[i].getAttribute("far"));
        var angle = parseFloat(viewsNode.children[i].getAttribute("angle"));
        if(viewsNode.children[i].children.length!=2)
        this.onXMLError("Perspective declaration has a invalid number of children");

        for (var j = 0; j < viewsNode.children[i].children.length; j++) {

          if (viewsNode.children[i].children[j].nodeName == "from")
          {

            var from_x = parseFloat(viewsNode.children[i].children[j].getAttribute("x"));
            var from_y = parseFloat(viewsNode.children[i].children[j].getAttribute("y"));
            var from_z = parseFloat(viewsNode.children[i].children[j].getAttribute("z"));

          }
          else if (viewsNode.children[i].children[j].nodeName == "to")
          {
            var to_x = parseFloat(viewsNode.children[i].children[j].getAttribute("x"));
            var to_y = parseFloat(viewsNode.children[i].children[j].getAttribute("y"));
            var to_z = parseFloat(viewsNode.children[i].children[j].getAttribute("z"));
          }
          else this.onXMLMinorError("Unknown perspective child "+viewsNode.children[i].children[j].nodeName+".Skipping");
        }

        var camera = new CGFcamera(angle,near,far,[from_x,from_y,from_z],[to_x,to_y,to_z]);
        if(cameraID==this.defaultCamera)
        def_set=true;
        this.cameras[cameraID] = camera;
        this.camerasName[camerasNo]=cameraID;
        camerasNo++;
      }
      if (viewsNode.children[i].nodeName == "ortho") {

        var cameraID = viewsNode.children[i].getAttribute("id");
        var near = parseFloat(viewsNode.children[i].getAttribute("near"));
        var far = parseFloat(viewsNode.children[i].getAttribute("far"));
        var left = parseFloat(viewsNode.children[i].getAttribute("left"));
        var right = parseFloat(viewsNode.children[i].getAttribute("right"));
        var top = parseFloat(viewsNode.children[i].getAttribute("top"));
        var bottom = parseFloat(viewsNode.children[i].getAttribute("bottom"));
        if(viewsNode.children[i].children.length!=3)
        this.onXMLError("Perspective declaration has a invalid number of children");

        for (var j = 0; j < viewsNode.children[i].children.length; j++) {

          if (viewsNode.children[i].children[j].nodeName == "from")
          {

            var from_x = parseFloat(viewsNode.children[i].children[j].getAttribute("x"));
            var from_y = parseFloat(viewsNode.children[i].children[j].getAttribute("y"));
            var from_z = parseFloat(viewsNode.children[i].children[j].getAttribute("z"));

          }
          else if (viewsNode.children[i].children[j].nodeName == "to")
          {
            var to_x = parseFloat(viewsNode.children[i].children[j].getAttribute("x"));
            var to_y = parseFloat(viewsNode.children[i].children[j].getAttribute("y"));
            var to_z = parseFloat(viewsNode.children[i].children[j].getAttribute("z"));
          }
          else if (viewsNode.children[i].children[j].nodeName == "up")
          {
            var up_x = parseFloat(viewsNode.children[i].children[j].getAttribute("x"));
            var up_y = parseFloat(viewsNode.children[i].children[j].getAttribute("y"));
            var up_z = parseFloat(viewsNode.children[i].children[j].getAttribute("z"));
          }
          else this.onXMLMinorError("Unknown ortho child "+ viewsNode.children[i].children[j].nodeName+".Skipping");
        }
        
        var camera = new CGFcameraOrtho(left,right,bottom,top,near,far,[from_x,from_y,from_z],[to_x,to_y,to_z],[up_x,up_y,up_z]);
        if(cameraID==this.defaultCamera)
        def_set=true;
        this.camerasName[camerasNo]=cameraID;
        this.cameras[cameraID] = camera;
        camerasNo++;
      }
    }
    if(def_set==false)
    {
      this.onXMLMinorError("Default view not defined. Assuming first instance of camera");
      this.defaultCamera=viewsNode.children[0].cameraID;
    }


    return null;
  }

  /**
   * Parses the <illumination> node.
   * @param {illumination block element} illuminationsNode
   */
  parseIllumination(illuminationsNode) {
    var children = illuminationsNode.children;

    this.ambient = [];
    this.background = [];

    var nodeNames = [];

    for (var i = 0; i < children.length; i++)
      nodeNames.push(children[i].nodeName);

    var ambientIndex = nodeNames.indexOf("ambient");
    var backgroundIndex = nodeNames.indexOf("background");

    var color = this.parseColor(children[ambientIndex], "ambient");
    if (!Array.isArray(color)) return color;
    else this.ambient = color;

    color = this.parseColor(children[backgroundIndex], "background");
    if (!Array.isArray(color)) return color;
    else this.background = color;

    this.log("Parsed Illumination.");

    return null;
  }

  /**
   * Parses the <light> node.
   * @param {lights block element} lightsNode
   */
  parseLights(lightsNode) {
    var children = lightsNode.children;

    this.lights = [];
    var numLights = 0;

    var grandChildren = [];
    var nodeNames = [];

    // Any number of lights.
    for (var i = 0; i < children.length; i++) {
      // Storing light information
      var global = [];
      var attributeNames = [];
      var attributeTypes = [];

      //Check type of light
      if (children[i].nodeName != "light") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      } else {
        attributeNames.push(
          ...["enable", "position", "ambient", "diffuse", "specular"]
        );
        attributeTypes.push(
          ...["boolean", "position", "color", "color", "color"]
        );
      }

      // Get id of the current light.
      var lightId = this.reader.getString(children[i], "id");
      if (lightId == null) return "no ID defined for light";

      // Checks for repeated IDs.
      if (this.lights[lightId] != null)
        return (
          "ID must be unique for each light (conflict: ID = " + lightId + ")"
        );

      grandChildren = children[i].children;
      // Specifications for the current light.

      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      for (var j = 0; j < attributeNames.length; j++) {
        var attributeIndex = nodeNames.indexOf(attributeNames[j]);

        if (attributeIndex != -1) {
          if (attributeTypes[j] == "boolean")
            var aux = this.parseBoolean(
              grandChildren[attributeIndex],
              "value",
              "enabled attribute for light of ID" + lightId
            );
          else if (attributeTypes[j] == "position")
            var aux = this.parseCoordinates4D(
              grandChildren[attributeIndex],
              "light position for ID" + lightId
            );
          else
            var aux = this.parseColor(
              grandChildren[attributeIndex],
              attributeNames[j] + " illumination for ID" + lightId
            );

          if (typeof aux === "string") return aux;

          global.push(aux);
        } else
          return (
            "light " + attributeNames[i] + " undefined for ID = " + lightId
          );
      }
      this.lights[lightId] = global;

      numLights++;
    }

    if (numLights == 0) return "at least one light must be defined";
    else if (numLights > 8)
      this.onXMLMinorError(
        "too many lights defined; WebGL imposes a limit of 8 lights"
      );

    this.log("Parsed lights");
    return null;
  }

  fileExists(url) {
    if(url){
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send();
        return request.status==200;
    } else {
        return false;
    }
  }

  /**
   * Parses the <textures> block.
   * @param {textures block element} texturesNode
   */
  parseTextures(texturesNode) {
    var children = texturesNode.children;

    this.textures = [];

    var texturesNo = 0;

    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != "texture") {
        this.onXMLMinorError("unknwon tag <" + children[i].nodeName + ">");
        continue;
      }

      var textureID = this.reader.getString(children[i], "id");

      // Get id of the current texture.
      if (textureID == null) return "no ID defined for texture";

      // Checks for repeated IDs.
      if (this.textures[textureID] != null)
        return (
          "ID must be unique for each texture (conflict: ID = " +
          textureID +
          ")"
        );

      // Checks path od the current texture.
      var path = children[i].getAttribute("path");
      if (path == null) return "no Path defined for texture";

      // check if directory exists
      if(!this.fileExists(path))
        this.onXMLMinorError(path + " file doesn't exist");

      var texture = new CGFtexture(this.scene, path);
      this.textures[textureID] = texture;

      texturesNo++;
    }

    // Checks if there is at least one texture block
    if (texturesNo <= 0) return "at least one texture block must be defined";

    this.log("Parsed textures");

    return null;
  }

/**
   * Parses the <spritesheets> block.
   * @param {spritesheets block element} spritesheetsNode
   */
  parseSpritesheets(spritesheetsNode) {
    var children = spritesheetsNode.children;

    this.spritesheets = [];

    var spritesheetsNo = 0;

    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != "spritesheet") {
        this.onXMLMinorError("unknwon tag <" + children[i].nodeName + ">");
        continue;
      }

      var spritesheetID = this.reader.getString(children[i], "id");

      // Get id of the current spritesheet.
      if (spritesheetID == null) return "no ID defined for spritesheet";

      // Checks for repeated IDs.
      if (this.spritesheets[spritesheetID] != null)
        return (
          "ID must be unique for each spritesheet (conflict: ID = " +
          spritesheetID +
          ")"
        );

      // Checks path od the current spritesheet.
      var path = children[i].getAttribute("path");
      if (path == null) return "no Path defined for spritesheet";

      // check if directory exists
      if(!this.fileExists(path))
        this.onXMLMinorError(path + " file doesn't exist");

        var sizeM = parseFloat(this.reader.getString(children[i], "sizeM"));
        var sizeN = parseFloat(this.reader.getString(children[i], "sizeN"));

      var spritesheet = new MySpritesheet(this.scene, path,sizeM,sizeN);
     
      
      this.spritesheets[spritesheetID] = spritesheet;

      spritesheetsNo++;
    }

    // Checks if there is at least one texture block
    if (spritesheetsNo <= 0) return "at least one texture block must be defined";

    this.log("Parsed textures");

    return null;
  }



  /**
   * Parses the <materials> node.
   * @param {materials block element} materialsNode
   */
  parseMaterials(materialsNode) {
    var children = materialsNode.children;

    this.materials = [];

    var grandChildren = [];
    

    var materialsNo = 0;

    // Any number of materials.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != "material") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      }

      // Get id of the current material.
      var materialID = this.reader.getString(children[i], "id");
      if (materialID == null) return "no ID defined for material";

      // Checks for repeated IDs.
      if (this.materials[materialID] != null)
        return (
          "ID must be unique for each material (conflict: ID = " +
          materialID +
          ")"
        );

      grandChildren = children[i].children;
      var shininess = null;
      var ambient = null;
      var diffuse = null;
      var specular = null;
      var emissive = null;

      for (var j = 0; j < grandChildren.length; j++) {
        if (grandChildren[j].nodeName == "shininess")
          shininess = parseFloat(grandChildren[j].getAttribute("value"));

        if (grandChildren[j].nodeName == "ambient") {
          ambient = [
            parseFloat(grandChildren[j].getAttribute("r")),
            parseFloat(grandChildren[j].getAttribute("g")),
            parseFloat(grandChildren[j].getAttribute("b")),
            parseFloat(grandChildren[j].getAttribute("a")),
          ];
        }

        if (grandChildren[j].nodeName == "diffuse")
          diffuse = [
            parseFloat(grandChildren[j].getAttribute("r")),
            parseFloat(grandChildren[j].getAttribute("g")),
            parseFloat(grandChildren[j].getAttribute("b")),
            parseFloat(grandChildren[j].getAttribute("a")),
          ];

        if (grandChildren[j].nodeName == "specular")
          specular = [
            parseFloat(grandChildren[j].getAttribute("r")),
            parseFloat(grandChildren[j].getAttribute("g")),
            parseFloat(grandChildren[j].getAttribute("b")),
            parseFloat(grandChildren[j].getAttribute("a")),
          ];

        if (grandChildren[j].nodeName == "emissive")
          emissive = [
            parseFloat(grandChildren[j].getAttribute("r")),
            parseFloat(grandChildren[j].getAttribute("g")),
            parseFloat(grandChildren[j].getAttribute("b")),
            parseFloat(grandChildren[j].getAttribute("a")),
          ];
      }

      var matError = null;

      if (shininess == null)
        return (
          "shininess must be defined for each material (conflict: ID = " +
          materialID +
          ")"
        );

      if (ambient == null)
        return (
          "ambient must be defined for each material (conflict: ID = " +
          materialID +
          ")"
        );

      matError = this.checkRGBA(ambient[0], ambient[1], ambient[2], ambient[3]);
      if (matError != null)
        return matError + " (conflict: ID = " + materialID + " -> ambient)";

      if (diffuse == null)
        return (
          "diffuse must be defined for each material (conflict: ID = " +
          materialID +
          ")"
        );

      matError = this.checkRGBA(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
      if (matError != null)
        return matError + " (conflict: ID = " + materialID + " -> diffuse)";

      if (specular == null)
        return (
          "specular must be defined for each material (conflict: ID = " +
          materialID +
          ")"
        );

      matError = this.checkRGBA(
        specular[0],
        specular[1],
        specular[2],
        specular[3]
      );
      if (matError != null)
        return matError + " (conflict: ID = " + materialID + " -> specular)";

      if (emissive == null)
        return (
          "emissive must be defined for each material (conflict: ID = " +
          materialID +
          ")"
        );

      matError = this.checkRGBA(
        emissive[0],
        emissive[1],
        emissive[2],
        emissive[3]
      );
      if (matError != null)
        return matError + " (conflict: ID = " + materialID + " -> emissive)";

      // Create material.
      var material = new CGFappearance(this.scene);
      material.setShininess(shininess);
      material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
      material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
      material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
      material.setEmission(emissive[0], emissive[1], emissive[2], emissive[3]);
      this.materials[materialID] = material;
      materialsNo++;
    }

    // Checks if there is at least one material block
    if (materialsNo <= 0) return "at least one material block must be defined";

    this.log("Parsed materials");

    return null;
  }

  checkRGBA(r, g, b, a) {
    if (r < 0 || r > 1 || isNaN(r))
      return "r of rgba must be a value between 0 and 1";

    if (g < 0 || g > 1 || isNaN(g))
      return "g of rgba must be a value between 0 and 1";

    if (b < 0 || b > 1 || isNaN(b))
      return "b of rgba must be a value between 0 and 1";

    if (a < 0 || a > 1 || isNaN(a))
      return "a of rgba must be a value between 0 and 1";

    return null;
  }

    /**
   * Parses the <scenes> block.
   * @param {scenes block element} nodesNode
   */

  parseScenes(scenesNode) {
    var children = scenesNode.children;

   // console.log(children)
    for (var i = 0; i < children.length; i++) {


    if (children[i].nodeName != "scene") {
      this.onXMLMinorError("unknwon tag <" + children[i].nodeName + ">");
      continue;
    }

      var name = children[i].getAttribute("name");
      var file = children[i].getAttribute("file");
      if(!this.fileExists("./scenes/"+file))
      this.onXMLError("No such file " + scene);
      this.scenes.push(file);
      this.scene_names.push(name);

    }
    this.log("Parsed Scenes.");
    return null;
  } 

    /**
   * Parses the <animations> block.
   * @param {animations block element} nodesNode
   */
  parseAnimations(AnimationsNode) {
    var children = AnimationsNode.children;

    this.animations = [];
    
    var animationsNo = 0;
    for (var i = 0; i < children.length; i++) {
      var grandChildren = children[i].children;
      if (children[i].nodeName != "animation") {
        this.onXMLMinorError("unknwon tag <" + children[i].nodeName + ">");
        continue;
      }

      var animationID = this.reader.getString(children[i], "id");

      // Get id of the current texture.
      if (animationID == null) return "no ID defined for animation";

      // Checks for repeated IDs.
      if (this.animations[animationID] != null)
        return (
          "ID must be unique for each animation (conflict: ID = " +
          animationID +
          ")"
        );
        
        this.animations[animationID] = new MyAnimation(animationID);
        for (var j = 0; j < children[i].children.length; j++) {
          if (grandChildren[j].nodeName == "keyframe")
          {
            //console.log("keyframe");
            var instant = parseFloat(grandChildren[j].getAttribute("instant"));
            this.animations[animationID].instants.push(instant);

            for (var k = 0; k < grandChildren[j].children.length; k++) {
              var transformMatrix = mat4.create();
              mat4.identity(transformMatrix);
              if (grandChildren[j].children[k].nodeName == "translation")
              {
                var x = parseFloat(grandChildren[j].children[k].getAttribute("x"));
                var y = parseFloat(grandChildren[j].children[k].getAttribute("y"));
                var z = parseFloat(grandChildren[j].children[k].getAttribute("z"));
                //to do: check values
/*                 mat4.translate(
                  transformMatrix,
                  transformMatrix,
                  [x, y, z]
                ); */
                var vec_trans=[x,y,z];
                this.animations[animationID].trans_vec.push(vec_trans);
                this.animations[animationID].current_trans_vec.push([0,0,0]);

                
                //console.log("translaction"+transformMatrix);
              }
              if (grandChildren[j].children[k].nodeName == "rotation")
              {
                var axis = grandChildren[j].children[k].getAttribute("axis");
                var angle = parseFloat(grandChildren[j].children[k].getAttribute("angle"));

                //to do: check values
/*                 mat4.rotate(
                  transformMatrix,
                  transformMatrix,
                  angle * DEGREE_TO_RAD,
                  [axis=="x"? 1 : 0, axis=="y"? 1 : 0, axis=="z"? 1 : 0]
                ); */
                var vec_rot=[axis=="x"? 1 : 0, axis=="y"? 1 : 0, axis=="z"? 1 : 0];
                this.animations[animationID].rot_vec.push(vec_rot);
                this.animations[animationID].angles.push(angle* DEGREE_TO_RAD);
                this.animations[animationID].current_angles.push(0);
              }

              if (grandChildren[j].children[k].nodeName == "scale")
              {
                var sx = parseFloat(grandChildren[j].children[k].getAttribute("sx"));
                var sy = parseFloat(grandChildren[j].children[k].getAttribute("sy"));
                var sz = parseFloat(grandChildren[j].children[k].getAttribute("sz"));
                //to do: check values
                var vec_scale=[sx, sy, sz];
                this.animations[animationID].scale_vec.push(vec_scale);
                this.animations[animationID].current_scale_vec.push([1,1,1]);
                //console.log("scale"+transformMatrix);
              }
            }
            //console.log(transformMatrix);
            

          }
      
          }



      animationsNo++;
    }

    // Checks if there is at least one texture block
    //if (animationsNo <= 0) return "at least one texture block must be defined";

    this.log("Parsed textures");

    return null;
  }


  /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
    var children = nodesNode.children;

    this.nodes = [];

    var grandChildren = [];
    
    var nodeNames = [];

    // Any number of nodes.
    for (var i = 0; i < children.length; i++) {
      //this.log(nodesNode.children[i].id);
      if (children[i].nodeName != "node") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      }

      // Get id of the current node.
      var nodeID = this.reader.getString(children[i], "id");

      if (nodeID == null) return "no ID defined for nodeID";

      this.nodes[nodeID] = MyNode(nodeID);
      // Checks for repeated IDs.
      if (this.nodes[nodeID] != null)
        return (
          "ID must be unique for each node (conflict: ID = " + nodeID + ")"
        );

      grandChildren = children[i].children;
      this.nodes[nodeID] = new MyNode(nodeID);

      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      var transformationsIndex = nodeNames.indexOf("transformations");
      var materialIndex = nodeNames.indexOf("material");
      var textureIndex = nodeNames.indexOf("texture");
      var descendantsIndex = nodeNames.indexOf("descendants");

      // Transformations

  
      var transformationsNode = grandChildren[transformationsIndex].children;

      for (var j = 0; j < transformationsNode.length; j++) {
        if (transformationsNode[j].nodeName == "translation") {
          var x = parseFloat(transformationsNode[j].getAttribute("x"));
          var y = parseFloat(transformationsNode[j].getAttribute("y"));
          var z = parseFloat(transformationsNode[j].getAttribute("z"));

          //to do assume default values
          if (x == null || y == null || z == null) {
            this.onXMLMinorError("No values for translation, skiping");
            continue;
          } else if (isNaN(x) || isNaN(y) || isNaN(z)) {
            this.onXMLMinorError("Non numeric values for trasnlation, skiping");
            continue;
          }
          mat4.translate(
            this.nodes[nodeID].transformMatrix,
            this.nodes[nodeID].transformMatrix,
            [x, y, z]
          );
        }

        if (transformationsNode[j].nodeName == "rotation") {
          var axis = transformationsNode[j].getAttribute("axis");
          var angle = parseFloat(transformationsNode[j].getAttribute("angle"));

          if (angle == null || axis == null) {
            this.onXMLMinorError("No values for rotation, skiping");
            continue;
          } else if (isNaN(angle)) {
            this.onXMLMinorError("Non numeric value for angle, skiping");
            continue;
          }
          if (axis != "x" && axis != "y" && axis != "z") {
            this.onXMLMinorError("Unknown axis provided for ratation, skiping");
            continue;
          }

          if (axis == "x")
            mat4.rotate(
              this.nodes[nodeID].transformMatrix,
              this.nodes[nodeID].transformMatrix,
              angle * DEGREE_TO_RAD,
              [1, 0, 0]
            );

          if (axis == "y")
            mat4.rotate(
              this.nodes[nodeID].transformMatrix,
              this.nodes[nodeID].transformMatrix,
              angle * DEGREE_TO_RAD,
              [0, 1, 0]
            );

          if (axis == "z")
            mat4.rotate(
              this.nodes[nodeID].transformMatrix,
              this.nodes[nodeID].transformMatrix,
              angle * DEGREE_TO_RAD,
              [0, 0, 1]
            );
        }

        if (transformationsNode[j].nodeName == "scale") {
          var sx = parseFloat(transformationsNode[j].getAttribute("sx"));
          var sy = parseFloat(transformationsNode[j].getAttribute("sy"));
          var sz = parseFloat(transformationsNode[j].getAttribute("sz"));

          if (sx == null || sy == null || sz == null) {
            this.onXMLMinorError("No values for scale, skiping");
            continue;
          } else if (isNaN(sx) || isNaN(sy) || isNaN(sz)) {
            this.onXMLMinorError("Non numeric values for scale, skiping");
            continue;
          }

          mat4.scale(
            this.nodes[nodeID].transformMatrix,
            this.nodes[nodeID].transformMatrix,
            [sx, sy, sz]
          );
        }
      }
      // Material 
      this.nodes[nodeID].materialID = grandChildren[materialIndex].getAttribute(
        "id"
      );
      if (
        typeof this.materials[this.nodes[nodeID].materialID] == "undefined" &&
        this.nodes[nodeID].materialID != "null"
      ) {
        this.onXMLMinorError(
          "Unknown material " +
            this.nodes[nodeID].materialID +
            ". Assuming null"
        );
        if (nodeID != this.idRoot) this.nodes[nodeID].materialID = "null";
        else this.onXMLError("Root node: Can't assume null. Terminating");
      }

      // Texture 
      this.nodes[nodeID].textureID = grandChildren[textureIndex].getAttribute(
        "id"
      );
      if (
        this.nodes[nodeID].textureID == "null" ||
        this.nodes[nodeID].textureID == "clear"
      );
      else if(this.textures[this.nodes[nodeID].textureID] == null) {
        this.onXMLMinorError("Texture ID = " + this.nodes[nodeID].textureID + " doesn't exist. Assuming texture clear");
        this.nodes[nodeID].textureID = "clear";
      }
      else if (
        (this.nodes[nodeID].textureAFS =
          grandChildren[textureIndex].children[0].nodeName == "amplification")
      ) {

        this.nodes[nodeID].textureAFS = parseFloat(
          grandChildren[textureIndex].children[0].getAttribute("afs")
        );
        this.nodes[nodeID].textureAFT = parseFloat(
          grandChildren[textureIndex].children[0].getAttribute("aft")
        );
        if (
          isNaN(this.nodes[nodeID].textureAFS) ||
          isNaN(this.nodes[nodeID].textureAFT)
        ) {
          this.onXMLMinorError(
            "Non-numeric values for Amplification. Assuming afs=1.0 and aft=1.0"
          );
          this.nodes[nodeID].textureAFS = 1.0;
          this.nodes[nodeID].textureAFT = 1.0;
        } else if (
          this.nodes[nodeID].textureAFS == null ||
          this.nodes[nodeID].textureAFT == null
        ) {
          this.onXMLMinorError(
            "No value provided for Amplification. Assuming afs=1.0 and aft=1.0"
          );
          this.nodes[nodeID].textureAFS = 1.0;
          this.nodes[nodeID].textureAFT = 1.0;
        }
      } else {
        this.onXMLMinorError(
          "No amplification defined for texture " +
            this.nodes[nodeID].textureID +
            ". Assuming afs=1.0 and aft=1.0"
        );
        this.nodes[nodeID].textureAFS = 1.0;
        this.nodes[nodeID].textureAFT = 1.0;
      }



      var animationsIndex;
        if(nodeNames.indexOf("animationref")!=-1)
        {

          animationsIndex=nodeNames.indexOf("animationref");
          var animationref=grandChildren[animationsIndex].getAttribute("id");
         
          this.nodes[nodeID].animation=this.animations[animationref];
          this.nodes[nodeID].display=0;
        }
      // Descendants
      var descendantsNode = grandChildren[descendantsIndex].children;
      for (var j = 0; j < descendantsNode.length; j++) {
        if (descendantsNode[j].nodeName == "leaf") {
          var type = grandChildren[descendantsIndex].children[j].getAttribute(
            "type"
          );
          if (type == "rectangle") {
            var x1 = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("x1")
            );
            var y1 = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("y1")
            );
            var x2 = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("x2")
            );
            var y2 = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("y2")
            );

            if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
              this.onXMLMinorError("invalid values of rectangle");
            } else {
              this.nodes[nodeID].leaves.push(
                new MyRectangle(this.scene, x1, y1, x2, y2)
              );
            }

          } else if (type == "cylinder") {
            var height = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("height")
            );
            var topRadius = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute(
                "topRadius"
              )
            );
            var bottomRadius = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute(
                "bottomRadius"
              )
            );
            var stacks = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("stacks")
            );
            var slices = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("slices")
            );

            if (isNaN(height) || isNaN(topRadius) || isNaN(bottomRadius) || isNaN(stacks) || isNaN(slices)) {
              this.onXMLMinorError("invalid values of cylinder");
            } else {
              this.nodes[nodeID].leaves.push(
                new MyCylinder(
                  this.scene,
                  height,
                  bottomRadius,
                  topRadius,
                  slices,
                  stacks
                )
              );
            }

          } else if (type == "triangle") {
            var x1 = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("x1")
            );
            var y1 = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("y1")
            );

            var x2 = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("x2")
            );
            var y2 = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("y2")
            );

            var x3 = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("x3")
            );
            var y3 = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("y3")
            );

            if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(x3) || isNaN(y3)) {
              this.onXMLMinorError("invalid values of triangle");
            } else {
              this.nodes[nodeID].leaves.push(
                new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3)
              );
            }

          } else if (type == "sphere") {
            var radius_sphere = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("radius")
            );
            var slices_sphere = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("slices")
            );
            var stacks_sphere = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("stacks")
            );

            if (isNaN(radius_sphere) || isNaN(slices_sphere) || isNaN(stacks_sphere)) {
              this.onXMLMinorError("invalid values of sphere");
            } else {
              this.nodes[nodeID].leaves.push(
                new MySphere(
                  this.scene,
                  radius_sphere,
                  slices_sphere,
                  stacks_sphere
                )
              );
            }

          } else if (type == "torus") {
            var innerRadious_torus = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("inner")
            );
            var outerRadious_torus = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("outer")
            );
            var slices_torus = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("slices")
            );
            var loops_torus = parseFloat(
              grandChildren[descendantsIndex].children[j].getAttribute("loops")
            );

            if (isNaN(innerRadious_torus) || isNaN(outerRadious_torus) || isNaN(slices_torus) || isNaN(loops_torus)) {
              this.onXMLMinorError("invalid values of torus");
            } else {
              this.nodes[nodeID].leaves.push(
                new MyTorus(
                  this.scene,
                  innerRadious_torus,
                  outerRadious_torus,
                  slices_torus,
                  loops_torus
                )
              );
            }

          }
          else if(type=="spritetext")
          {
            var text=grandChildren[descendantsIndex].children[j].getAttribute("text");
            this.nodes[nodeID].leaves.push( new MySpriteText(this.scene,text));
          }
          else if(type=="spriteanim")
          {
            var ssid=grandChildren[descendantsIndex].children[j].getAttribute("ssid");
            var duration=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("duration"));
            var startCell=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("startCell"));
            var endCell=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("endCell"));
            var spriteanimation=new MySpriteAnimation(this.scene,this.spritesheets[ssid],duration,startCell,endCell);
            this.nodes[nodeID].leaves.push(spriteanimation );
            this.scene.spriteanimations.push(spriteanimation);
            
          }
          else if(type=="plane")
          {
            var npartsU=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("npartsU"));
            var npartsV=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("npartsV"));
            this.nodes[nodeID].leaves.push(new MyPlane(this.scene,npartsU,npartsV));
          }

          else if(type=="patch")
          {
            
            var npointsU=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("npointsU"));
            var npointsV=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("npointsV"));
            var npartsU=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("npartsU"));
            var npartsV=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("npartsV"));
            var controlpoints=[];
            for (var k=0;k<npointsV*npointsU;k++)
            {
              var x=parseFloat(grandChildren[descendantsIndex].children[j].children[k].getAttribute("x"));
              var y=parseFloat(grandChildren[descendantsIndex].children[j].children[k].getAttribute("y"));
              var z=parseFloat(grandChildren[descendantsIndex].children[j].children[k].getAttribute("z"));
              controlpoints.push([x,y,z]);
            }
            this.nodes[nodeID].leaves.push(new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlpoints));
            //console.log(this.nodes[nodeID].leaves);
          }
          else if(type=="defbarrel")
          {
            var base=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("base"));
            var middle=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("middle"));
            var height=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("height"));
            var slices=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("slices"));
            var stacks=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute("stacks"));
            this.nodes[nodeID].leaves.push(new MyBarrel(this.scene,base,middle,height,slices,stacks));
          
          }
          else if(type=="gameboard")
          {
            if(this.gameboard_count==0)
            {
              this.gameboard_count++;
               var black_piece=grandChildren[descendantsIndex].children[j].getAttribute("black_piece");
              var white_piece=grandChildren[descendantsIndex].children[j].getAttribute("white_piece");
              var black_tile=grandChildren[descendantsIndex].children[j].getAttribute("black_tile");
              var white_tile=grandChildren[descendantsIndex].children[j].getAttribute("white_tile");
   
              this.nodes[nodeID].leaves.push(new MyGameBoard(this.scene,this.materials[black_piece],
                this.materials[white_piece],this.textures[black_tile],this.textures[white_tile],this.materials[this.nodes[nodeID].materialID]));
            }
            else
            {
              this.onXMLMinorError("There can only be one gameboard per scene");
            }
            
          }

          else if(type=="table")
          {
            
            this.nodes[nodeID].leaves.push(new MyTable(this.scene));
          }

          else if(type=="eval_board")
          {
            this.nodes[nodeID].leaves.push(new MyEvaluationBoard(this.scene));
            this.nodes[nodeID].update=1;
          }
          
          else {
            this.onXMLMinorError(
              "Unknown leaf type " + type + ". Skipping leaf"
            );
          }
        }

        if (descendantsNode[j].nodeName == "noderef") {
          this.nodes[nodeID].children.push(
            grandChildren[descendantsIndex].children[j].getAttribute("id")
          );
        }
      }
    }
  }

  parseBoolean(node, name, messageError) {
    var boolVal = true;
    boolVal = this.reader.getBoolean(node, name);
    if (
      !(
        boolVal != null &&
        !isNaN(boolVal) &&
        (boolVal == true || boolVal == false)
      )
    )
      this.onXMLMinorError(
        "unable to parse value component " +
          messageError +
          "; assuming 'value = 1'"
      );

    return boolVal || 1;
  }
  /**
   * Parse the coordinates from a node with ID = id
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseCoordinates3D(node, messageError) {
    var position = [];

    // x
    var x = this.reader.getFloat(node, "x");
    if (!(x != null && !isNaN(x)))
      return "unable to parse x-coordinate of the " + messageError;

    // y
    var y = this.reader.getFloat(node, "y");
    if (!(y != null && !isNaN(y)))
      return "unable to parse y-coordinate of the " + messageError;

    // z
    var z = this.reader.getFloat(node, "z");
    if (!(z != null && !isNaN(z)))
      return "unable to parse z-coordinate of the " + messageError;

    position.push(...[x, y, z]);

    return position;
  }

  /**
   * Parse the coordinates from a node with ID = id
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseCoordinates4D(node, messageError) {
    var position = [];

    //Get x, y, z
    position = this.parseCoordinates3D(node, messageError);

    if (!Array.isArray(position)) return position;

    // w
    var w = this.reader.getFloat(node, "w");
    if (!(w != null && !isNaN(w)))
      return "unable to parse w-coordinate of the " + messageError;

    position.push(w);

    return position;
  }

  /**
   * Parse the color components from a node
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseColor(node, messageError) {
    var color = [];

    // R
    var r = this.reader.getFloat(node, "r");
    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
      return "unable to parse R component of the " + messageError;

    // G
    var g = this.reader.getFloat(node, "g");
    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
      return "unable to parse G component of the " + messageError;

    // B
    var b = this.reader.getFloat(node, "b");
    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
      return "unable to parse B component of the " + messageError;

    // A
    var a = this.reader.getFloat(node, "a");
    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
      return "unable to parse A component of the " + messageError;

    color.push(...[r, g, b, a]);

    return color;
  }

  //calls displayScene_aux() the first node (root) and sets the parent parameters
  displayScene() {
    if(this.idRoot!=null)
    {
    if(this.textures[this.idRoot]!="clear")
    this.displayScene_aux(this.idRoot, this.nodes[this.idRoot].textureID,0);
    else this.displayScene_aux(this.idRoot, this.nodes[this.idRoot].textureID,1);
    }
  }

  //function to recursively display the nodes, transversing the graph
  displayScene_aux(idNode, parentTex,parentTex_clear) {



    var currNode = this.nodes[idNode];
    
    
    

    //applies material of current node
    if (this.materials[currNode.materialID] != null) {
      this.materials[currNode.materialID].apply();
    }

    //if the texture is clear unbinds current texture
    if (currNode.textureID == "clear") {
      if(this.textures[parentTex]!=null)
      this.textures[parentTex].unbind(0);
      parentTex_clear = 1;
    }
    //binds the texture
    //if texture is nul doesn't bind ot unbind, the previous texture keeps binded
    else if (this.textures[currNode.textureID] != null) {
      this.textures[currNode.textureID].bind(0);
      parentTex = currNode.textureID;
      parentTex_clear=0;
    }

    //updates the transform matrix 
    this.scene.multMatrix(currNode.transformMatrix);

    //recursive function call for the child nodes using push and pop 
    for (var i = 0; i < currNode.children.length; i++) {
      this.scene.pushMatrix();
      this.displayScene_aux(currNode.children[i], parentTex,parentTex_clear);
      this.scene.popMatrix();
    }

    if (this.materials[currNode.materialID] != null) {
      this.materials[currNode.materialID].apply();
    }

    //displays leaves
    for (var i = 0; i < currNode.leaves.length; i++) {
      this.scene.pushMatrix();

       if (parentTex_clear == 1) {
        ;
      }
      else  if (this.textures[parentTex] != null )
        this.textures[parentTex].bind(0);

      //updates texture coords
      if(currNode.textureAFS!=null && currNode.textureAFT!=null)
      {
       if(typeof currNode.leaves[i].updateTexCoords==="function")
        currNode.leaves[i].updateTexCoords(currNode.textureAFS,currNode.textureAFT);
      }
      
      currNode.leaves[i].display();
      

      this.scene.popMatrix();
    }
  }

  update(difference,total_time)
  {
    var current_instant;
  if(this.idRoot!=null)
  {

    var currNode = this.nodes[this.idRoot];
   

    
    if(currNode.animation!=null)
    {
      for(var i=0;i<currNode.animation.instants.length-1;i++)
      {
        if(total_time<currNode.animation.instants[i])
        {
          current_instant=i-1;
          break;
        }
      }
      
      if(current_instant>0)
      {
        this.currNode.display=1;
        this.scene.multMatrix(currNode.animation.transformMatrix[current_instant]/((currNode.animation.instants[current_instant+1]-currNode.animation.instants[current_instant]))/(difference/1000));
      }
    
      //updates the transform matrix 
    }
    //recursive function call for the child nodes using push and pop 
    for (var i = 0; i < currNode.children.length; i++) {
      this.scene.pushMatrix();
      this.update_aux(currNode.children[i],difference,total_time);
      this.scene.popMatrix();
    }
  }
   
  }

  update_aux(idNode,difference,total_time)
  {
    var current_instant;


    var currNode = this.nodes[idNode];
    if(currNode.update==1)
    {
      for (var cycle=0;cycle<currNode.leaves.length;cycle++)
      currNode.leaves[cycle].update(total_time);
    }
    if(currNode.animation!=null)
    {
      var check=0;

      for(var i=0;i<currNode.animation.instants.length;i++)
      {
        
        if(total_time<currNode.animation.instants[i])
        {
          current_instant=i-1;
          check=1;
          break;
        }
      }
      
      if(check==0)
      current_instant=-1;
      if(current_instant>-1)
      {
        currNode.display=1;
        
          if(current_instant>0)
        {
       
          if( Math.abs(currNode.animation.current_trans_vec[current_instant-1][0])<Math.abs(currNode.animation.trans_vec[current_instant-1][0])
            ||Math.abs(currNode.animation.current_trans_vec[current_instant-1][1])<Math.abs(currNode.animation.trans_vec[current_instant-1][1])
            ||Math.abs(currNode.animation.current_trans_vec[current_instant-1][2])<Math.abs(currNode.animation.trans_vec[current_instant-1][2]))
          {
            var aux_trans_vec=[
              currNode.animation.trans_vec[current_instant-1][0]-currNode.animation.current_trans_vec[current_instant-1][0],
              currNode.animation.trans_vec[current_instant-1][1]-currNode.animation.current_trans_vec[current_instant-1][1],
              currNode.animation.trans_vec[current_instant-1][2]-currNode.animation.current_trans_vec[current_instant-1][2],
            ]
            currNode.animation.current_trans_vec[current_instant-1]=currNode.animation.trans_vec[current_instant-1];
            
            mat4.translate(currNode.transformMatrix,currNode.transformMatrix, aux_trans_vec);
            
          }


          if(currNode.animation.current_angles[(current_instant-1)*3]<currNode.animation.angles[(current_instant-1)*3]
            ||currNode.animation.current_angles[(current_instant-1)*3+1]<currNode.animation.angles[(current_instant-1)*3+1]
            ||currNode.animation.current_angles[(current_instant-1)*3+2]<currNode.animation.angles[(current_instant-1)*3+2])
          {
            var aux_rot1=currNode.animation.angles[(current_instant-1)*3]-currNode.animation.current_angles[(current_instant-1)*3];
            var aux_rot2=currNode.animation.angles[(current_instant-1)*3]-currNode.animation.current_angles[(current_instant-1)*3+1];
            var aux_rot3=currNode.animation.angles[(current_instant-1)*3]-currNode.animation.current_angles[(current_instant-1)*3+2];
            
            currNode.animation.current_angles[(current_instant-1)*3]=currNode.animation.angles[(current_instant-1)*3];
            currNode.animation.current_angles[(current_instant-1)*3+1]=currNode.animation.angles[(current_instant-1)*3+1];
            currNode.animation.current_angles[(current_instant-1)*3+2]=currNode.animation.angles[(current_instant-1)*3+2];
            
            mat4.rotate(currNode.transformMatrix,currNode.transformMatrix,aux_rot1,currNode.animation.rot_vec[(current_instant-1)*3]);
            mat4.rotate(currNode.transformMatrix,currNode.transformMatrix,aux_rot2,currNode.animation.rot_vec[(current_instant-1)*3+1]);
            mat4.rotate(currNode.transformMatrix,currNode.transformMatrix,aux_rot3,currNode.animation.rot_vec[(current_instant-1)*3+2]);

          }
        } 


        if(current_instant<currNode.animation.instants.length-1)
        {
        var div_factor=(currNode.animation.instants[current_instant+1]-currNode.animation.instants[current_instant])/(difference/1000);
        var trans_vec= [currNode.animation.trans_vec[current_instant][0]/div_factor,
          currNode.animation.trans_vec[current_instant][1]/div_factor,
          currNode.animation.trans_vec[current_instant][2]/div_factor];

          currNode.animation.current_trans_vec[current_instant][0]=currNode.animation.current_trans_vec[current_instant][0]+currNode.animation.trans_vec[current_instant][0]/div_factor;
          currNode.animation.current_trans_vec[current_instant][1]=currNode.animation.current_trans_vec[current_instant][1]+currNode.animation.trans_vec[current_instant][1]/div_factor;
          currNode.animation.current_trans_vec[current_instant][2]=currNode.animation.current_trans_vec[current_instant][2]+currNode.animation.trans_vec[current_instant][2]/div_factor;
          
          if((Math.abs(currNode.animation.current_trans_vec[current_instant][0])>Math.abs(currNode.animation.trans_vec[current_instant][0]))
            ||(Math.abs(currNode.animation.current_trans_vec[current_instant][1]))>Math.abs(currNode.animation.trans_vec[current_instant][1])
            ||(Math.abs(currNode.animation.current_trans_vec[current_instant][2]))>Math.abs(currNode.animation.trans_vec[current_instant][2]))
            {
              currNode.animation.current_trans_vec[current_instant][0]=currNode.animation.current_trans_vec[current_instant][0]-currNode.animation.trans_vec[current_instant][0]/div_factor;
              currNode.animation.current_trans_vec[current_instant][1]=currNode.animation.current_trans_vec[current_instant][1]-currNode.animation.trans_vec[current_instant][1]/div_factor;
              currNode.animation.current_trans_vec[current_instant][2]=currNode.animation.current_trans_vec[current_instant][2]-currNode.animation.trans_vec[current_instant][2]/div_factor;

              trans_vec=[
                currNode.animation.trans_vec[current_instant][0]-currNode.animation.current_trans_vec[current_instant][0],
                currNode.animation.trans_vec[current_instant][1]-currNode.animation.current_trans_vec[current_instant][1],
                currNode.animation.trans_vec[current_instant][2]-currNode.animation.current_trans_vec[current_instant][2],
              ];
            }
            
            
        mat4.translate(currNode.transformMatrix,currNode.transformMatrix, trans_vec);
       
        

        var div_factor=(currNode.animation.instants[current_instant+1]-currNode.animation.instants[current_instant])/(difference/1000);
        var scale_vec= [
          Math.pow(currNode.animation.scale_vec[current_instant][0],1/div_factor),
          Math.pow(currNode.animation.scale_vec[current_instant][1],1/div_factor),
          Math.pow(currNode.animation.scale_vec[current_instant][2],1/div_factor)];
        
          currNode.animation.current_scale_vec[current_instant][0]=currNode.animation.current_scale_vec[current_instant][0]*scale_vec[0];
          currNode.animation.current_scale_vec[current_instant][1]=currNode.animation.current_scale_vec[current_instant][1]*scale_vec[1];
          currNode.animation.current_scale_vec[current_instant][2]=currNode.animation.current_scale_vec[current_instant][2]*scale_vec[2];

            mat4.scale(currNode.transformMatrix,currNode.transformMatrix, scale_vec);
 



        currNode.animation.current_angles[current_instant*3]=currNode.animation.current_angles[current_instant*3]+currNode.animation.angles[current_instant*3]/div_factor;
        currNode.animation.current_angles[current_instant*3+1]=currNode.animation.current_angles[current_instant*3+1]+currNode.animation.angles[current_instant*3+1]/div_factor;
        currNode.animation.current_angles[current_instant*3+2]=currNode.animation.current_angles[current_instant*3+2]+currNode.animation.angles[current_instant*3+2]/div_factor;
        

        var rot1=currNode.animation.angles[current_instant*3]/div_factor;
        var rot2=currNode.animation.angles[current_instant*3+1]/div_factor;
        var rot3=currNode.animation.angles[current_instant*3+2]/div_factor;
      
        if(Math.abs(currNode.animation.current_angles[current_instant*3])>Math.abs(currNode.animation.angles[current_instant*3])
          ||Math.abs(currNode.animation.current_angles[current_instant*3+1])>Math.abs(currNode.animation.angles[current_instant*3+1])
          ||Math.abs(currNode.animation.current_angles[current_instant*3+2])>Math.abs(currNode.animation.angles[current_instant*3+2]))
          {
            currNode.animation.current_angles[current_instant*3]=currNode.animation.current_angles[current_instant*3]-currNode.animation.angles[current_instant*3]/div_factor;
            currNode.animation.current_angles[current_instant*3+1]=currNode.animation.current_angles[current_instant*3+1]-currNode.animation.angles[current_instant*3+1]/div_factor;
            currNode.animation.current_angles[current_instant*3+2]=currNode.animation.current_angles[current_instant*3+2]-currNode.animation.angles[current_instant*3+2]/div_factor;

            
              rot1=currNode.animation.angles[current_instant*3]-currNode.animation.current_angles[current_instant*3];
              rot2=currNode.animation.angles[current_instant*3+1]-currNode.animation.current_angles[current_instant*3+1];
              rot3=currNode.animation.angles[current_instant*3+2]-currNode.animation.current_angles[current_instant*3+2];
            
          }
        
        mat4.rotate(currNode.transformMatrix,currNode.transformMatrix,rot1,currNode.animation.rot_vec[current_instant*3]);
        mat4.rotate(currNode.transformMatrix,currNode.transformMatrix,rot2,currNode.animation.rot_vec[current_instant*3+1]);
        mat4.rotate(currNode.transformMatrix,currNode.transformMatrix,rot3,currNode.animation.rot_vec[current_instant*3+2]);
        


    
      //updates the transform matrix 
        }
    }
  }
    //recursive function call for the child nodes using push and pop 
    for (var i = 0; i < currNode.children.length; i++) {
      this.scene.pushMatrix();
      this.update_aux(currNode.children[i],difference,total_time);
      this.scene.popMatrix();
    }
  }
}





/*    
*/