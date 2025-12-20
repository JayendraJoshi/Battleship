import "./styles.css";
import { Player } from "./player";
import { Gameboard } from "./gameboard";
import { handleDom } from "./dom";

export const game = function () {
  const domHandler = handleDom();
  const eventHandler = eventListeners();

  //Create players and their DOMBoards (board instances are created inside the constructor)
  const player1 = new Player("Player1");
  const player2 = new Player("Player2");
  const player1DomGameBoard = domHandler.createGameboard();
  const player2DomGameBoard = domHandler.createGameboard();
  player1.setDomGameboard(player1DomGameBoard);
  player2.setDomGameboard(player2DomGameBoard);
  player1.setMode("Human");

  //Set players for EventHandler
  eventHandler.setPlayers(player1, player2);

  //Render Choose-mode-screen ( Entry point for game logic )
  domHandler.renderChooseModeScreen();
  eventHandler.setEventListenersOnChooseModeScreen();
};

export const eventListeners = function () {
  const domHandler = handleDom();
  let player1;
  let player2;
  let startGameboard;
  //Set eventListener function properties
  function setPlayers(p1, p2) {
    player1 = p1;
    player2 = p2;
  }
  function setStartGameboard(board) {
    startGameboard = board;
  }
  // Handle player vs computer logic
  const handlePVCLogic = function () {
    function handleClickOnGameBoardForPlayerVsPC(event) {
      const pcPlayer = player2;
      const gameboard = event.currentTarget;
      if (!event.target.classList.contains("cell")) return;
      let coordinateClass;
      for (const className of event.target.classList) {
        if (/^[A-J](10|[1-9])$/.test(className)) {
          coordinateClass = className;
          break;
        }
      }
      if (!coordinateClass) return;
      let coordinateAsArray = [
        coordinateClass[0],
        parseInt(coordinateClass.slice(1), 10),
      ];

      let waitingPlayer;
      let playingPlayer;
      if (pcPlayer.getDomGameboard() === gameboard) {
        waitingPlayer = pcPlayer;
        playingPlayer = player1;
      } else {
        waitingPlayer = player1;
        playingPlayer = pcPlayer;
      }
      let attackResult =
        waitingPlayer.gameboard.receiveAttack(coordinateAsArray);
      if (waitingPlayer === pcPlayer) {
        if (attackResult === false) {
          removeEventListenersOnGameboard(
            waitingPlayer.getDomGameboard(),
            "PVC"
          );
          setEventListenersOnGameboard(playingPlayer.getDomGameboard(), "PVC");
          domHandler.markMissedAttacksOnDOMGameboard(
            waitingPlayer.gameboard,
            waitingPlayer.getDomGameboard()
          );
          domHandler.showMessageInInfoContainerForPlayerVsPC(
            playingPlayer,
            "missed"
          );
          setTimeout(() => {
            pcPlayer.automatedAttack(
              playingPlayer.getDomGameboard(),
              playingPlayer.getGameboard()
            );
          }, 1000);
          return;
        } else if (attackResult === true) {
          domHandler.markSuccessfulAttacksOnDOMGameboard(
            waitingPlayer.gameboard,
            waitingPlayer.getDomGameboard()
          );
          if (waitingPlayer.gameboard.haveAllShipsBeenSunk() === true) {
            removeEventListenersOnGameboard(
              waitingPlayer.getDomGameboard(),
              "PVC"
            );
            endGame(playingPlayer.getName());
            domHandler.renderEndScreen(playingPlayer);
            setEventListenerOnNewGameButton();
            return;
          }
          if (waitingPlayer.gameboard.hasLastAttackSunkAShip()) {
            const lastSunkShip = waitingPlayer.gameboard.getLastSunkShip();
            domHandler.showMessageInInfoContainerForPlayerVsPC(
              playingPlayer,
              "sunk",
              lastSunkShip.getName()
            );
          } else {
            domHandler.showMessageInInfoContainerForPlayerVsPC(
              playingPlayer,
              "hit"
            );
          }
          return;
        } else {
          domHandler.showMessageInInfoContainerForPlayerVsPC(
            playingPlayer,
            "null"
          );
          return;
        }
      } else if (playingPlayer === pcPlayer) {
        //false
        if (attackResult === false) {
          removeEventListenersOnGameboard(
            waitingPlayer.getDomGameboard(),
            "PVC"
          );
          setEventListenersOnGameboard(playingPlayer.getDomGameboard(), "PVC");
          domHandler.markMissedAttacksOnDOMGameboard(
            waitingPlayer.gameboard,
            waitingPlayer.getDomGameboard()
          );
          domHandler.showMessageInInfoContainerForPlayerVsPC(
            playingPlayer,
            "missed"
          );
          pcPlayer.attackResults.push([coordinateClass, false]);
        }
        //true
        else if (attackResult === true) {
          domHandler.markSuccessfulAttacksOnDOMGameboard(
            waitingPlayer.gameboard,
            waitingPlayer.getDomGameboard()
          );
          if (waitingPlayer.gameboard.haveAllShipsBeenSunk() === true) {
            removeEventListenersOnGameboard(
              waitingPlayer.getDomGameboard(),
              "PVC"
            );
            endGame(playingPlayer.getName());
            domHandler.renderEndScreen(playingPlayer);
            setEventListenerOnNewGameButton();
            return;
          }
          if (waitingPlayer.gameboard.hasLastAttackSunkAShip()) {
            const lastSunkShip = waitingPlayer.gameboard.getLastSunkShip();
            domHandler.showMessageInInfoContainerForPlayerVsPC(
              playingPlayer,
              "sunk",
              lastSunkShip.getName()
            );
          } else {
            domHandler.showMessageInInfoContainerForPlayerVsPC(
              playingPlayer,
              "hit"
            );
          }
          pcPlayer.attackResults.push([coordinateClass, true]);
          setTimeout(() => {
            pcPlayer.automatedAttack(
              waitingPlayer.getDomGameboard(),
              waitingPlayer.getGameboard()
            );
          }, 1000);
          return;
        }
      }
    }
    function setEventListenersOnSetupScreenForPlayerVsComputer() {
      const nameInput = document.getElementById("name");
      if (nameInput) nameInput.value = "Player1";
      const shuffleButton = document.querySelector(".shuffle-button");
      if (shuffleButton) {
        const startDOMGameboard = document.querySelector(
          ".setup-screen .board-container"
        );
        document.querySelector(".setup-screen").classList.add("pvc");
        shuffleButton.addEventListener("click", function () {
          startGameboard.setShipsRandomly();
          domHandler.removeShipsFromDOMGameboard(startDOMGameboard);
          domHandler.placeShipsOnGameboard(startGameboard, startDOMGameboard);
        });
      }
      const setupNextButton = document.querySelector(".next-button.setup");
      if (setupNextButton) {
        setupNextButton.addEventListener("click", function () {
          const nameInput = document.getElementById("name");
          const name = nameInput?.value ?? "";
          if (name) player1.setName(name);

          domHandler.removeSetupScreen();

          player1.gameboard.placedShips = startGameboard.placedShips;
          player2.gameboard.setShipsRandomly();

          domHandler.placeShipsOnGameboard(
            player1.gameboard,
            player1.getDomGameboard()
          );

          domHandler.appendGameboardOnDOM(player1.getDomGameboard(), "player1");
          domHandler.appendGameboardOnDOM(player2.getDomGameboard(), "player2");

          setEventListenersOnGameboard(player2.getDomGameboard(), "PVC");

          domHandler.showMessageOnInfoContainer(player1, "start");
        });
      }
    }
    return {
      handleClickOnGameBoardForPlayerVsPC,
      setEventListenersOnSetupScreenForPlayerVsComputer,
    };
  };
  // Handle player vs player logic
  const handlePVPLogic = function () {
    function transitionFromChooseModeToPlayer1PassDeviceScreen() {
      domHandler.removeChooseModeScreen();
      domHandler.renderPassDeviceScreen(player1);
      setEventListenerOnReadyButton(transitionFromPlayer1PassDeviceToPlayer1SetupScreen);
      
    }
    function transitionFromPlayer1PassDeviceToPlayer1SetupScreen(){
      domHandler.removePassDeviceScreen();
      document.querySelector(".page-cover").remove();
      startGameboard = new Gameboard();
            startGameboard.setShipsRandomly();
            const startDomGameboard = domHandler.createGameboard();
            domHandler.placeShipsOnGameboard(startGameboard, startDomGameboard);
        domHandler.renderSetupScreen(startDomGameboard);
    setEventListenersOnSetupScreenForPlayer1();
     
    }
     function transitionFromPlayer1SetupToPlayer2PassDeviceScreen(){
      domHandler.removeSetupScreen();
      domHandler.renderPassDeviceScreen(player2);
      setEventListenerOnReadyButton(transitionFromPlayer2PassDeviceToPlayer2SetupScreen);
    }
    function transitionFromPlayer2PassDeviceToPlayer2SetupScreen(){
      domHandler.removePassDeviceScreen();
      document.querySelector(".page-cover").remove();
      startGameboard = new Gameboard();
          startGameboard.setShipsRandomly();
          const startDomGameboard = domHandler.createGameboard();
          domHandler.placeShipsOnGameboard(startGameboard, startDomGameboard);
          domHandler.renderSetupScreen(startDomGameboard);
          setEventListenersOnSetupScreenForPlayer2();
    }
    function setEventListenersOnSetupScreenForPlayer1() {
      const nameInput = document.getElementById("name");
      if (nameInput) nameInput.value = "Player1";
      const shuffleButton = document.querySelector(".shuffle-button");
      document.querySelector(".setup-screen").classList.add("PVP-player1");
      if (shuffleButton) {
        const startDOMGameboard = document.querySelector(
          ".setup-screen .board-container"
        );
        shuffleButton.addEventListener("click", function () {
          startGameboard.setShipsRandomly();
          domHandler.removeShipsFromDOMGameboard(startDOMGameboard);
          domHandler.placeShipsOnGameboard(startGameboard, startDOMGameboard);
        });
      }
      const setupNextButton = document.querySelector(".next-button.setup");
      if (setupNextButton) {
        setupNextButton.addEventListener("click", function () {
          
          //set Player 1 name
          const nameInput = document.getElementById("name");
          const name = nameInput?.value ?? "Player1";
          if (name) player1.setName(name);

          //ships are placed on gameboard
          player1.gameboard.placedShips = startGameboard.placedShips;

          //ships of player 1 are displayed on domGameboard
          domHandler.placeShipsOnGameboard(
            player1.gameboard,
            player1.getDomGameboard()
          );
          //render player2 setup screen
           transitionFromPlayer1SetupToPlayer2PassDeviceScreen();
          
        });
      }
    }
    function setEventListenersOnSetupScreenForPlayer2() {
      //set default value for Player2 input
      const nameInput = document.getElementById("name");
      if (nameInput) nameInput.value = "Player2";

      const shuffleButton = document.querySelector(".shuffle-button");
      document.querySelector(".setup-screen").classList.add("PVP-player2");
      if (shuffleButton) {
        const startDOMGameboard = document.querySelector(
          ".setup-screen .board-container"
        );
        shuffleButton.addEventListener("click", function () {
          startGameboard.setShipsRandomly();
          domHandler.removeShipsFromDOMGameboard(startDOMGameboard);
          domHandler.placeShipsOnGameboard(startGameboard, startDOMGameboard);
        });
      }
      const setupNextButton = document.querySelector(".next-button.setup");
      if (setupNextButton) {
        setupNextButton.addEventListener("click", function () {
          //set Player 2 name
          const nameInput = document.getElementById("name");
          const name = nameInput?.value ?? "Player2";
          if (name) player2.setName(name);

          //remove setup screen
          //domHandler.removeSetupScreen();

          //ships are placed on gameboard
          player2.gameboard.placedShips = startGameboard.placedShips;

          domHandler.placeShipsOnGameboard(
            player2.gameboard,
            player2.getDomGameboard()
          );
          transitionFromPlayerSetupScreenToPlayer1PassDeviceScreen();
          
        });
      }
    }
    function transitionFromPlayerSetupScreenToPlayer1PassDeviceScreen(){
      domHandler.removeSetupScreen();
      domHandler.renderPassDeviceScreen(player1);
      setEventListenerOnReadyButton(transitionFromPlayer2SetupScreenToGame);
    }
    function transitionFromPlayer2SetupScreenToGame(){
          domHandler.removePassDeviceScreen();
          document.querySelector(".page-cover").remove();
          domHandler.hideShipPlacementFromDOMGameboard(player2.getDomGameboard());
          domHandler.appendGameboardOnDOM(player1.getDomGameboard(),"Player1");
          domHandler.appendGameboardOnDOM(player2.getDomGameboard(),"Player2");
          setEventListenersOnGameboard(player2.getDomGameboard(), "PVP");
          domHandler.showMessageOnInfoContainer(player1, "start");
    }
    function setEventListenerOnNextButton(callback) {
      const nextButton = document.querySelector(".next-button.setup");
      if (nextButton) {
        nextButton.addEventListener("click", callback);
      }
    }
    function setEventListenerOnReadyButton(callback){
      const readyButton = document.querySelector(".ready-button");
      if(readyButton){
        readyButton.addEventListener("click",callback);
      }
    }
    function switchGameboardVisibility(waitingPlayer,playingPlayer){
      document.querySelector(".page-cover").remove();
      domHandler.removePassDeviceScreen();
      domHandler.hideShipPlacementFromDOMGameboard(playingPlayer.getDomGameboard());
      domHandler.placeShipsOnGameboard(waitingPlayer.gameboard,waitingPlayer.getDomGameboard());
      
      domHandler.markMissedAttacksOnDOMGameboard(playingPlayer.gameboard, playingPlayer.getDomGameboard());
      domHandler.markSuccessfulAttacksOnDOMGameboard(playingPlayer.gameboard, playingPlayer.getDomGameboard());
  
    domHandler.markMissedAttacksOnDOMGameboard(waitingPlayer.gameboard, waitingPlayer.getDomGameboard());
    domHandler.markSuccessfulAttacksOnDOMGameboard(waitingPlayer.gameboard, waitingPlayer.getDomGameboard());
    }
    function setEventListenerOnEndTurnButton(playingPlayer, waitingPlayer){
      const endTurnButton = document.querySelector(".end-turn-button");
      if(endTurnButton){
        endTurnButton.addEventListener("click",function(){
        domHandler.renderPassDeviceScreen(waitingPlayer);
        domHandler.hideShipPlacementFromDOMGameboard(playingPlayer.getDomGameboard());
        setEventListenerOnReadyButton(()=>switchGameboardVisibility(waitingPlayer,playingPlayer));
        domHandler.removeEndTurnButton();
        })
      }
    }
     function handleClickOnGameBoard(event) {
      const gameboard = event.currentTarget;
      if (!event.target.classList.contains("cell")) return;
      let coordinateClass;
      for (const className of event.target.classList) {
        if (/^[A-J](10|[1-9])$/.test(className)) {
          coordinateClass = className;
          break;
        }
      }
      if (!coordinateClass) return;
      let coordinateAsArray = [
        coordinateClass[0],
        parseInt(coordinateClass.slice(1), 10),
      ];

      let waitingPlayer;
      let playingPlayer;

      if (player2.getDomGameboard() === gameboard) {
        waitingPlayer = player2;
        playingPlayer = player1;
      } else {
        waitingPlayer = player1;
        playingPlayer = player2;
      }
      let attackResult =
        waitingPlayer.gameboard.receiveAttack(coordinateAsArray);
      if (attackResult === false) {
        removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(), "PVP");
        setEventListenersOnGameboard(playingPlayer.getDomGameboard(), "PVP");
        domHandler.markMissedAttacksOnDOMGameboard(
          waitingPlayer.gameboard,
          waitingPlayer.getDomGameboard()
        );
        domHandler.showMessageOnInfoContainer(playingPlayer, "missed");
        
        domHandler.renderEndTurnButton();
        setEventListenerOnEndTurnButton(playingPlayer,waitingPlayer);
        return;
      } else if (attackResult === true) {
        domHandler.markSuccessfulAttacksOnDOMGameboard(
          waitingPlayer.gameboard,
          waitingPlayer.getDomGameboard()
        );
        if (waitingPlayer.gameboard.haveAllShipsBeenSunk() === true) {
          removeEventListenersOnGameboard(
            waitingPlayer.getDomGameboard(),
            "PVP"
          );
          endGame(playingPlayer.getName());
          domHandler.renderEndScreen(playingPlayer);
          setEventListenerOnNewGameButton();
          return;
        }
        if (waitingPlayer.gameboard.hasLastAttackSunkAShip()) {
          const lastSunkShip = waitingPlayer.gameboard.getLastSunkShip();
          domHandler.showMessageOnInfoContainer(
            playingPlayer,
            "sunk",
            lastSunkShip.getName()
          );
        } else {
          domHandler.showMessageOnInfoContainer(playingPlayer, "hit");
        }
        return;
      }
      domHandler.showMessageOnInfoContainer(playingPlayer, "null");
    }
   
    return {
      handleClickOnGameBoard,
      setEventListenersOnSetupScreenForPlayer1,
      setEventListenersOnSetupScreenForPlayer2,
      setEventListenerOnNextButton,
      transitionFromChooseModeToPlayer1PassDeviceScreen,
       transitionFromPlayer1SetupToPlayer2PassDeviceScreen
    };
  };
  //Handle common logic
  function setEventListenersOnChooseModeScreen() {
    const pcButton = document.querySelector(".pc-button");
    const playerButton = document.querySelector(".player-button");
    const chooseModeNextButton = document.querySelector(
      ".next-button.choose-mode"
    );

    pcButton.addEventListener("click", function () {
      playerButton.classList.remove("active-mode");
      pcButton.classList.add("active-mode");
    });
    playerButton.addEventListener("click", function () {
      pcButton.classList.remove("active-mode");
      playerButton.classList.add("active-mode");
    });
        chooseModeNextButton.addEventListener("click", function () {
          if(playerButton.classList.contains("active-mode")){
            transitionFromChooseModeToPlayer1PassDeviceScreen();
          }else if(pcButton.classList.contains("active-mode")){
            player2.setMode("PC"); 
           player2.setName("PC"); 
            domHandler.removeChooseModeScreen();
            startGameboard = new Gameboard();
            startGameboard.setShipsRandomly();
            const startDomGameboard = domHandler.createGameboard();
            domHandler.placeShipsOnGameboard(startGameboard, startDomGameboard);
            domHandler.renderSetupScreen(startDomGameboard);
            setEventListenersOnSetupScreenForPlayerVsComputer();
          }
        
      });
    
}
  function setEventListenersOnGameboard(gameboard, mode) {
    if (mode === "PVP") {
      gameboard.addEventListener("click", handleClickOnGameBoard);
    } else if (mode === "PVC") {
      gameboard.addEventListener("click", handleClickOnGameBoardForPlayerVsPC);
    }
  }
  function removeEventListenersOnGameboard(gameboard, mode) {
    if (mode === "PVP") {
      gameboard.removeEventListener("click", handleClickOnGameBoard);
    } else if (mode === "PVC") {
      gameboard.removeEventListener(
        "click",
        handleClickOnGameBoardForPlayerVsPC
      );
    }
  }
  function endGame(playerName) {
    const infoContainer = document.querySelector(".info-container");
    infoContainer.textContent = playerName + " has won!";
  }
  function setEventListenerOnNewGameButton() {
    const newGameButton = document.querySelector(".new-game");
    if (newGameButton) {
      newGameButton.addEventListener("click", resetGame);
    }
  }
  function resetGame() {
    player1 = null;
    player2 = null;
    startGameboard = null;
    document
      .querySelectorAll(".board-container")
      .forEach((board) => board.remove());
    const infoContainer = document.querySelector(".info-container");
    if (infoContainer) infoContainer.textContent = "";
    domHandler.removeEndScreen();
    game();
  }
  //Get functions from inner scope
  const {
    handleClickOnGameBoardForPlayerVsPC,
    setEventListenersOnSetupScreenForPlayerVsComputer,
  } = handlePVCLogic();
  const {
    handleClickOnGameBoard,
    setEventListenersOnSetupScreenForPlayer1,
    setEventListenersOnSetupScreenForPlayer2,
    setEventListenerOnNextButton,
    transitionFromChooseModeToPlayer1PassDeviceScreen,
    transitionFromPlayer1SetupToPlayer2PassDeviceScreen
  } = handlePVPLogic();

  return {
    setEventListenersOnGameboard,
    handleClickOnGameBoard,
    handleClickOnGameBoardForPlayerVsPC,
    setPlayers,
    setStartGameboard,
    removeEventListenersOnGameboard,
    setEventListenerOnNewGameButton,
    setEventListenersOnChooseModeScreen,
    setEventListenersOnSetupScreenForPlayerVsComputer,
  };
};

if (typeof process === "undefined" || process.env.NODE_ENV !== "test") {
  game();
}
