import "./styles.css";
import { Player } from "./player";
import { Gameboard } from "./gameboard"
import { handleDom } from "./dom";

export const game = function(){

    const domHandler = handleDom();
    const eventHandler = eventListeners();
    const startGameboard = new Gameboard();

    //create players and their dom boards
    const player1 = new Player("Jay");
    const player2 = new Player("PC");
    const player1DomGameBoard = domHandler.createGameboard();
    const player2DomGameBoard = domHandler.createGameboard();
    player1.setDomGameboard(player1DomGameBoard);
    player2.setDomGameboard(player2DomGameBoard);
    player1.setMode("Human");
    player2.setMode("PC");

    //create start screen
    startGameboard.setShipsRandomly();
    const startDomGameboard = domHandler.createGameboard();
    domHandler.placeShipsOnGameboard(startGameboard,startDomGameboard);
    domHandler.renderStartScreen(startDomGameboard);

    //set eventListeners on start screen
   
    eventHandler.setPlayers(player1,player2);
    eventHandler.setStartGameboard(startGameboard);
    eventHandler.setEventListenerOnShuffleButton();
    eventHandler.setEventListenerOnStartButton();
    /*
    domHandler.appendGameboardOnDOM(player1.getDomGameboard());
    domHandler.appendGameboardOnDOM(player2.getDomGameboard());
    player1.gameboard.setShipsRandomly();
    player2.gameboard.setShipsRandomly();
    domHandler.placeShipsOnGameboard(player1.gameboard,player1.getDomGameboard());
    domHandler.placeShipsOnGameboard(player2.gameboard,player2.getDomGameboard());
    domHandler.renderEndScreen(player1);
    eventHandler.setEventListenerOnNewGameButton();*/
    
}
export const eventListeners = function(){
    const domHandler = handleDom();
    let player1;
    let player2;
    let startGameboard;

    function setPlayers(p1,p2){
        player1 = p1;
        player2 = p2;
    }
    function setStartGameboard(board){
        startGameboard = board;
    }
    function setEventListenersOnGameboard(gameboard,mode){
        if(mode==="PVP"){
            gameboard.addEventListener("click",handleClickOnGameBoard);
        }else if(mode==="PVC"){
            gameboard.addEventListener("click",handleClickOnGameBoardForPlayerVsPC);
        }
    }
    function setEventListenerOnShuffleButton(){
        const shuffleButton = document.querySelector(".shuffle-button");
        if(shuffleButton){
            const startDOMGameboard = document.querySelector(".start-screen .board-container");
            shuffleButton.addEventListener("click",function(){
                startGameboard.setShipsRandomly();
                domHandler.removeShipsFromDOMGameboard(startDOMGameboard);
                domHandler.placeShipsOnGameboard(startGameboard,startDOMGameboard);
            })
        }
    }
    function setEventListenerOnStartButton(){
        const startButton = document.querySelector(".start-button");
        if(startButton){
            startButton.addEventListener("click",function(){
                //remove start screen
                domHandler.removeStartScreen();

                //ships are placed on gameboard
                player1.gameboard.placedShips = startGameboard.placedShips;
                player2.gameboard.setShipsRandomly();
                
                //ships of player 1 are displayed on domGameboard
                domHandler.placeShipsOnGameboard(player1.gameboard,player1.getDomGameboard());
        
                //gameboards are appended on DOM
                domHandler.appendGameboardOnDOM(player1.getDomGameboard(),"player1");
                domHandler.appendGameboardOnDOM(player2.getDomGameboard(),"player2");

                //set Event on pc domboard 
                setEventListenersOnGameboard(player2.getDomGameboard(),"PVC");

                //show start message
                domHandler.showMessageOnInfoContainer(player1,"start");
            })
        }
    }
    function setEventListenerOnNewGameButton(){
        const newGameButton = document.querySelector(".new-game");
        if(newGameButton){
            newGameButton.addEventListener("click",resetGame);
        }
    }
    function resetGame(){
        player1 = null;
        player2 = null;
        startGameboard = null;
       document.querySelectorAll(".board-container").forEach(board => board.remove());
        const infoContainer = document.querySelector(".info-container");
        if (infoContainer) infoContainer.textContent = "";
        domHandler.removeEndScreen();
        game();
    }
    function handleClickOnGameBoardForPlayerVsPC(event){
        const pcPlayer = player2;
        const gameboard = event.currentTarget;
        if(!event.target.classList.contains("cell")) return;
        let coordinateClass;
        for (const className of event.target.classList) {
            if (/^[A-J](10|[1-9])$/.test(className)) {
                coordinateClass = className;
                break;
            }
        }
        if (!coordinateClass) return;
        let coordinateAsArray = [coordinateClass[0],parseInt(coordinateClass.slice(1),10)];

        let waitingPlayer;
        let playingPlayer;
         if(pcPlayer.getDomGameboard() === gameboard){
            waitingPlayer = pcPlayer;
            playingPlayer = player1;
        } else{
            waitingPlayer = player1;
            playingPlayer = pcPlayer;
        }
        let attackResult = waitingPlayer.gameboard.receiveAttack(coordinateAsArray);
        if(waitingPlayer === pcPlayer){
             if(attackResult === false){
                removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(),"PVC");
                setEventListenersOnGameboard(playingPlayer.getDomGameboard(),"PVC");
                domHandler.markMissedAttacksOnDOMGameboard(waitingPlayer.gameboard,waitingPlayer.getDomGameboard());
                domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer,"missed");
               setTimeout(() => {
                        pcPlayer.automatedAttack(playingPlayer.getDomGameboard(),playingPlayer.getGameboard());
                },0)
                return;
            }
            else if(attackResult === true){
                domHandler.markSuccessfulAttacksOnDOMGameboard(waitingPlayer.gameboard,waitingPlayer.getDomGameboard());
                if(waitingPlayer.gameboard.haveAllShipsBeenSunk()===true){
                    removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(),"PVC");
                    endGame(playingPlayer.getName());
                    domHandler.renderEndScreen(playingPlayer);
                    setEventListenerOnNewGameButton();
                    return;
                }
                if(waitingPlayer.gameboard.hasLastAttackSunkAShip()){
                    const lastSunkShip = waitingPlayer.gameboard.getLastSunkShip();
                    domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer,"sunk",lastSunkShip.getName());
                }else{
                    domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer,"hit");
                }
                return;
            }
            else{
                domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer,"null");
            }
        }
        else if(playingPlayer === pcPlayer){
            //false
            if(attackResult===false){
                removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(),"PVC");
                setEventListenersOnGameboard(playingPlayer.getDomGameboard(),"PVC");
                domHandler.markMissedAttacksOnDOMGameboard(waitingPlayer.gameboard,waitingPlayer.getDomGameboard());
                domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer,"missed");
                pcPlayer.attackResults.push([coordinateClass,false]);
            }
            //true
            else if(attackResult === true){
                domHandler.markSuccessfulAttacksOnDOMGameboard(waitingPlayer.gameboard,waitingPlayer.getDomGameboard());
                if(waitingPlayer.gameboard.haveAllShipsBeenSunk()===true){
                    removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(),"PVC");
                    endGame(playingPlayer.getName());
                    domHandler.renderEndScreen(playingPlayer);
                    setEventListenerOnNewGameButton();
                    return;
                }
                if(waitingPlayer.gameboard.hasLastAttackSunkAShip()){
                    const lastSunkShip = waitingPlayer.gameboard.getLastSunkShip();
                    domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer,"sunk",lastSunkShip.getName());
                }else{
                    domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer,"hit");
                }
                pcPlayer.attackResults.push([coordinateClass,true]);
               setTimeout(() => {
                        pcPlayer.automatedAttack(waitingPlayer.getDomGameboard(),waitingPlayer.getGameboard());
                },0)
            return;
            }
        }
    }
    function handleClickOnGameBoard(event){
        const gameboard = event.currentTarget;
        if(!event.target.classList.contains("cell")) return;
        let coordinateClass;
        for (const className of event.target.classList) {
            if (/^[A-J](10|[1-9])$/.test(className)) {
                coordinateClass = className;
                break;
            }
        }
        if (!coordinateClass) return;
        let coordinateAsArray = [coordinateClass[0],parseInt(coordinateClass.slice(1),10)];

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
            removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(),"PVP");
            setEventListenersOnGameboard(playingPlayer.getDomGameboard(),"PVP");
            domHandler.markMissedAttacksOnDOMGameboard(waitingPlayer.gameboard,waitingPlayer.getDomGameboard());
            domHandler.showMessageOnInfoContainer(playingPlayer,"missed");
            return;
        }else if(attackResult === true){
            domHandler.markSuccessfulAttacksOnDOMGameboard(waitingPlayer.gameboard,waitingPlayer.getDomGameboard());
            if(waitingPlayer.gameboard.haveAllShipsBeenSunk()===true){
                removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(),"PVP");
                endGame(playingPlayer.getName());
                domHandler.renderEndScreen(playingPlayer);
                setEventListenerOnNewGameButton();
                return;
            }
            if(waitingPlayer.gameboard.hasLastAttackSunkAShip()){
                const lastSunkShip = waitingPlayer.gameboard.getLastSunkShip();
                domHandler.showMessageOnInfoContainer(playingPlayer,"sunk",lastSunkShip.getName());
            }else{
                domHandler.showMessageOnInfoContainer(playingPlayer,"hit");
            }
            return;
        }
        domHandler.showMessageOnInfoContainer(playingPlayer,"null");
    }
    function removeEventListenersOnGameboard(gameboard,mode){
        if(mode==="PVP"){
            gameboard.removeEventListener("click",handleClickOnGameBoard);
        }else if(mode==="PVC"){
            gameboard.removeEventListener("click",handleClickOnGameBoardForPlayerVsPC);
        }
        
    }
    function endGame(playerName){
        const infoContainer = document.querySelector(".info-container");
        infoContainer.textContent=playerName+ " has won!";
    }
    return{
        setEventListenersOnGameboard,
        handleClickOnGameBoard,
        handleClickOnGameBoardForPlayerVsPC,
        setPlayers,
        setStartGameboard,
        setEventListenerOnShuffleButton,
        setEventListenerOnStartButton,
        removeEventListenersOnGameboard,
        setEventListenerOnNewGameButton
    }
}

if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
    game();
}


