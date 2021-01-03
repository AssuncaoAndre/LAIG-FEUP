class MyPatch extends CGFobject
{
	/**
	 * Builds a plane object 
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} npointsU number of divisions in U
     * @param {Number} npointsV number of divisions in V
     * @param {Number} npartsU number of divisions in U
     * @param {Number} npartsV number of divisions in V
     * @param {Number} controlPoints number of divisions in V
     * 
	 */
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints)
    {
        
        super(scene);
        this.scene=scene;
        this.npartsU=npartsU;
        this.npartsV=npartsV;
        this.matrix=[];
        for(var i=0;i<npointsU;i++)
        {
            var mat=[];
            for(var j=0;j<npointsV;j++)
            { 

                controlPoints[j+i*npointsV].push(1);
                mat.push(controlPoints[j+i*npointsV]);
                
            }
            this.matrix.push(mat);
        }

	this.surface = new CGFnurbsSurface(
        npointsU-1,  
        npointsV-1,  
        this.matrix
      );
        

	
    this.object = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.surface);	
}

display()
{
    this.object.display();
}
}