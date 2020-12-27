class MyGameOrchestrator extends CGFobject {
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

        getRequest("reset");
        this.gameState=getRequest("board");

        this.gameboard=null;
        this.sceneInited = false;
        this.is_moving=null;
        this.is_moving2=null;
        this.request=null;

        this.is_promoting=null;
        this.promotions=['Queen','Rook','Knight','Bishop'];
        this.promotion='Queen';
        this.promotions_map=[];
        this.promotions_map['Queen']='q';
        this.promotions_map['Rook']='r';
        this.promotions_map['Knight']='n';
        this.promotions_map['Bishop']='b';
        
        

    }

    managePicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj) {
                        var customId = this.scene.pickResults[i][1];
                       
                        
                            var letra_n=Math.floor(customId%8);
                            var numero=Math.floor(customId/8+1);
                            var letra=String.fromCharCode("a".charCodeAt(0)+letra_n);
                            var move=letra+numero;
                            if(this.gameboard.is_tile_selected(move)==0)
                            {
                                this.gameboard.current_move=move;
                                
                                var possible_moves=getRequest("moves/"+move);
                                
                                this.gameboard.resetSelection();
                                this.gameboard.selectPossibleMoves(possible_moves);					
                            }
                            else 
                            {
                                var prom=0;
                                var turn=getRequest("turn");
                                this.move_flags=getRequest("move/"+this.gameboard.current_move+"/"+move);
                                
                                
                                if(this.move_flags=="null")
                                {
                                    prom=this.promotions_map[this.promotion];
                                    this.move_flags=getRequest("promotion/"+this.gameboard.current_move+"/"+move+"/"+prom);                              
                                    console.log(this.move_flags);
                                }
                                this.gameState=getRequest("board");
                                this.gameboard.resetSelection();
                                
                                this.gameboard.move(this.gameboard.current_move, move);
                                
                                if(prom!=0)
                                this.is_promoting=turn;
                                
                                
                            }
                        

					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }
    update(t)
    {

        if(this.is_moving!=null)
        {
            if(this.is_moving[4]==null)
            {
                if(this.gameboard.matrix[this.is_moving[0]][this.is_moving[1]].piece.update(t)==1)
                this.gameboard.stop_move();
    
            }
            else{
                var aux_to_coords=[this.is_moving[2],this.is_moving[3]];
                if(this.move_flags.flags=="e")
                {
                    
                    if(this.move_flags.color=="w")
                    {
                        aux_to_coords[0]=aux_to_coords[0]-1;                       
                    }
                    else aux_to_coords[0]=aux_to_coords[0]+1;
                }
    
                if(this.gameboard.matrix[aux_to_coords[0]][aux_to_coords[1]].piece.update(t)==1)
                this.gameboard.stop_move();
            }
        }
    }

    check_end()
    {
        if (getRequest("game_over"))
        {
            
            if(getRequest("in_checkmate"))
            alert(getRequest("turn")=="w"?"Black wins":"White wins");
            else if(getRequest("in_draw"))
            alert("Draw");
        }
    }

    
    
}

function getRequest(requestString, onSuccess, onError)
    {
        var requestPort =  8081;
        request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, false);

        request.onload = onSuccess || function(data){console.log("Request successful")};
        request.onerror = onError || function(){console.log("Error waiting for response");};
        
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
        if(isJson(request.response))
        ret = JSON.parse(request.response);
        else ret=request.response;

        return(ret);
    }

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }