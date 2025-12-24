import "./styles.css";
import { Player } from "./player";
import { handleDom } from "./dom";
import { gameController } from "./controller";

export const game = function () {
  const domHandler = handleDom();
  const eventHandler = eventListeners();

  //Create players and their DOMBoards (board instances are created inside the constructor)
  const player1 = new Player("Player1");
  const player2 = new Player("Player2");
  const player1DomGameboard = domHandler.createDomGameboard();
  const player2DomGameboard = domHandler.createDomGameboard();
  player1.setDomGameboard(player1DomGameboard);
  player2.setDomGameboard(player2DomGameboard);
  player1.setMode("Human");

  //Set players for EventHandler
  eventHandler.setPlayers(player1, player2);

  //Render Choose-mode-screen ( Entry point for game logic )
  domHandler.renderChooseModeScreen();
  eventHandler.setEventListenersOnChooseModeScreen();
};

function endGame(playerName) {
  const infoContainer = document.querySelector(".info-container");
  infoContainer.textContent = playerName + " has won!";
}

function resetGame() {
  document
    .querySelectorAll(".board-container")
    .forEach((board) => board.remove());
  const infoContainer = document.querySelector(".info-container");
  if (infoContainer) infoContainer.textContent = "";
  const domHandler = handleDom();
  domHandler.removeEndScreen();
  game();
}

