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

### Extensão à LSF

----
## Instalação

Para correr o programa é necessário ter [node.js](https://nodejs.org/en/) instalado no computador, em conjunto com algumas packages, nomeadamente cors, express e stockfish.

Num ambiente Debian/Ubuntu:
```
sudo apt-get install node
npm i cors
npm i express
npm i stockfish
```
----
## Como correr

Começar por correr o servidor, abrindo o terminal na pasta server/ do trabalho e executar o comando ```node MyServer.js```.
Estando o servidor a correr apenas é preciso abrir o proejto no browser e desfrutar da experiência.

## Issues/Problemas

- No know issue
