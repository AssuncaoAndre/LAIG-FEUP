const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

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
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
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
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

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
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
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
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.onXMLMinorError("To do: Parse views and create cameras.");
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
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

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
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

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
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
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
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            // Checks path od the current texture.
            var path = children[i].getAttribute("path");
            if (path == null)
                return "no Path defined for texture";

            var texture = new CGFtexture(this.scene, path);
            this.textures[textureID] = texture;

            texturesNo++;
        }

        // Checks if there is at least one texture block
        if (texturesNo <= 0)
            return "at least one texture block must be defined";

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
        var nodeNames = [];

        var materialsNo = 0;

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

          if (children[i].nodeName != "material") {
            this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

          // Get id of the current material.
          var materialID = this.reader.getString(children[i], 'id');
          if (materialID == null)
            return "no ID defined for material";

          // Checks for repeated IDs.
          if (this.materials[materialID] != null)
            return "ID must be unique for each material (conflict: ID = " + materialID + ")";

          grandChildren = children[i].children;
          var shininess = null;
          var ambient = null;
          var diffuse = null;
          var specular = null;
          var emissive = null;

          for(var j = 0; j < grandChildren.length; j++) {

            if (grandChildren[j].nodeName == "shininess")
              shininess = parseFloat(grandChildren[j].getAttribute("value"));

            if (grandChildren[j].nodeName == "ambient") {
                ambient = [parseFloat(grandChildren[j].getAttribute("r")), parseFloat(grandChildren[j].getAttribute("g")), parseFloat(grandChildren[j].getAttribute("b")), parseFloat(grandChildren[j].getAttribute("a"))];
            }

            if (grandChildren[j].nodeName == "diffuse")
              diffuse = [parseFloat(grandChildren[j].getAttribute("r")), parseFloat(grandChildren[j].getAttribute("g")), parseFloat(grandChildren[j].getAttribute("b")), parseFloat(grandChildren[j].getAttribute("a"))];

            if (grandChildren[j].nodeName == "specular")
              specular = [parseFloat(grandChildren[j].getAttribute("r")), parseFloat(grandChildren[j].getAttribute("g")), parseFloat(grandChildren[j].getAttribute("b")), parseFloat(grandChildren[j].getAttribute("a"))];

            if (grandChildren[j].nodeName == "emissive")
              emissive = [parseFloat(grandChildren[j].getAttribute("r")), parseFloat(grandChildren[j].getAttribute("g")), parseFloat(grandChildren[j].getAttribute("b")), parseFloat(grandChildren[j].getAttribute("a"))];
          }

          var matError = null;

          if (shininess == null)
            return "shininess must be defined for each material (conflict: ID = " + materialID + ")";

          if (ambient == null)
            return "ambient must be defined for each material (conflict: ID = " + materialID + ")";

          matError = this.checkRGBA(ambient[0], ambient[1], ambient[2], ambient[3]);
          if(matError != null)
            return matError + " (conflict: ID = " + materialID + " -> ambient)";

          if (diffuse == null)
            return "diffuse must be defined for each material (conflict: ID = " + materialID + ")";

          matError = this.checkRGBA(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
          if(matError != null)
            return matError + " (conflict: ID = " + materialID + " -> diffuse)";

          if (specular == null)
            return "specular must be defined for each material (conflict: ID = " + materialID + ")";

          matError = this.checkRGBA(specular[0], specular[1], specular[2], specular[3]);
          if(matError != null)
            return matError + " (conflict: ID = " + materialID + " -> specular)";

          if (emissive == null)
            return "emissive must be defined for each material (conflict: ID = " + materialID + ")";

          matError = this.checkRGBA(emissive[0], emissive[1], emissive[2], emissive[3]);
          if(matError != null)
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
        if (materialsNo <= 0)
        return "at least one material block must be defined";

        this.log("Parsed materials");

        return null;
    }

    checkRGBA(r, g, b, a) {
      if (r < 0 || r > 1 || isNaN(r))
        return "r of rgba must be a value between 0 and 255";

      if (g < 0 || g > 1 || isNaN(g))
        return "g of rgba must be a value between 0 and 255";

      if (b < 0 || b > 1 || isNaN(b))
        return "b of rgba must be a value between 0 and 255";

      if (a < 0 || a > 1 || isNaN(a))
        return "a of rgba must be a value between 0 and 1";

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
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {
            //this.log(nodesNode.children[i].id);
            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');

            if (nodeID == null)
                return "no ID defined for nodeID";

            this.nodes[nodeID]=MyNode(nodeID);
            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;
           // console.log(nodeID);
            this.nodes[nodeID]=new MyNode(nodeID);
           // console.log(this.nodes[nodeID]);

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");


            // Transformations

            //this.onXMLMinorError("To do: Parse nodes.");

            var transformationsNode = grandChildren[transformationsIndex].children;
            //this.log(transformationsNode);



            for(var j=0;j<transformationsNode.length;j++)
            {
                //this.log(transformationsNode[j].nodeName);
                 if(transformationsNode[j].nodeName=="translation")
                {
                    var x=parseFloat(transformationsNode[j].getAttribute('x'));
                    var y=parseFloat(transformationsNode[j].getAttribute('y'));
                    var z=parseFloat(transformationsNode[j].getAttribute('z'));

                    //to do assume default values
                    if(x==null||y==null||z==null)
                        this.onXMLError("No values for translation");
                    else if(isNaN(x)||isNaN(y)||isNaN(z))
                        this.onXMLError ("Non numeric values for translation");
                    mat4.translate(this.nodes[nodeID].transformMatrix ,this.nodes[nodeID].transformMatrix ,[x,y,z]);

                }

                if(transformationsNode[j].nodeName=="rotation")
                {

                    var axis = transformationsNode[j].getAttribute('axis');
                    var angle = parseFloat(transformationsNode[j].getAttribute('angle'));



                    if(angle==null||axis==null)
                        this.onXMLError( "No values for rotation");
                    else if(isNaN(angle))
                    {
                        this.onXMLError( "No numeric values for rotation");
                    }

                     if(axis=='x')
                    mat4.rotate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix,angle*DEGREE_TO_RAD,[1,0,0]);

                    if(axis=='y')
                    mat4.rotate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix,angle*DEGREE_TO_RAD,[0,1,0]);

                    if(axis=='z')
                    mat4.rotate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix,angle*DEGREE_TO_RAD,[0,0,1]);
                }

                if(transformationsNode[j].nodeName=="scale")
                {


                    var sx = parseFloat(transformationsNode[j].getAttribute('sx'));
                    var sy = parseFloat(transformationsNode[j].getAttribute('sy'));
                    var sz = parseFloat(transformationsNode[j].getAttribute('sz'));


                if(sx==null||sy==null || sz==null)
                    this.onXMLError( "No values for scale");
                else if(isNaN(sx)||isNaN(sy)||isNaN(sz))
                    this.onXMLError( "Non numeric values for scale");

                    mat4.scale(this.nodes[nodeID].transformMatrix,this.nodes[nodeID].transformMatrix,[sx,sy,sz]);

                }


            }
            // Material (not now)
            this.nodes[nodeID].materialID=grandChildren[materialIndex].getAttribute('id');

            // Texture (not now)
            this.nodes[nodeID].textureID=grandChildren[textureIndex].getAttribute('id');
            if(this.nodes[nodeID].textureAFS=parseFloat(grandChildren[textureIndex].children[0].nodeName=="amplification"))
            {
                this.nodes[nodeID].textureAFS=parseFloat(grandChildren[textureIndex].children[0].getAttribute('afs'));
                this.nodes[nodeID].textureAFT=parseFloat(grandChildren[textureIndex].children[0].getAttribute('aft'));
            }
            else
            {
                this.onXMLMinorError("No amplification defined. Assuming afs=1.0 and aft=1.0");
                this.nodes[nodeID].textureAFS=1.0;
                this.nodes[nodeID].textureAFT=1.0;
            }
            // Descendants
            var descendantsNode = grandChildren[descendantsIndex].children;
            for(var j=0;j<descendantsNode.length;j++)
            {
                //this.log(descendantsNode[j].nodeName);
                 if(descendantsNode[j].nodeName=="leaf")
                {

                    var type=grandChildren[descendantsIndex].children[j].getAttribute('type');
                    if(type=="rectangle")
                    {
                       var x1=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('x1'));
                       var y1=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('y1'));
                       var x2=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('x2'));
                       var y2=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('y2'));
                       this.nodes[nodeID].leaves.push(new MyRectangle(this.scene,x1,y1,x2,y2));
                    }

                    else if(type=="cylinder")
                    {
                        var height=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('height'));
                        var topRadius=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('topRadius'));
                        var bottomRadius=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('bottomRadius'));
                        var stacks=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('stacks'));
                        var slices=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('slices'));
                        this.nodes[nodeID].leaves.push(new MyCylinder(this.scene, height,bottomRadius, topRadius,  slices, stacks));
                    }

                    else if(type=="triangle")
                    {
                        var x1=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('x1'));
                        var y1=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('y1'));
                        var z1=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('z1'));
                        var x2=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('x2'));
                        var y2=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('y2'));
                        var z2=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('z3'));
                        var x3=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('x3'));
                        var y3=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('y3'));
                        var z3=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('z3'));
                        this.nodes[nodeID].leaves.push(new MyTriangle(this.scene,x1,y1,z1,x2,y2,z2,x3,y3,z3));
                    }

                    else if(type=="sphere")
                    {
                        var radius_sphere=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('radius'));
                        var slices_sphere=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('slices'));
                        var stacks_sphere=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('stacks'));
                        //console.log(radius_sphere,stacks_sphere,slices_sphere);
                        this.nodes[nodeID].leaves.push(new MySphere(this.scene,radius_sphere,slices_sphere,stacks_sphere));
                    }

                    else if(type=="torus")
                    {
                      var innerRadious_torus=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('inner'));
                      var outerRadious_torus=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('outer'));
                      var slices_torus=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('slices'));
                      var loops_torus=parseFloat(grandChildren[descendantsIndex].children[j].getAttribute('loops'));
                      this.nodes[nodeID].leaves.push(new MyTorus(this.scene,innerRadious_torus,outerRadious_torus,slices_torus,loops_torus));
                    }
                    else
                    {
                        this.onXMLMinorError("Unkown leaf type "+type+". Skipping leaf");
                    }

                }

                if(descendantsNode[j].nodeName=="noderef")
                {
                    this.nodes[nodeID].children.push(grandChildren[descendantsIndex].children[j].getAttribute('id'));
                }
            }

        }
    }


    parseBoolean(node, name, messageError){
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

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
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
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

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
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
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        this.displayScene_aux(this.idRoot,this.nodes[this.idRoot].textureID);


    }
    displayScene_aux(idNode,parentTex)
    {

        var currNode=this.nodes[idNode];

        if(this.materials[currNode.materialID]!=null)
        {
            //console.log(this.materials[currNode.materialID]);
            //console.log(currNode.materialID);
            this.materials[currNode.materialID].apply();
        }


        if (this.textures[currNode.textureID] != null)
        {
            this.textures[currNode.textureID].bind(0);
            parentTex=currNode.textureID;
        }


        //To do: Create display loop for transversing the scene graph, calling the root node's display function
          this.scene.multMatrix(currNode.transformMatrix);

         for(var i=0;i<currNode.children.length;i++)
        {
            this.scene.pushMatrix();
            this.displayScene_aux(currNode.children[i],parentTex);
            this.scene.popMatrix();
        }


        for (var i=0;i<currNode.leaves.length;i++)
        {
            this.scene.pushMatrix();

             if (this.textures[currNode.textureID] != null)
            {
                this.textures[currNode.textureID].bind(0);
                parentTex=currNode.textureID;
            }
            else
            {

                this.textures[parentTex].bind(0);
            }



            currNode.leaves[i].display();



            this.scene.popMatrix();
        }
    }
}
