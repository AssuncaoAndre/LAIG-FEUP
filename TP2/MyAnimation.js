/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @method constructor
 * @param {string} animationID
 **/

function MyAnimation(animationID) {

    this.animationID = animationID;

    // IDs of child nodes.
    this.instants = [];
    this.trans_vec = [];
    this.rot_vec = [];
    this.scale_vec=[];
    this.angles=[];
    this.current_trans_vec=[];
    this.current_angles=[];
    this.current_scale_vec =[];


}

