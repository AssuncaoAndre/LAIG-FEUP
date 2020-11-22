class MyBarrel extends CGFobject
{
	/**
	 * Builds a plane object 
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} UDivs number of divisions in U
     * @param {Number} VDivs number of divisions in V
	 */
    constructor(scene, base,middle,height,slices,stacks)
    {
        super(scene);
        var controlPoints=[
            
            [0,base/2,0],       
            [base/2,base/2,0], 
            [base/2,0,0],      
            [base/2,-base/2,0],  
            [0,-base/2,0],        
            
            
            [0,middle/2,height/2],
            [middle/2,middle/2,height/2],
            [middle/2,0,height/2],
            [middle/2,-middle/2,height/2],
            [0,-middle/2,height/2],
            
        
            [0,base/2,height],
            [base/2,base/2,height],
            [base/2,0,height],
            [base/2,-base/2,height],
            [0,-base/2,height],
            
        ]
        this.patch1=new MyPatch(scene,3,5,slices,stacks,controlPoints);

        controlPoints=[
            [0,-base/2,0],        
            [-base/2,-base/2,0],  
            [-base/2,0,0],      
            [-base/2,base/2,0], 
            [0,base/2,0],       
            
            
            [0,-middle/2,height/2],
            [-middle/2,-middle/2,height/2],
            [-middle/2,0,height/2],
            [-middle/2,middle/2,height/2],
            [0,middle/2,height/2],
            
        
            [0,-base/2,height],
            [-base/2,-base/2,height],
            [-base/2,0,height],
            [-base/2,base/2,height],
            [0,base/2,height],
        ]
        this.patch2=new MyPatch(scene,3,5,slices,stacks,controlPoints);
}   

display()
{
    this.patch1.display();
    this.patch2.display();
    
}
}