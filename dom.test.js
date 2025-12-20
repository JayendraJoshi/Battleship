import { Gameboard } from "./src/gameboard";
import { handleDom } from "./src/dom";
import { Player } from "./src/player";
import { eventListeners } from "./src/index.js";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(
  path.resolve(__dirname, "./src/template.html"),
  "utf8"
);

let domHandler;
let player1;
let player2;
let eventHandler;
describe("DomGameboard", () => {
  beforeEach(() => {
    domHandler = handleDom();
    player1 = new Player("player1");
    player2 = new Player("player2");
    eventHandler = eventListeners();
    document.documentElement.innerHTML = html;
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("Gameboard is succesfully created", () => {
    const board = domHandler.createGameboard();
    expect(board).toBeTruthy();
    expect(board.tagName).toBe("DIV");
  });
  test("Correctly creates 100 cells in gameboard", () => {
    const board = domHandler.createGameboard();
    expect(board.tagName).toBe("DIV");
    const allCells = board.querySelectorAll(".cell");
    expect(allCells.length).toBe(100);
  });

  test("Cells with classes A1 - J10 exist", () => {
    const board = domHandler.createGameboard();
    const allCells = board.querySelectorAll(".cell");
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    for (let i = 0; i < 10; i++) {
      for (let j = 1; j <= 10; j++) {
        const className = letters[i] + j;
        const found = Array.from(allCells).some((cell) =>
          cell.classList.contains(className)
        );
        expect(found).toBe(true);
      }
    }
  });
  test("Places ships on board by applying black color to their cells", () => {
    player1.gameboard.setShip("2", ["A", 2], ["A", 3]);
    player1.gameboard.setShip("5", ["A", 1], ["E", 1]);

    const player1DomGameBoard = domHandler.createGameboard();
    domHandler.placeShipsOnGameboard(player1.gameboard, player1DomGameBoard);
    domHandler.appendGameboardOnDOM(player1DomGameBoard, "player1");
    const allCells = player1DomGameBoard.querySelectorAll(".cell");

    const placedShips = player1.gameboard.placedShips;
    let coordinatesOfPlacedShips = placedShips.flatMap(
      (shipPath) => shipPath[1]
    );
    const classNamesOfShipCoordinates = coordinatesOfPlacedShips.map(
      (coordinate) => coordinate[0] + coordinate[1]
    );

    classNamesOfShipCoordinates.forEach((className) => {
      const cell = Array.from(allCells).find((cell) =>
        cell.classList.contains(className)
      );
      expect(cell).toBeTruthy();
      expect(cell.style.backgroundColor).toBe("rgb(128, 128, 128)");
    });
  });
  test("Marks missed attacks by applying blue color to cells", () => {
    //create players
    eventHandler.setPlayers(player1, player2);
    player1.gameboard.setShip("2", ["A", 2], ["A", 3]);
    player2.gameboard.setShip("5", ["A", 1], ["E", 1]);

    //create gameboards and place ships
    const player1DomGameBoard = domHandler.createGameboard();
    const player2DomGameBoard = domHandler.createGameboard();
    player1.setDomGameboard(player1DomGameBoard);
    player2.setDomGameboard(player2DomGameBoard);
    domHandler.placeShipsOnGameboard(player1.gameboard, player1DomGameBoard);
    domHandler.placeShipsOnGameboard(player2.gameboard, player2DomGameBoard);

    //append on DOM
    domHandler.appendGameboardOnDOM(player1DomGameBoard, "player1");
    domHandler.appendGameboardOnDOM(player2DomGameBoard, "player2");

    //miss an attack
    eventHandler.setEventListenersOnGameboard(player2DomGameBoard);
    const cellB2 = player2DomGameBoard.querySelector(".B2");
    cellB2.click();

    const allCells = player2DomGameBoard.querySelectorAll(".cell");

    let coordinatesOfMissedAttacks = player2.gameboard.missedAttacks;
    const classNamesOfShipCoordinates = coordinatesOfMissedAttacks.map(
      (coordinate) => coordinate[0] + coordinate[1]
    );

    classNamesOfShipCoordinates.forEach((className) => {
      const cell = Array.from(allCells).find((cell) =>
        cell.classList.contains(className)
      );
      expect(cell).toBeTruthy();
      expect(cell.style.backgroundColor).toBe("rgb(29, 137, 187)");
    });
  });
  test("Mark successful attacks by applying blue color to cells", () => {
    //create players
    eventHandler.setPlayers(player1, player2);
    player1.gameboard.setShip("2", ["A", 2], ["A", 3]);
    player2.gameboard.setShip("5", ["A", 1], ["E", 1]);

    //create gameboards and place ships
    const player1DomGameBoard = domHandler.createGameboard();
    const player2DomGameBoard = domHandler.createGameboard();
    player1.setDomGameboard(player1DomGameBoard);
    player2.setDomGameboard(player2DomGameBoard);
    domHandler.placeShipsOnGameboard(player1.gameboard, player1DomGameBoard);
    domHandler.placeShipsOnGameboard(player2.gameboard, player2DomGameBoard);

    //append on DOM
    domHandler.appendGameboardOnDOM(player1DomGameBoard, "player1");
    domHandler.appendGameboardOnDOM(player2DomGameBoard, "player2");

    //successful attack
    eventHandler.setEventListenersOnGameboard(player2DomGameBoard);
    const cellA1 = player2DomGameBoard.querySelector(".A1");
    cellA1.click();

    const allCells = player2DomGameBoard.querySelectorAll(".cell");

    let coordinatesOfsuccessfulAttacks = player2.gameboard.successfulAttacks;
    const classNamesOfShipCoordinates = coordinatesOfsuccessfulAttacks.map(
      (coordinate) => coordinate[0] + coordinate[1]
    );

    classNamesOfShipCoordinates.forEach((className) => {
      const cell = Array.from(allCells).find((cell) =>
        cell.classList.contains(className)
      );
      expect(cell).toBeTruthy();
      expect(cell.style.backgroundColor).toBe("rgb(200, 40, 35)");
    });
  });

  test("Gameboard is correctly placed on DOM", () => {
    const player1DomGameBoard = domHandler.createGameboard();
    domHandler.appendGameboardOnDOM(player1DomGameBoard, "player1");
    expect(document.querySelector(".board-container")).toBeTruthy();
  });
});
describe("Setup screen", () => {});
describe("Choose-mode screen", () => {
  beforeEach(() => {
    domHandler = handleDom();
    player1 = new Player("player1");
    player2 = new Player("player2");
    eventHandler = eventListeners();
    document.documentElement.innerHTML = html;
  });
  test("Choose-mode screen is rendered", () => {
    domHandler.renderChooseModeScreen();
    const chooseModeScreen = document.querySelector(".choose-mode-screen");
    expect(chooseModeScreen).toBeTruthy();
  });
  test("Choose-mode screen has all of it's children", () => {
    domHandler.renderChooseModeScreen();
    const chooseModeScreen = document.querySelector(".choose-mode-screen");
    expect(chooseModeScreen.querySelector("h2")).toBeTruthy();
    expect(chooseModeScreen.querySelector(".pc-button")).toBeTruthy();
    expect(chooseModeScreen.querySelector(".player-button")).toBeTruthy();
    expect(
      chooseModeScreen.querySelector(".next-button.choose-mode")
    ).toBeTruthy();
  });
  test("Page-cover class is active while choose-mode screen is rendered", () => {
    domHandler.renderChooseModeScreen();
    expect(document.querySelector(".page-cover")).toBeTruthy();
  });
  test("Active-mode class is on player-button as default", () => {
    domHandler.renderChooseModeScreen();
    expect(
      document.querySelector(".pc-button").classList.contains("active-mode")
    ).toBe(true);
    expect(
      document.querySelector(".player-button").classList.contains("active-mode")
    ).toBe(false);
  });
  test("Active class is added on the last button that is clicked and removed from the other", () => {
    domHandler.renderChooseModeScreen();
    eventHandler.setEventListenersOnChooseModeScreen();
    expect(
      document.querySelector(".pc-button").classList.contains("active-mode")
    ).toBe(true);
    expect(
      document.querySelector(".player-button").classList.contains("active-mode")
    ).toBe(false);
    document.querySelector(".player-button").click();

    //active class should now be on player button and not on pc button
    expect(
      document.querySelector(".pc-button").classList.contains("active-mode")
    ).toBe(false);
    expect(
      document.querySelector(".player-button").classList.contains("active-mode")
    ).toBe(true);
  });
});
describe("Pass-device screen", () => {
  beforeEach(() => {
    domHandler = handleDom();
    player1 = new Player("player1");
    player2 = new Player("player2");
    eventHandler = eventListeners();
    document.documentElement.innerHTML = html;
  });
  test("Pass-device screen is rendered", () => {
    domHandler.renderPassDeviceScreen(player2);
    expect(document.querySelector(".pass-device-screen")).toBeTruthy();
  });
  test("Pass-device screen is removed", () => {
    domHandler.renderPassDeviceScreen(player2);
    domHandler.removePassDeviceScreen();
    expect(document.querySelector(".pass-device-screen")).toBeFalsy();
  });
  test("End-turn button is rendered",()=>{
    domHandler.renderEndTurnButton();
    expect(document.querySelector(".end-turn-button")).toBeTruthy();
  })
  test("End-turn-button can be removed",()=>{
    domHandler.renderEndTurnButton();
    domHandler.removeEndTurnButton();
    expect(document.querySelector(".end-turn-button")).toBeFalsy();
  })
});
describe("End screen", () => {
  beforeEach(() => {
    domHandler = handleDom();
    player1 = new Player("player1");
    player2 = new Player("player2");
    eventHandler = eventListeners();
    document.documentElement.innerHTML = html;
  });
  test("New game button is rendered on end screen", () => {
    domHandler.renderEndScreen(new Player("Winner"));
    const newGameButton = document.querySelector(".new-game");
    expect(newGameButton).toBeTruthy();
  });
});