export const eventListeners = function () {
  const domHandler = handleDom();
  let player1;
  let player2;
  let controller;

  function setPlayers(p1, p2) {
    player1 = p1;
    player2 = p2;
  }

  function setEventListenerOnReadyButton(callback) {
    const readyButton = document.querySelector(".ready-button");
    if (readyButton) {
      readyButton.addEventListener("click", callback);
    }
  }

  function setEventListenersOnSetupScreenForPlayer1() {
    const nameInput = document.getElementById("name");
    if (nameInput) nameInput.value = "Player1";
    const shuffleButton = document.querySelector(".shuffle-button");
    document.querySelector(".setup-screen").classList.add("PVP-player1");
    if (shuffleButton) {
      const startDomGameboard = document.querySelector(
        ".setup-screen .board-container"
      );
      shuffleButton.addEventListener("click", function () {
        player1.gameboard.setShipsRandomly();
        domHandler.removeShipsFromDOMGameboard(startDomGameboard);
        domHandler.placeShipsOnGameboard(player1.gameboard, startDomGameboard);
      });
    }
    const setupNextButton = document.querySelector(".next-button.setup");
    if (setupNextButton) {
      setupNextButton.addEventListener("click", function () {
        const nameInput = document.getElementById("name");
        const name = nameInput?.value ?? "Player1";
        if (name) player1.setName(name);

        domHandler.placeShipsOnGameboard(player1.gameboard, player1.getDomGameboard());
        controller.transitionFromPlayer1SetupToPlayer2PassDeviceScreen();
      });
    }
  }

  function setEventListenersOnSetupScreenForPlayer2() {
    const nameInput = document.getElementById("name");
    if (nameInput) nameInput.value = "Player2";

    const shuffleButton = document.querySelector(".shuffle-button");
    document.querySelector(".setup-screen").classList.add("PVP-player2");
    if (shuffleButton) {
      const startDomGameboard = document.querySelector(
        ".setup-screen .board-container"
      );
      shuffleButton.addEventListener("click", function () {
        player2.gameboard.setShipsRandomly();
        domHandler.removeShipsFromDOMGameboard(startDomGameboard);
        domHandler.placeShipsOnGameboard(player2.gameboard, startDomGameboard);
      });
    }
    const setupNextButton = document.querySelector(".next-button.setup");
    if (setupNextButton) {
      setupNextButton.addEventListener("click", function () {
        const nameInput = document.getElementById("name");
        const name = nameInput?.value ?? "Player2";
        if (name) player2.setName(name);

        domHandler.placeShipsOnGameboard(player2.gameboard, player2.getDomGameboard());
        controller.transitionFromPlayerSetupScreenToPlayer1PassDeviceScreen();
      });
    }
  }

  function setEventListenersOnSetupScreenForPlayerVsComputer() {
      const nameInput = document.getElementById("name");
      if (nameInput) nameInput.value = "Player1";
      const shuffleButton = document.querySelector(".shuffle-button");
      if (shuffleButton) {
        const startDomGameboard = document.querySelector(
          ".setup-screen .board-container"
        );
        document.querySelector(".setup-screen").classList.add("pvc");
        shuffleButton.addEventListener("click", function () {
          player1.gameboard.setShipsRandomly();
          domHandler.removeShipsFromDOMGameboard(startDomGameboard);
          domHandler.placeShipsOnGameboard(player1.gameboard, startDomGameboard);
        });
      }
      const setupNextButton = document.querySelector(".next-button.setup");
      if (setupNextButton) {
        setupNextButton.addEventListener("click", function () {
          const nameInput = document.getElementById("name");
          const name = nameInput?.value ?? "";
          if (name) player1.setName(name);

          domHandler.removeSetupScreen();

          player2.gameboard.setShipsRandomly();

          domHandler.placeShipsOnGameboard(
            player1.gameboard,
            player1.getDomGameboard()
          );

          domHandler.appendGameboardOnDOM(player1.getDomGameboard(), "player1");
          domHandler.appendGameboardOnDOM(player2.getDomGameboard(), "player2");

          setEventListenersOnGameboard(player2.getDomGameboard(), "PVC");
          domHandler.renderInfoContainer();
          domHandler.showMessageOnInfoContainer(player1, "start");
        });
      }
    }

  function setEventListenerOnEndTurnButton(playingPlayer, waitingPlayer) {
    const endTurnButton = document.querySelector(".end-turn-button");
    if (endTurnButton) {
      endTurnButton.addEventListener("click", function () {
        domHandler.renderPassDeviceScreen(waitingPlayer);
        domHandler.hideShipPlacementFromDOMGameboard(playingPlayer.getDomGameboard());
        setEventListenerOnReadyButton(() => {
          domHandler.switchGameboardVisibility(waitingPlayer, playingPlayer);
          swapEventListenersOfGameboards(playingPlayer, waitingPlayer);
          domHandler.addGameViewClassToMain();
        });
        domHandler.removeEndTurnButton();
      });
    }
  }
  function swapEventListenersOfGameboards(playingPlayer,waitingPlayer){
    setEventListenersOnGameboard(playingPlayer.getDomGameboard(), "PVP");
  }
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
      if (playerButton.classList.contains("active-mode")) {
        controller.transitionFromChooseModeToPlayer1PassDeviceScreen();
      } else if (pcButton.classList.contains("active-mode")) {
        player2.setMode("PC");
        player2.setName("PC");
        domHandler.removeChooseModeScreen();
        player1.gameboard.setShipsRandomly();
        const setUpDomGameboard = domHandler.createDomGameboard();
        domHandler.placeShipsOnGameboard(player1.gameboard, setUpDomGameboard);
        domHandler.renderSetupScreen(setUpDomGameboard);
        setEventListenersOnSetupScreenForPlayerVsComputer();
      }
    });
  }

  function setEventListenersOnGameboard(gameboard, mode) {
    if (mode === "PVP") {
      gameboard.addEventListener("click", controller.handleClickOnGameBoard);
    } else if (mode === "PVC") {
      gameboard.addEventListener(
        "click",
        controller.handleClickOnGameBoardForPlayerVsPC
      );
    }
  }

  function removeEventListenersOnGameboard(gameboard, mode) {
    if (mode === "PVP") {
      gameboard.removeEventListener("click", controller.handleClickOnGameBoard);
    } else if (mode === "PVC") {
      gameboard.removeEventListener(
        "click",
        controller.handleClickOnGameBoardForPlayerVsPC
      );
    }
  }

  function setEventListenerOnNewGameButton() {
    const newGameButton = document.querySelector(".new-game");
    if (newGameButton) {
      newGameButton.addEventListener("click", resetGame);
    }
  }

  controller = gameController({
    domHandler,
    getPlayers: () => ({ player1, player2 }),
    setEventListenersOnGameboard,
    removeEventListenersOnGameboard,
    endGame,
    setEventListenerOnNewGameButton,
    setEventListenerOnEndTurnButton,
    setEventListenerOnReadyButton,
    setEventListenersOnSetupScreenForPlayer1,
    setEventListenersOnSetupScreenForPlayer2,
    setEventListenersOnSetupScreenForPlayerVsComputer,
  });

  return {
    setEventListenersOnGameboard,
    setPlayers,
    removeEventListenersOnGameboard,
    setEventListenerOnNewGameButton,
    setEventListenersOnChooseModeScreen,
    setEventListenersOnSetupScreenForPlayerVsComputer,
  };
};

if (typeof process === "undefined" || process.env.NODE_ENV !== "test") {
  game();
}
