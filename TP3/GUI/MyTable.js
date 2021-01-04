class MyTable extends CGFobject
{
	/**
	 * Builds a plane object 
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {String} space space where the table is displayed (indoor or outdoor)

     * 
	 */
    constructor(scene,space)
    {
        super(scene);
  
        this.table= new CGFOBJModel(this.scene, 'OBJ/Table.obj');

    }

    display()
    {
        this.scene.pushMatrix();
        this.scene.scale(0.3,0.3,0.3);
        this.table.display();
        this.scene.popMatrix();
    }
    update(){}
}