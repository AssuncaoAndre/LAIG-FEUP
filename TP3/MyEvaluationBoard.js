class MyEvaluationBoard extends CGFobject {
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
    constructor(scene) {
        super(scene);
        this.rectangle=new MyRectangle(this.scene,0,0,3.6,2);
        this.title=new MySpriteText(this.scene," Evaluation");
        this.text=new MySpriteText(this.scene,"");
        this.time=new MySpriteText(this.scene," Time: 0");
    }

    update(t)
    {
        var s=this.scene.orchestrator.evaluation.toString();
        var aux="";
        for(var i=0;i<6-Math.ceil(s.length/2);i++)
        {
            aux=aux+" ";
        }
        this.text.text=aux+this.scene.orchestrator.evaluation;
        this.time.text=" Time: "+ this.scene.orchestrator.time;
    }

    display()
    {
        this.scene.pushMatrix();
        this.rectangle.display();
        this.scene.translate(0,0,0.01)
        this.scene.pushMatrix();

            this.scene.translate(0,1.5,0);
            this.scene.scale(0.6,0.6,0.6);
            this.title.display();

        this.scene.popMatrix();


        this.scene.pushMatrix();

            this.scene.translate(0,1.1,0);
            this.scene.scale(0.6,0.6,0.6);
            this.text.display();
            
        this.scene.popMatrix(); 

        this.scene.pushMatrix();

            this.scene.translate(0,0.4,0);
            this.scene.scale(0.6,0.6,0.6);
            this.time.display();
            
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
}