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

        this.bot1="Bot 1 (random)";
        this.bot2="Bot 2 (strength: 3)";
        this.bot3="Bot 3 (strength: 20)";
        this.players=['Human',this.bot1,this.bot2,this.bot3];

        this.promotions=['Queen','Rook','Knight','Bishop'];
        this.promotions_map=[];
        this.promotions_map['Queen']='q';
        this.promotions_map['Rook']='r';
        this.promotions_map['Knight']='n';
        this.promotions_map['Bishop']='b';

        this.time_per_play=600;
        this.start_time=null;
        this.time=600;
        this.bot_promotion=null;
        this.is_managed=1;
        this.game_over=0;
       
        this.is_moving=null;
        this.request=null;
        this.evaluation_on=true;
        this.evaluation=0;

        this.is_promoting=null;
        this.promotion='Queen';


        this.is_human_playing=0;

        this.white_player="Human";
        this.black_player="Human";

        this.turn="w";
        this.picking=true;
        this.stopped_moving=1;
        this.gameboard=null;

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
                            this.human_play(move);
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }
    update(t)
    {
        //if(this.time<0)this.time=0;
        if(this.game_over==1)
        {
            //this.time=0;
            this.evaluation="end";
        }
        if(this.game_over==0)
        {

            if(this.start_time!=null)
            this.time=this.time_per_play-Math.floor((t-this.start_time)/1000)
            if(this.time<=0)
            {
                this.check_end();
            }
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
    }

    async check_end()
    {
        await sleep(50);
        if(this.time<=0)
        {
            this.time=0;
            alert(getRequest("turn")=="w"?"Black wins by time":"White wins by time");
            this.game_over=1;
        }
        else if (getRequest("game_over"))
        {
            
            if(getRequest("in_checkmate"))
            alert(getRequest("turn")=="w"?"Black wins":"White wins");
            else if(getRequest("in_draw"))
            alert("Draw");
            this.game_over=1;
        }
        else
        {
            if(this.evaluation_on)
            this.update_eval();

            this.manage_play();
        } 
    }

    human_play(move)
    {
        this.turn=getRequest("turn");
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
            
            
            this.move_flags=getRequest("move/"+this.gameboard.current_move+"/"+move);
            if(this.move_flags==null)
            {
                prom=this.promotions_map[this.promotion];
                this.move_flags=getRequest("promotion/"+this.gameboard.current_move+"/"+move+"/"+prom);                              
                
            }
            this.gameState=getRequest("board");
            this.gameboard.resetSelection();
            
            this.gameboard.move(this.gameboard.current_move, move);
            
            
            if(prom!=0)
            this.is_promoting=this.turn; 
        }
    }

    bot_play()
    {
        this.is_managed=0;
        this.gameboard.resetSelection();
        this.is_bot_playing=true;
        if(this.turn=="w")
        {
            var level=this.white_player==this.bot1?'1':this.white_player==this.bot2?'2':this.white_player==this.bot3?'3':'1';
            var move_bot=getRequest("computer_play/"+level);
            console.log("white bot");

        }
        else 
        {
            var level=this.black_player==this.bot1?'1':this.black_player==this.bot2?'2':this.black_player==this.bot3?'3':'1';
            var move_bot=getRequest("computer_play/"+level);
            console.log("black bot");
        }
        console.log(move_bot);
        this.move_flags=getRequest("move_bot/"+move_bot);
        console.log(this.move_flags);
        this.gameboard.move(this.move_flags.from, this.move_flags.to);
        

        if(this.move_flags.flags=="p" ||this.move_flags.flags=="cp"||this.move_flags.flags=="np")
        {
            this.bot_promotion=this.move_flags.promotion;
            this.is_promoting=this.turn; 
        }

        this.is_bot_playing=false;
        this.turn=getRequest("turn");
    }

    async setWhitePlayer()
    {
        while(!this.is_managed)
        await sleep(50);
        this.manage_play();
    }   

    async setBlackPlayer()
    {
        while(!this.is_managed)
        await sleep(50);
        this.manage_play();
    }

    async manage_play()
    {
        this.start_time=Date.now();
        //await sleep(200);
        this.is_managed=1;
        this.turn=getRequest("turn");
        if(this.turn=="b"&&this.black_player!="Human")
        {
            console.log(this.turn,this.black_player);
            this.bot_play();
        }
        else if(this.turn=="w"&&this.white_player!="Human")
        {
            console.log(this.turn,this.white_player);
            this.bot_play();
        }
    }

    update_eval()
    {
        this.turn=getRequest("turn/");
        this.evaluation=getRequest("eval/");
        console.log("start evaluation: "+this.evaluation)
        var split=this.evaluation.split("cp");
        if(split[0]!=this.evaluation)
        {
            var split2=split[1].split(" ");
            split2=split2[1]/100;
            if(this.turn=="b")
            var split2=split2*(-1);
            this.evaluation=split2;
        }
       
        console.log("final evaluation: "+this.evaluation)
    }

    reset()
    {
        getRequest("reset");
        this.gameState=getRequest("board");
        this.gameboard.reset();

        this.time_per_play=600;
        this.start_time=null;
        this.time=600;
        this.bot_promotion=null;
        this.is_managed=1;
        this.game_over=0;
        
        this.is_moving=null;
        this.request=null;
        this.evaluation_on=true;
        this.evaluation=0;

        this.is_promoting=null;
        this.promotion='Queen';


        this.is_human_playing=0;

        this.white_player="Human";
        this.black_player="Human";

        this.turn="w";
        this.picking=true;
        this.stopped_moving=1;
    }
    
}

function getRequest(requestString, onSuccess, onError)
    {
        var requestPort =  8081;
        request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, false);

        request.onload = onSuccess || function(data){console.log("Request successful: "+requestString)};
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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
     }