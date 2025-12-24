export function gameController(deps) {
  const {
    domHandler,
    getPlayers,
    setEventListenersOnGameboard,
    removeEventListenersOnGameboard,
    endGame,
    setEventListenerOnNewGameButton,
    setEventListenerOnEndTurnButton,
    setEventListenerOnReadyButton,
    setEventListenersOnSetupScreenForPlayer1,
    setEventListenersOnSetupScreenForPlayer2,
    setEventListenersOnSetupScreenForPlayerVsComputer,
  } = deps;

  function transitionFromChooseModeToPlayer1PassDeviceScreen() {
    const { player1 } = getPlayers();
    domHandler.removeChooseModeScreen();
    domHandler.renderPassDeviceScreen(player1);
    setEventListenerOnReadyButton(transitionFromPlayer1PassDeviceToPlayer1SetupScreen);
  }

  function transitionFromPlayer1PassDeviceToPlayer1SetupScreen() {
    const { player1 } = getPlayers();
    domHandler.removePassDeviceScreen();
    document.querySelector(".page-cover").remove();
    player1.gameboard.setShipsRandomly();
    const startDomGameboard = domHandler.createDomGameboard();
    domHandler.placeShipsOnGameboard(player1.gameboard, startDomGameboard);
    domHandler.renderSetupScreen(startDomGameboard);
    setEventListenersOnSetupScreenForPlayer1();
  }

  function transitionFromPlayer1SetupToPlayer2PassDeviceScreen() {
    const { player2 } = getPlayers();
    domHandler.removeSetupScreen();
    domHandler.renderPassDeviceScreen(player2);
    setEventListenerOnReadyButton(transitionFromPlayer2PassDeviceToPlayer2SetupScreen);
  }

  function transitionFromPlayer2PassDeviceToPlayer2SetupScreen() {
    const { player2 } = getPlayers();
    domHandler.removePassDeviceScreen();
    document.querySelector(".page-cover").remove();
    player2.gameboard.setShipsRandomly();
    const startDomGameboard = domHandler.createDomGameboard();
    domHandler.placeShipsOnGameboard(player2.gameboard, startDomGameboard);
    domHandler.renderSetupScreen(startDomGameboard);
    setEventListenersOnSetupScreenForPlayer2();
  }

  function transitionFromPlayerSetupScreenToPlayer1PassDeviceScreen() {
    const { player1 } = getPlayers();
    domHandler.removeSetupScreen();
    domHandler.renderPassDeviceScreen(player1);
    setEventListenerOnReadyButton(transitionFromPlayer1PassDeviceScreenToGame);
  }

  function transitionFromPlayer1PassDeviceScreenToGame() {
    const { player1, player2 } = getPlayers();
    domHandler.removePassDeviceScreen();
    document.querySelector(".page-cover").remove();
    domHandler.hideShipPlacementFromDOMGameboard(player2.getDomGameboard());
    domHandler.appendGameboardOnDOM(player1.getDomGameboard(), "Player1");
    domHandler.appendGameboardOnDOM(player2.getDomGameboard(), "Player2");
    setEventListenersOnGameboard(player2.getDomGameboard(), "PVP");
    domHandler.renderInfoContainer();
    domHandler.showMessageOnInfoContainer(player1, "start");
    domHandler.addGameViewClassToMain();
  }

  function getClassFromDomCell(event) {
    let coordinateClass;
    for (const className of event.target.classList) {
      if (/^[A-J](10|[1-9])$/.test(className)) {
        coordinateClass = className;
        break;
      }
    }
    return coordinateClass;
  }

  function getCoordinateAsArrayFromClass(coordinateClass) {
    return [coordinateClass[0], parseInt(coordinateClass.slice(1), 10)];
  }

  function handleClickOnGameBoardForPlayerVsPC(event) {
    const { player1, player2 } = getPlayers();
    const pcPlayer = player2;
    const gameboard = event.currentTarget;
    if (!event.target.classList.contains("cell")) return;
    const coordinateClass = getClassFromDomCell(event);
    if (!coordinateClass) return;
    const coordinateAsArray = getCoordinateAsArrayFromClass(coordinateClass);

    let waitingPlayer;
    let playingPlayer;
    if (pcPlayer.getDomGameboard() === gameboard) {
      waitingPlayer = pcPlayer;
      playingPlayer = player1;
    } else {
      waitingPlayer = player1;
      playingPlayer = pcPlayer;
    }

    const attackResult = waitingPlayer.gameboard.receiveAttack(coordinateAsArray);
    if (waitingPlayer === pcPlayer) {
      if (attackResult === false) {
        removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(), "PVC");
        domHandler.markMissedAttacksOnDOMGameboard(
          waitingPlayer.gameboard,
          waitingPlayer.getDomGameboard()
        );
        domHandler.showMessageInInfoContainerForPlayerVsPC(
          playingPlayer,
          "missed"
        );
        setTimeout(() => {
          setEventListenersOnGameboard(playingPlayer.getDomGameboard(), "PVC");
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
          removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(), "PVC");
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
          domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer, "hit");
        }
        return;
      } else {
        domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer, "null");
        return;
      }
    } else if (playingPlayer === pcPlayer) {
      //false
      if (attackResult === false) {
        removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(), "PVC");
        setEventListenersOnGameboard(playingPlayer.getDomGameboard(), "PVC");
        domHandler.markMissedAttacksOnDOMGameboard(
          waitingPlayer.gameboard,
          waitingPlayer.getDomGameboard()
        );
        domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer, "missed");
        pcPlayer.attackResults.push([coordinateClass, false]);
      }
      //true
      else if (attackResult === true) {
        domHandler.markSuccessfulAttacksOnDOMGameboard(
          waitingPlayer.gameboard,
          waitingPlayer.getDomGameboard()
        );
        if (waitingPlayer.gameboard.haveAllShipsBeenSunk() === true) {
          removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(), "PVC");
          endGame(playingPlayer.getName());
          domHandler.renderEndScreen(playingPlayer);
          setEventListenerOnNewGameButton();
          return;
        }
        if (waitingPlayer.gameboard.hasLastAttackSunkAShip()) {
          removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(), "PVC");
          const lastSunkShip = waitingPlayer.gameboard.getLastSunkShip();
          domHandler.showMessageInInfoContainerForPlayerVsPC(
            playingPlayer,
            "sunk",
            lastSunkShip.getName()
          );
        } else {
          removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(), "PVC");
          domHandler.showMessageInInfoContainerForPlayerVsPC(playingPlayer, "hit");
        }
        pcPlayer.attackResults.push([coordinateClass, true]);
        setTimeout(() => {
         setEventListenersOnGameboard(waitingPlayer.getDomGameboard(),"PVC");
          pcPlayer.automatedAttack(
            waitingPlayer.getDomGameboard(),
            waitingPlayer.getGameboard()
          );
        }, 1000);
        return;
      }
    }
  }

  function handleClickOnGameBoard(event) {
    const { player1, player2 } = getPlayers();
    const gameboard = event.currentTarget;
    if (!event.target.classList.contains("cell")) return;
    const coordinateClass = getClassFromDomCell(event);
    if (!coordinateClass) return;
    const coordinateAsArray = getCoordinateAsArrayFromClass(coordinateClass);

    let waitingPlayer;
    let playingPlayer;

    if (player2.getDomGameboard() === gameboard) {
      waitingPlayer = player2;
      playingPlayer = player1;
    } else {
      waitingPlayer = player1;
      playingPlayer = player2;
    }

    const attackResult = waitingPlayer.gameboard.receiveAttack(coordinateAsArray);
    if (attackResult === false) {
      removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(), "PVP");
      domHandler.markMissedAttacksOnDOMGameboard(
        waitingPlayer.gameboard,
        waitingPlayer.getDomGameboard()
      );
      domHandler.showMessageOnInfoContainer(playingPlayer, "missed");
      domHandler.renderEndTurnButton();
      setEventListenerOnEndTurnButton(playingPlayer, waitingPlayer);
      return;
    } else if (attackResult === true) {
      domHandler.markSuccessfulAttacksOnDOMGameboard(
        waitingPlayer.gameboard,
        waitingPlayer.getDomGameboard()
      );
      if (waitingPlayer.gameboard.haveAllShipsBeenSunk() === true) {
        removeEventListenersOnGameboard(waitingPlayer.getDomGameboard(), "PVP");
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
    handleClickOnGameBoardForPlayerVsPC,
    handleClickOnGameBoard,
    transitionFromChooseModeToPlayer1PassDeviceScreen,
    transitionFromPlayer1SetupToPlayer2PassDeviceScreen,
    transitionFromPlayerSetupScreenToPlayer1PassDeviceScreen,
  };
}

