
const { Chess } =require("../../lib/chess/chess.js/chess.js");
var stockfish = require("stockfish"); 
const http = require('http');
const express = require('express');
const cors = require('cors');
var position;
var got_uci;
var started_thinking;
var strength_vec=[3,20];
var strength;
var play=0;

global.flag=0;

global.computer_play;
global.computer_eval;

var engine=stockfish(); 
const app=express();
app.use(cors());

const chess=new Chess();


app.get('/moves/:tile', (req,res)=>{
   res.send(chess.moves({square:req.params.tile, verbose:true}));
});

app.get('/board', (req,res)=>{
   res.send(chess.board());
});

app.get('/turn', (req,res)=>{
   res.send(chess.turn());
});

app.get('/move/:from/:to', (req,res)=>{
	ret=chess.move({from: req.params.from, to: req.params.to });
   if(ret==null)
   res.send("null");
   else res.send(ret);
});

app.get('/move_bot/:move', (req,res)=>{
    
   ret=chess.move(req.params.move, { sloppy: true });
   res.send(ret);
});

app.get('/promotion/:from/:to/:promotion', (req,res)=>{
   ret=chess.move({from: req.params.from, to: req.params.to, promotion: req.params.promotion});
   res.send(ret);
});

app.get('/game_over', (req,res)=>{
   res.send(chess.game_over());
});

app.get('/in_checkmate', (req,res)=>{
   res.send(chess.in_checkmate());
});

app.get('/in_draw', (req,res)=>{
   res.send(chess.in_draw());
});

app.get('/reset', (req,res)=>{
   res.send(chess.reset());
});

app.get('/eval', async (req,res)=>{
        var cached_flag=global.flag;
		strength=20;
		position="fen "+chess.fen();
		//console.log(position);
        send_to_engine("uci");
        while(cached_flag==global.flag)
        {
            await sleep(30);
        }
   res.send(global.computer_eval);
 });

 app.get('/undo', async (req,res)=>{
    res.send(chess.undo());
});

app.get('/computer_play/:level', async (req,res)=>{
	if(req.params.level>1)
	{
        var cached_flag=global.flag;
		strength=strength_vec[req.params.level-2];
		position="fen "+chess.fen();
        send_to_engine("uci");
        global.play=1;
        while(cached_flag==global.flag)
        {
            await sleep(30);
        }
	}
	else {
		var random=Math.floor((Math.random() * chess.moves().length-1) + 0);
		global.computer_play=chess.moves({ verbose: true })[random].san;
    }
    global.play=0;
   res.send(global.computer_play);
}); 

const port= 8081;

try{app.listen(port, ()=>{console.log("listening on port "+port)});}
catch(err){
	console.log("Port "+port+" is already in use. Aborting")
} 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

function send_to_engine(str)
{
    //console.log("Sending: " + str)
    engine.postMessage(str);
}

engine.onmessage = function (line)
{
    var match;
    var split=line.split("score");
    if(split[0]!=line)
    {
        split2=split[1];
        var split=split2.split(" ");
        global.computer_eval=split[1]+ " "+ split[2];
        //console.log("eval: "+global.computer_eval);
    }
     //console.log("Line: " + line) 
    
    if (typeof line !== "string") {
/*           console.log("Got line:");
        console.log(typeof line);
        console.log(line);   */
        return;
    }
    
    if (!got_uci && line === "uciok") {
        got_uci = true;
        if (position) {
			send_to_engine("ucinewgame");
			send_to_engine("setoption name Skill Level value "+strength);
			send_to_engine("position " + position);
            //send_to_engine("eval");
            //send_to_engine("d");
        }
        if(global.play==1)
        {
            console.log("depth 20")
            send_to_engine("go depth 20");
        }
        send_to_engine("go");
    } else if (!started_thinking && line.indexOf("info depth") > -1) {
        //console.log("Thinking...");
        started_thinking = true;
        setTimeout(function ()
        {
            send_to_engine("stop");
        }, 1000 * 10);
    } else if (line.indexOf("bestmove") > -1) {
        match = line.match(/bestmove\s+(\S+)/);
        if (match) {
			//console.log("Best move: " + match[1]);
            global.computer_play=match[1];
            global.flag++;
            //console.log(global.computer_play);
            got_uci=false;
        }
    }
};




