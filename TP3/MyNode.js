/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @method constructor
 * @param {string} nodeID
 **/

function MyNode(nodeID) {

    this.nodeID = nodeID;
    this.display=1;
    // IDs of child nodes.
    this.children = [];

    // primitives
    this.leaves = [];

    // The material ID.
    this.materialID = null;

    // The texture ID.
    this.textureID = null;
    this.textureAFS;
    this.textureAFT;

/*     this.textureID2 = null;
    this.textureAFS2;
    this.textureAFT2;

    this.textureID3 = null;
    this.textureAFS3;
    this.textureAFT3;

    this.textureID4 = null;
    this.textureAFS4;
    this.textureAFT4; */

    this.animation=null;

    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
}

