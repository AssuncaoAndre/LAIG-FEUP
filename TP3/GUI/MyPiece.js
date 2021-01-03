class MyPiece extends CGFobject
{
	/**
	 * Builds a plane object 
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} type type of the piece
     * @param {Number} color color

     * 
	 */
    constructor(scene, type,material,color)
    {
        
        super(scene);
        //this.board=board;
        this.type=type;
        this.material=material;
        this.color=color
        this.animation=null;
        this.shit=0;
        if(this.type=="r")
        {
            this.piece= new CGFOBJModel(this.scene, 'OBJ/Rook.obj');
        }

        else if(this.type=="k")
        {
            this.piece= new CGFOBJModel(this.scene, 'OBJ/King.obj');
        }

        else if(this.type=="b")
        {
            this.piece= new CGFOBJModel(this.scene, 'OBJ/Bishop.obj');
        }

        else if(this.type=="q")
        {
            this.piece= new CGFOBJModel(this.scene, 'OBJ/Queen.obj');
        }

        else if(this.type=="k")
        {
            this.piece= new CGFOBJModel(this.scene, 'OBJ/King.obj');
        }
        
        else if(this.type=="p")
        {
            this.piece= new CGFOBJModel(this.scene, 'OBJ/Pawn.obj');
        }

        else if(this.type=="n")
        {
            this.piece= new CGFOBJModel(this.scene, 'OBJ/Knight.obj');
        }
    }

    display()
    {
        this.scene.pushMatrix();

        this.material.apply();

        if(this.animation!=null)
        {
            this.scene.translate(this.animation.cumulative[0],this.animation.cumulative[1],this.animation.cumulative[2]);

           // console.log(this.animation.cumulative);
        }

        if(this.color=="b")
        {
            this.scene.rotate(Math.PI, 0, 0, 1);
            this.scene.translate(-0.5,1.5,0)
        } 
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.translate(0.25,-0.06,0.75 );
        this.scene.scale(0.25,0.25,0.25);

        if(this.piece!=null)
        this.piece.display(); 
    
        this.scene.popMatrix();
    }

    update(t)
    {
        
        this.animation.cumulative[0]=this.animation.cumulative[0]+this.animation.trans_vec[this.animation.current][0];
        this.animation.cumulative[1]=this.animation.cumulative[1]+this.animation.trans_vec[this.animation.current][1];
        this.animation.cumulative[2]=this.animation.cumulative[2]+this.animation.trans_vec[this.animation.current][2];
        this.animation.current++;
        if(this.animation.current>=this.animation.trans_vec.length)
        {    
            return 1;
        }
        return 0;
    }
}