
const { Chess } =require("../../lib/chess/chess.js/chess.js");
const http = require('http');
const express = require('express');
const cors = require('cors');

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
	if(ret=chess.move({from: req.params.from, to: req.params.to })==null)
	res.send("null");
	res.send(ret);
});

app.get('/promotion/:from/:to/:promotion', (req,res)=>{
	
	res.send(chess.move({from: req.params.from, to: req.params.to, promotion: req.params.promotion}));
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

const port= /* process.env.PORT ||*/  8081
app.listen(port, ()=>console.log("listening on port "+port)); 
