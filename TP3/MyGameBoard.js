class MyGameBoard extends CGFobject {
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
    constructor(scene, x1, y1, x2, y2) {

        super(scene);
        this.auxiliar_board=new MyAuxiliarBoard(scene, x1, y1/2, x2, y2);
        this.scene.orchestrator.gameboard=this;
        this.x1 = x1;
        this.x2 = x2;
        this.y2 = y2;
        this.y1 = y1;
        var sizex=Math.abs(x2-x1)/8;
        var sizey=Math.abs(x2-x1)/8;

        this.shader= new CGFshader(this.scene.gl,"shaders/select_tile_shader.vert","shaders/select_tile_shader.frag");
        
        this.black_tile=new CGFtexture(this.scene, "./scenes/images/black.png");
        this.white_tile=new CGFtexture(this.scene, "./scenes/images/white.jpeg");
        
        this.white_piece= new CGFappearance(scene);
        this.white_piece.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.white_piece.setDiffuse(0.8, 0.8, 0.8, 1.0);
        this.white_piece.setSpecular(0.8, 0.8, 0.8, 1.0);

        this.black_piece=new CGFappearance(scene);
        this.black_piece.setAmbient(0.2, 0.2, 0.2, 0.1);
        this.black_piece.setDiffuse(0.2, 0.2, 0.2, 0.1);
        this.black_piece.setSpecular(0.3, 0.3, 0.3, 1);

        this.default_material=new CGFappearance(scene);
        this.default_material.setAmbient(0, 0, 0, 1.0);
        this.default_material.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.default_material.setSpecular(0.5, 0.5, 0.5, 1.0);


        this.is_castling=0;
        this.selected=new CGFtexture(this.scene, "./scenes/images/selected.png");
        this.selected.bind(1);
        this.current_move=null;
        this.matrix = [];




        for (var i = 0; i < 4; i++) { 
            var mat = []; 
            for (var j = 0; j < 4; j++) {
                mat.push(new MyTile(this.scene,sizex,sizey,this.black_tile,this.selected,this.shader));
                mat.push(new MyTile(this.scene,sizex,sizey,this.white_tile,this.selected,this.shader));
            }
            this.matrix.push(mat);
            var mat = []; 
            for (var j = 0; j < 4; j++) {
                mat.push(new MyTile(this.scene,sizex,sizey,this.white_tile,this.selected,this.shader));
                mat.push(new MyTile(this.scene,sizex,sizey,this.black_tile,this.selected,this.shader));
            }
            this.matrix.push(mat);
         }  
         

        for (var i=0;i<8;i++)
        {
            this.matrix[1][i].piece=new MyPiece(this.scene,"p",this.white_piece,"w");
        }

        for (var i=0;i<8;i++)
        {
            this.matrix[6][i].piece=new MyPiece(this.scene,"p",this.black_piece,"b");
        } 

        this.matrix[0][1].piece=new MyPiece(this.scene,"n",this.white_piece,"w");
        this.matrix[0][0].piece=new MyPiece(this.scene,"r",this.white_piece,"w");
        this.matrix[0][2].piece=new MyPiece(this.scene,"b",this.white_piece,"w");
        this.matrix[0][4].piece=new MyPiece(this.scene,"k",this.white_piece,"w");
        this.matrix[0][3].piece=new MyPiece(this.scene,"q",this.white_piece,"w");
        this.matrix[0][5].piece=new MyPiece(this.scene,"b",this.white_piece,"w");
        this.matrix[0][6].piece=new MyPiece(this.scene,"n",this.white_piece,"w");
        this.matrix[0][7].piece=new MyPiece(this.scene,"r",this.white_piece,"w");

        this.matrix[7][0].piece=new MyPiece(this.scene,"r",this.black_piece,"b");
        this.matrix[7][1].piece=new MyPiece(this.scene,"n",this.black_piece,"b");
        this.matrix[7][2].piece=new MyPiece(this.scene,"b",this.black_piece,"b");
        this.matrix[7][4].piece=new MyPiece(this.scene,"k",this.black_piece,"b");
        this.matrix[7][3].piece=new MyPiece(this.scene,"q",this.black_piece,"b");
        this.matrix[7][5].piece=new MyPiece(this.scene,"b",this.black_piece,"b");
        this.matrix[7][6].piece=new MyPiece(this.scene,"n",this.black_piece,"b");
        this.matrix[7][7].piece=new MyPiece(this.scene,"r",this.black_piece,"b"); 
    }



    display(){    

       
        
            this.auxiliar_board.display();
        
        if(this.scene.orchestrator.is_moving==null)
            this.scene.orchestrator.managePicking();
            this.scene.clearPickRegistration();

        
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,1,0,0);
        for (var i = 0; i < 8; i++) {
            
            this.scene.pushMatrix();
            for (var j = 0; j < 8; j++) {
               
                this.scene.registerForPick(i*8+j, this.matrix[i][j]);

                this.default_material.apply();
                this.matrix[i][j].display();
                this.scene.translate(0.5,0,0);
            }
            this.scene.popMatrix();
            this.scene.translate(0,0.5,0);
         }  
         this.scene.popMatrix();

    }

    selectPossibleMoves(possibleMoves){
         if(possibleMoves==null)
        return; 
        
        for(var i=0;i<possibleMoves.length;i++)
        {
            var coords=this.moveToCoords(possibleMoves[i].to);
            this.matrix[coords[0]][coords[1]].is_selected=1; 
        } 
    }

    resetSelection(){

       
       for(var i=0;i<8;i++)
       {
           for(var j=0;j<8;j++)
           {
               this.matrix[i][j].is_selected=0;
           }
       } 
   }

    moveToCoords(move)
    {

        //console.log(move);
        var coords=[];
            coords.push(move[1]-1);
            coords.push(move[0].charCodeAt(0)-"a".charCodeAt(0));
        return coords;
    }

    move(from_move, to_move)
    {
        var from_coords=this.moveToCoords(from_move);
        var to_coords=this.moveToCoords(to_move);
        this.effective_move(from_coords,to_coords);
        
        
    }

    effective_move(from_coords,to_coords)
    {
        
        var aux_to_coords=to_coords;
        this.scene.orchestrator.is_moving=[from_coords[0],from_coords[1],to_coords[0],to_coords[1],null,null];
        
        if(this.scene.orchestrator.move_flags.flags=="e")
        {
            
            if(this.scene.orchestrator.move_flags.color=="w")
            {
                aux_to_coords[0]=aux_to_coords[0]-1;
               
            }
            else aux_to_coords[0]=aux_to_coords[0]+1;
        }

        if(this.matrix[aux_to_coords[0]][aux_to_coords[1]].piece!=null )
        {
            var auxiliar_coords=this.get_empty_auxiliar();
            this.scene.orchestrator.is_moving[4]=auxiliar_coords[0];
            this.scene.orchestrator.is_moving[5]=auxiliar_coords[1];
            auxiliar_coords[0]=12-auxiliar_coords[0];

            var distance=this.get_distance(aux_to_coords,auxiliar_coords)/2;
            var distance_x = (auxiliar_coords[1]-aux_to_coords[0])/2;
            var distance_y = (auxiliar_coords[0]-aux_to_coords[1])/2;
            var divisions=30+distance*15;
            
        }
        else
        {
            aux_to_coords[0]=this.scene.orchestrator.is_moving[2];
            aux_to_coords[1]=this.scene.orchestrator.is_moving[3];
            
            
            var distance=this.get_distance(from_coords,to_coords)/2;
            var distance_x = (aux_to_coords[0]-from_coords[0])/2;
            var distance_y = (aux_to_coords[1]-from_coords[1])/2;
            var divisions=100+distance*50;
        }


        var animation=new MyComputedAnimation();

        var max_height=2;



        var increment=distance/divisions;
        var increment_x=distance_x/divisions;
        var increment_y=distance_y/divisions;

        var total_increment=0;
        var previous_height=0;
        
        for(var i=0;i<divisions;i++)
        {
            total_increment=total_increment+increment;
            
            animation.trans_vec.push([increment_y,increment_x,this.quadratic(distance,total_increment)-previous_height]); 
            previous_height=this.quadratic(distance,total_increment);
        }

        if(this.matrix[aux_to_coords[0]][aux_to_coords[1]].piece!=null )
        {
            console.log([aux_to_coords[0],aux_to_coords[1]]);
            this.matrix[aux_to_coords[0]][aux_to_coords[1]].piece.animation=animation;
        }

        else 
        this.matrix[from_coords[0]][from_coords[1]].piece.animation=animation;
        
    }

    get_empty_auxiliar()
    {
        for (var i=0;i<4;i++)
        {
            for (var j=0;j<8;j++)
            {
                if(this.auxiliar_board.matrix[i][j].piece==null)
                {
                   
                    var vex=[];
                    vex.push(i);
                    vex.push(j);
                    return vex;
                }
            }
        }
    }

    quadratic(distance,x)
    {
        var f=(distance/2);
        var d=1/(f*f); //altura/(f*f)
        return (-d*(x-(distance/2))*(x-(distance/2))+1); // no fim é + altura
    }

    get_distance(from,to)
    {
        return Math.sqrt((from[0]-to[0])*(from[0]-to[0])+(from[1]-to[1])*(from[1]-to[1]))
    }


    is_tile_selected(move)
    {
        //console.log(move);

        var tile_coords=this.moveToCoords(move);
        return(this.matrix[tile_coords[0]][tile_coords[1]].is_selected)
        
    }
    promote(to_coords,color)
    {
        
        if(color=="w")
        var material=this.white_piece;
        else
        var material=this.black_piece; 
        var piece_text=this.scene.orchestrator.promotion;
        var piece=this.scene.orchestrator.promotions_map[piece_text];
        
        this.matrix[to_coords[0]][to_coords[1]].piece= new MyPiece(this.scene,piece,material,color);
        this.scene.orchestrator.is_promoting=null;
    }

    stop_move()
    {
        var aux_to_coords=[];
        aux_to_coords[0]=this.scene.orchestrator.is_moving[2];
        aux_to_coords[1]=this.scene.orchestrator.is_moving[3];

        if(this.scene.orchestrator.move_flags.flags=="e")
        {
            
            if(this.scene.orchestrator.move_flags.color=="w")
            {
                aux_to_coords[0]=aux_to_coords[0]-1;
               
            }
            else aux_to_coords[0]=aux_to_coords[0]+1;
        }

        if(this.scene.orchestrator.is_moving[4]!=null)
        {
            console.log(this.scene.orchestrator.is_moving);
            this.matrix[aux_to_coords[0]][aux_to_coords[1]].piece.animation=null;
            this.auxiliar_board.matrix[this.scene.orchestrator.is_moving[4]][this.scene.orchestrator.is_moving[5]].piece=
            this.matrix[aux_to_coords[0]][aux_to_coords[1]].piece;
            this.matrix[aux_to_coords[0]][aux_to_coords[1]].piece=null;
            this.scene.orchestrator.is_moving[4]==null;
            this.scene.orchestrator.is_moving[5]==null;
            var from_coords=[this.scene.orchestrator.is_moving[0],this.scene.orchestrator.is_moving[1]];
            var to_coords=[this.scene.orchestrator.is_moving[2],this.scene.orchestrator.is_moving[3]];
            this.effective_move(from_coords,to_coords);
        }

        else
        {

            this.matrix[this.scene.orchestrator.is_moving[0]][this.scene.orchestrator.is_moving[1]].piece.animation=null;
            this.matrix[this.scene.orchestrator.is_moving[2]][this.scene.orchestrator.is_moving[3]].piece=
            this.matrix[this.scene.orchestrator.is_moving[0]][this.scene.orchestrator.is_moving[1]].piece;
            this.matrix[this.scene.orchestrator.is_moving[0]][this.scene.orchestrator.is_moving[1]].piece=null;
            if(this.scene.orchestrator.is_promoting!=null)
            {
                this.promote([this.scene.orchestrator.is_moving[2],this.scene.orchestrator.is_moving[3]],this.scene.orchestrator.is_promoting); 
            }
            
            if(this.scene.orchestrator.move_flags.flags=="k" && this.is_castling==0)
            {
                this.is_castling=1;
      
                this.effective_move([this.scene.orchestrator.is_moving[0],this.scene.is_moving[1]+3],[this.scene.is_moving[2],this.scene.is_moving[3]-1]);
            }
            else if(this.scene.orchestrator.move_flags.flags=="q" && this.is_castling==0)
            {
                
                this.is_castling=1;
                console.log([this.scene.orchestrator.is_moving[0],this.scene.orchestrator.is_moving[1]-4],[this.scene.orchestrator.is_moving[2],this.scene.orchestrator.is_moving[3]+1]);
                this.effective_move([this.scene.orchestrator.is_moving[0],this.scene.orchestrator.is_moving[1]-4],[this.scene.orchestrator.is_moving[2],this.scene.orchestrator.is_moving[3]+1]);
            }
            else 
            {
                this.scene.orchestrator.is_moving=null
                this.is_castling=0;
            };
            this.scene.orchestrator.check_end();
        }

    }



}