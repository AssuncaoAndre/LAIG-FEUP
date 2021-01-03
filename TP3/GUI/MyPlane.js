/**
 * Plane
 * @constructor */
class MyPlane extends CGFobject
{
	/**
	 * Builds a plane object 
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} UDivs number of divisions in U
     * @param {Number} VDivs number of divisions in V
	 */
    constructor(scene, UDivs, VDivs)
    {
        super(scene);
        this.npartsU = UDivs;
        this.npartsV = VDivs;

        this.surface = new CGFnurbsSurface(
          1,  // degree on U: 2 control vertexes U
          1,  // degree on V: 2 control vertexes on V
          // V is lines of each U matrix (U is number of matrices)
          [
            [ // V = 0..1;
              [0,  0,0.0, 1 ],
                [0,  1,0.0, 1 ],
               
           ],
           // U = 1
           [ // V = 0..1
            [1,  0,0.0, 1 ],
            [ 1,   1,0.0, 1 ],							 
           ]
          ]
        );
        this.object = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.surface);
    }

    display() { this.object.display(); }
    update(){}
}