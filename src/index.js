import "./styles.css";
import { Player } from "./player";
import { handleDom } from "./dom";

export const game = function(){
    const player1 = new Player("player1");
    const player2 = new Player("player2");
    player1.gameboard.setShipCoordinates("2",["A",2],["A",3]);
    player1.gameboard.setShipCoordinates("5",["A",1],["E",1]);

    player2.gameboard.setShipCoordinates("2",["B",2],["B",3]);
    player2.gameboard.setShipCoordinates("5",["C",1],["H",1]);
    const domHandler = handleDom();
    const player1DomGameBoard = domHandler.createGameboard();
    const player2DomGameBoard = domHandler.createGameboard();
    player1.setDomGameboard(player1DomGameBoard);
    player2.setDomGameboard(player2DomGameBoard);
    domHandler.placeShipsOnGameboard(player1.gameboard,player1DomGameBoard);
    domHandler.placeShipsOnGameboard(player2.gameboard,player2DomGameBoard);
    domHandler.appendGameboardOnDOM(player1DomGameBoard,"player1");
    domHandler.appendGameboardOnDOM(player2DomGameBoard,"player2");
    const eventHandler = eventListeners();
    eventHandler.setPlayers(player1,player2);
    eventHandler.setEventListenersOnGameboard(player2DomGameBoard);
}
export const eventListeners = function(){
    const domHandler = handleDom();
    let player1;
    let player2;

    function setPlayers(p1,p2){
        player1 = p1;
        player2 = p2;
    }
    function setEventListenersOnGameboard(gameboard){
        gameboard.addEventListener("click",handleClickOnGameBoard);
    }
    function handleClickOnGameBoard(event){
        const gameboard = event.currentTarget;
        if(!event.target.classList.contains("cell")) return;
        let coordinateClass = event.target.classList[event.target.classList.length-1];
        let coordinateAsArray = coordinateClass.split('');
        coordinateAsArray[1] = parseInt(coordinateAsArray[1]);

        let waitingPlayer;
        let playingPlayer;

        if(player2.getDomGameboard() === gameboard){
            waitingPlayer = player2;
            playingPlayer = player1;
        } else{
            waitingPlayer = player1;
            playingPlayer = player2;
        }
        let attackResult = waitingPlayer.gameboard.receiveAttack(coordinateAsArray);
        if(attackResult === false){
            removeEventListenersOnGameboard(waitingPlayer.getDomGameboard());
            setEventListenersOnGameboard(playingPlayer.getDomGameboard());
            domHandler.markMissedAttacksOnDOMGameboard(waitingPlayer.gameboard,waitingPlayer.getDomGameboard());
            domHandler.showMessageOnInfoContainer(playingPlayer.getName(),"missed");
            return;
        }else if(attackResult === true){
            domHandler.markSuccessfulAttacksOnDOMGameboard(waitingPlayer.gameboard,waitingPlayer.getDomGameboard());
            if(waitingPlayer.gameboard.haveAllShipsBeenSunk()===true){
                removeEventListenersOnGameboard(waitingPlayer.getDomGameboard());
                endGame(playingPlayer.getName());
                return;
            }
             domHandler.showMessageOnInfoContainer(playingPlayer.getName(),"hit");
            return;
        }
        domHandler.showMessageOnInfoContainer(playingPlayer.getName(),"null");
    }
    function removeEventListenersOnGameboard(gameboard){
        gameboard.removeEventListener("click",handleClickOnGameBoard);
    }
    function endGame(playerName){
        const infoContainer = document.querySelector(".info-container");
        infoContainer.textContent=playerName+ " has won!";
    }
    return{
        setEventListenersOnGameboard,
        handleClickOnGameBoard,
        setPlayers
    }
}

if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
    game();
}


