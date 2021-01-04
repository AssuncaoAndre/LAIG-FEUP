# LAIG 2020/2021 - TP3 - User Manul

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

----

## Regras do jogo

Este é o clássico jogo de xadrez, tem umas [regras](https://pt.wikipedia.org/wiki/Leis_do_xadrez#Movimento_e_captura_das_pe%C3%A7as) muito conhecidas. Neste trabalho foram implementadas todas as regras incluindo as especiais como roques e captura "en passant".

O objetivo do jogo é colocar o rei adversário numa posição tal em que será capturado na próxima jogada, xeque-mate.

O cavalo mexe-se em L, duas casas para um lado e outra na perpendicular, o bispo move-se na diagonal, a torre na horizontal e vertical, a Dama na vertical, horizontal e vertical, o rei move-se como a Dama, mas apenas uma casa de cada vez e o peão move-se uma casa para a frente e captura na diagonal. Chegando o peão ao outro lado do tabuleiro pode ser promovido para uma peça à escolha do jogador a quem o peão pertence.

----

## Instruções de uso
O jogo começa quando é movimentada a primeira peça. Para se movimentar uma peça é preciso clicar em cima da peça e depois numa casa válida, ou seja, marcada por uma marca verde.
As funcionalidades adicionais do jogo são utilizadas a partir da interface no canto superior direito. É possível mudar de cena, especificar o jogador de cada lado (humano ou 1 de 3 bots), especificar a peça para qual se quer promover se a promoção for possível na jogada seguinte, mudar de câmara, retroceder jogadas (undo), visualizar um filme do jogo, que começa no iniício e acaba no instante atual e dar reset ao tabuleiro e aos tempos.
Há dois contadores de tempo que mostram o tempo restante para a jogada e e a avaliação do estado de jogo segundo o computador.