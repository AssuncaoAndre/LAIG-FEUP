# LAIG 2020/2021 - TP3

## Group T07G09
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Luís Assunção    | 201806140 |up201806140@fe.up.pt|
| João Rocha       | 201806261 |up201806261@fe.up.pt|

----
## Informação do Projeto

Este projeto consiste numa implementação de uma interface gráfica para o popular jogo de tabuleiro xadrez. 
Há dois programas auxiliares a assegurar a lógica do jogo, [chess.js](https://github.com/jhlywa/chess.js) para validar jogadas e [stockfish.js](https://github.com/nmrugg/stockfish.js/), o popular engine de xadrez Stockfish adaptado a Javascript, para  para avaliar o estado de jogo e permiter a utilização de bots. 

Por uma questão de equidade para com os restantes colegas que estão a fazer o servidor em prolog, nós fazemos também um servidor para comuncicar com a interface a partir de pedidos HTTPS. Por esse motivo, o backend do projeto é realizado através de um servidor escrito em node.js, que utiliza as packages [cors](https://www.npmjs.com/package/cors), [express](https://www.npmjs.com/package/express) e [stockfish](https://www.npmjs.com/package/stockfish). 

Todos os objetivos propostos para o trabalho foram atingidos com sucesso.


## Issues/Problemas

- No know issue

## Foto 
![Foto of the game](https://github.com/fuscati/LAIG-FEUP/raw/master/TP3/3D%20chess%20screenshot.png)
