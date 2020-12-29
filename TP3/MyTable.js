class MyTable extends CGFobject
{
	/**
	 * Builds a plane object 
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} type type of the piece
     * @param {Number} color color

     * 
	 */
    constructor(scene)
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
}