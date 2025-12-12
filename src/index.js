import "./styles.css";
import { Player } from "./player";
import { handleDom } from "./dom";

export const game = function(){
    const player1 = new Player("real");
    const player2 = new Player("real");
    player1.gameboard.setShipCoordinates("2",["A",2],["A",3]);
    player1.gameboard.setShipCoordinates("5",["A",1],["E",1]);

    player2.gameboard.setShipCoordinates("2",["B",2],["B",3]);
    player2.gameboard.setShipCoordinates("5",["C",1],["H",1]);
    const domHandler = handleDom();
    domHandler.renderGameboard(player1.gameboard,"player1");
    domHandler.renderGameboard(player2.gameboard,"player2");


}
export const eventListeners = function(){

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
        }else if(attackResult === true){
            if(waitingPlayer.gameboard.haveAllShipsBeenSunk()===true){
                removeEventListenersOnGameboard(waitingPlayer.getDomGameboard());
                endGame(waitingPlayer);
            }
        }
    }
    function removeEventListenersOnGameboard(gameboard){
        gameboard.removeEventListener("click",handleClickOnGameBoard);
    }
    function endGame(player){
        const infoContainer = document.querySelector(".info-container");
        infoContainer.textContent="game over";
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


