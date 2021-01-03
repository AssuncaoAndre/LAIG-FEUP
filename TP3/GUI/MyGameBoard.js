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
    constructor(scene,black_piece,white_piece,black_tile,white_tile,default_material) {

        super(scene);
        this.auxiliar_board=new MyAuxiliarBoard(scene, -2, -1, 2, 2);
        if(this.scene.orchestrator.gameboard!=null)
        {
            this.not_first_gameboard=1;
        }
        this.scene.orchestrator.gameboard=this;
        this.x1 = -2;
        this.x2 = 2;
        this.y2 = 2;
        this.y1 = -2;
        this.sizex=Math.abs(this.x2-this.x1)/8;
        this.sizey=Math.abs(this.x2-this.x1)/8;
        this.shader= new CGFshader(this.scene.gl,"shaders/select_tile_shader.vert","shaders/select_tile_shader.frag");


        this.default_material=default_material;
        this.black_piece=black_piece;
        this.white_piece=white_piece;
        this.black_tile=black_tile;
        this.white_tile=white_tile;
      
        this.selected=new CGFtexture(this.scene, "./scenes/images/selected.png");
        this.selected.bind(1);

        this.is_castling=0;
        this.current_move=null;
        this.matrix = [];




        for (var i = 0; i < 4; i++) { 
            var mat = []; 
            for (var j = 0; j < 4; j++) {
                mat.push(new MyTile(this.scene,this.sizex,this.sizey,this.white_tile,this.selected,this.shader));
                mat.push(new MyTile(this.scene,this.sizex,this.sizey,this.black_tile,this.selected,this.shader));
            }
            this.matrix.push(mat);
            var mat = []; 
            for (var j = 0; j < 4; j++) {
                mat.push(new MyTile(this.scene,this.sizex,this.sizey,this.black_tile,this.selected,this.shader));
                mat.push(new MyTile(this.scene,this.sizex,this.sizey,this.white_tile,this.selected,this.shader));
            }
            this.matrix.push(mat);
         }  
         
         if(!this.not_first_gameboard)
         {
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
        else {
            this.matrix=this.scene.orchestrator.matrix;
        }
        
    }



    display(){    

       
        
        this.auxiliar_board.display();
        

        this.scene.orchestrator.managePicking();


        this.scene.clearPickRegistration();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,1,0,0);
        for (var i = 0; i < 8; i++) {
            
            this.scene.pushMatrix();
            for (var j = 0; j < 8; j++) {
               
                if(this.scene.orchestrator.is_moving==null && !this.scene.orchestrator.is_bot_playing
                   && !this.scene.orchestrator.game_over==1 && !this.scene.orchestrator.movie==1)
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
        
        if(this.scene.orchestrator.move_flags.flags=="e" && this.scene.orchestrator.is_undo==0)
        {
            console.log("here")
            if(this.scene.orchestrator.move_flags.color=="w")
            {
                aux_to_coords[0]=aux_to_coords[0]-1;
               
            }
            else aux_to_coords[0]=aux_to_coords[0]+1;
        }
        if(this.scene.orchestrator.undo_capture!=2)
        {
            console.log("here")
            if(this.matrix[aux_to_coords[0]][aux_to_coords[1]].piece!=null )
            {
                console.log(aux_to_coords)
                console.log("here")
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
                console.log("here")
                aux_to_coords[0]=this.scene.orchestrator.is_moving[2];
                aux_to_coords[1]=this.scene.orchestrator.is_moving[3];
                
                
                var distance=this.get_distance(from_coords,aux_to_coords)/2;
                var distance_x = (aux_to_coords[0]-from_coords[0])/2;
                var distance_y = (aux_to_coords[1]-from_coords[1])/2;
                var divisions=100+distance*50;
                console.log(aux_to_coords)
            }
        }
        else{
            console.log("POR FAVOR NÃO")
            aux_to_coords[0]=this.scene.orchestrator.is_moving[2];
            aux_to_coords[1]=this.scene.orchestrator.is_moving[3];
            
            
            var distance=this.get_distance(from_coords,to_coords)/2;
            var distance_x = (aux_to_coords[0]-from_coords[1])/2;
            var distance_y = (aux_to_coords[1]-from_coords[0])/2;
            console.log(distance_x,distance_y);
            var divisions=60+distance*60;
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
            console.log("here")
            this.matrix[aux_to_coords[0]][aux_to_coords[1]].piece.animation=animation;
        }

        else 
        {
            if(this.scene.orchestrator.undo_capture!=2)
            {
                console.log("here")
                //console.log(from_coords[0],from_coords[1])
                this.matrix[from_coords[0]][from_coords[1]].piece.animation=animation;
            }
            else 
            {
                console.log("here")
                this.auxiliar_board.matrix[from_coords[0]-12][from_coords[1]].piece.animation=animation;
            }
            }
        
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
    async promote(to_coords,color)
    {
        
        if(color=="w")
        var material=this.white_piece;
        else
        var material=this.black_piece; 
        if(this.scene.orchestrator.bot_promotion!=null)
        {
            var piece=this.scene.orchestrator.bot_promotion;
            this.scene.orchestrator.bot_promotion=null;
        }
        else
        {
            var piece_text=this.scene.orchestrator.promotion;
            var piece=this.scene.orchestrator.promotions_map[piece_text];
        }
        
        this.matrix[to_coords[0]][to_coords[1]].piece= new MyPiece(this.scene,piece,material,color);
        this.scene.orchestrator.is_promoting=null;
        
        //this.is_promoted=1;
    }

    async stop_move()
    {
        console.log("at least here")
        var aux_to_coords=[];
        aux_to_coords[0]=this.scene.orchestrator.is_moving[2];
        aux_to_coords[1]=this.scene.orchestrator.is_moving[3];

        if(this.scene.orchestrator.move_flags.flags=="e" && this.scene.orchestrator.undo==0)
        {
            
            if(this.scene.orchestrator.move_flags.color=="w")
            {
                aux_to_coords[0]=aux_to_coords[0]-1;
               
            }
            else aux_to_coords[0]=aux_to_coords[0]+1;
        }

        if(this.scene.orchestrator.is_moving[4]!=null)
        {
            console.log("here")
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
            if(this.scene.orchestrator.undo_capture<2)
            {
                console.log("here")
                this.matrix[this.scene.orchestrator.is_moving[0]][this.scene.orchestrator.is_moving[1]].piece.animation=null;
                this.matrix[this.scene.orchestrator.is_moving[2]][this.scene.orchestrator.is_moving[3]].piece=
                this.matrix[this.scene.orchestrator.is_moving[0]][this.scene.orchestrator.is_moving[1]].piece;
                this.matrix[this.scene.orchestrator.is_moving[0]][this.scene.orchestrator.is_moving[1]].piece=null;
                if(this.scene.orchestrator.undo_capture==1)
                this.scene.orchestrator.undo_capture=2;
            }
            else 
            {
                console.log("here");
                this.auxiliar_board.matrix[this.scene.orchestrator.is_moving[0]-12][this.scene.orchestrator.is_moving[1]].piece.animation=null;
                this.matrix[this.scene.orchestrator.is_moving[2]][this.scene.orchestrator.is_moving[3]].piece=
                this.auxiliar_board.matrix[this.scene.orchestrator.is_moving[0]-12][this.scene.orchestrator.is_moving[1]].piece;
                this.auxiliar_board.matrix[this.scene.orchestrator.is_moving[0]-12][this.scene.orchestrator.is_moving[1]].piece=null;
                this.scene.orchestrator.undo_capture=0;
            }
            if(this.scene.orchestrator.is_promoting!=null)
            {
                await this.promote([this.scene.orchestrator.is_moving[2],this.scene.orchestrator.is_moving[3]],this.scene.orchestrator.is_promoting); 
            }

            if(this.scene.orchestrator.move_flags.flags=="k" && this.is_castling==0 && this.scene.orchestrator.is_undo==0)
            {
                console.log("good castle")
                
                this.is_castling=1;
                
                this.effective_move([this.scene.orchestrator.is_moving[2],this.scene.orchestrator.is_moving[3]+1],[this.scene.orchestrator.is_moving[0],this.scene.orchestrator.is_moving[1]+1]);
            }
            else if(this.scene.orchestrator.move_flags.flags=="q" && this.is_castling==0 && this.scene.orchestrator.is_undo==0)
            {
               
                this.is_castling=1;
               
                this.effective_move([this.scene.orchestrator.is_moving[2],this.scene.orchestrator.is_moving[3]-2],[this.scene.orchestrator.is_moving[0],this.scene.orchestrator.is_moving[1]-1]);
            }

            else if(this.scene.orchestrator.undo_move.flags=="k"&& this.is_castling==0)
            {
                console.log("bad castle")
                this.is_castling=1;
                this.effective_move([this.scene.orchestrator.is_moving[2],this.scene.orchestrator.is_moving[3]+1],[this.scene.orchestrator.is_moving[0],this.scene.orchestrator.is_moving[1]+1]);
            }
            else if(this.scene.orchestrator.undo_move.flags=="q"&& this.is_castling==0)
            {
                this.is_castling=1;
                console.log(this.scene.orchestrator.is_moving);
                this.effective_move([this.scene.orchestrator.is_moving[2],this.scene.orchestrator.is_moving[3]-1],[this.scene.orchestrator.is_moving[0],this.scene.orchestrator.is_moving[1]-2]);
            }

            else if(this.scene.orchestrator.undo_capture==2)
            {
                if(this.scene.orchestrator.undo_move.flags=="e")
                {
                    if(this.scene.orchestrator.undo_move.color=="w")
                    this.undo_capture([this.scene.orchestrator.is_moving[0]-1,this.scene.orchestrator.is_moving[1]]);
                    else  
                    this.undo_capture([this.scene.orchestrator.is_moving[0]+1,this.scene.orchestrator.is_moving[1]]);
                }
                else this.undo_capture([this.scene.orchestrator.is_moving[0],this.scene.orchestrator.is_moving[1]]);
            }

            else 
            {
                this.scene.orchestrator.is_undo=0;
                this.scene.orchestrator.undo_move.flags="";
                this.scene.orchestrator.is_moving=null
                this.is_castling=0;
                this.scene.orchestrator.check_end();

            };
        }

    }
     undo_promotion(move,color)
    {
        var coords=this.moveToCoords(move);

        if(color=="w")
        var material=this.white_piece;
        else
        var material=this.black_piece; 

        this.matrix[coords[0]][coords[1]].piece=new MyPiece(this.scene,"p",material,color);
        
    }

    undo_capture(to_coords)
    {
        
        var auxiliar_coords=this.get_last_capture();
        console.log(auxiliar_coords);
        auxiliar_coords[0]=12-auxiliar_coords[0];
        this.effective_move(auxiliar_coords,to_coords);
    }

    get_last_capture()
    {
        for (var i=3;i>=0;i--)
        {
            for (var j=7;j>=0;j--)
            {
                
                if(this.auxiliar_board.matrix[i][j].piece!=null)
                {
                   
                    var vex=[];
                    vex.push(i);
                    vex.push(j);
                    return vex;
                }
            }
        }
    }

    reset()
    {
        this.auxiliar_board.reset();
        this.is_castling=0;
        this.current_move=null;
        this.matrix = [];


        for (var i = 0; i < 4; i++) { 
            var mat = []; 
            for (var j = 0; j < 4; j++) {
                mat.push(new MyTile(this.scene,this.sizex,this.sizey,this.black_tile,this.selected,this.shader));
                mat.push(new MyTile(this.scene,this.sizex,this.sizey,this.white_tile,this.selected,this.shader));
            }
            this.matrix.push(mat);
            var mat = []; 
            for (var j = 0; j < 4; j++) {
                mat.push(new MyTile(this.scene,this.sizex,this.sizey,this.white_tile,this.selected,this.shader));
                mat.push(new MyTile(this.scene,this.sizex,this.sizey,this.black_tile,this.selected,this.shader));
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

}