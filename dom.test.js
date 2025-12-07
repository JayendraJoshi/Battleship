import { Gameboard } from "./src/gameboard";
import { handleDom } from "./src/dom";
import { Player } from "./src/player";

let domHandler;
let gameBoard;
let player1;

beforeEach(() => {
    domHandler = handleDom();
    player1 = new Player();
    gameBoard = player1.gameboard;
    const body = document.querySelector("body");
    body.appendChild(document.createElement("main"));
})
afterEach(() => {
    document.body.innerHTML = ""; 
});
test("gameboard is succesfully created", () => {
    domHandler.renderGameboard(gameBoard,"player1");
    const player1Board = document.querySelector(".board");
    expect(player1Board).toBeTruthy();
    expect(player1Board.tagName).toBe("DIV");
})
test("correctly renders gameboard with 100 cells", () => {
    domHandler.renderGameboard(gameBoard,"player1");
    const player1Board = document.querySelector(".board");
    expect(player1Board.tagName).toBe("DIV");
    const allCells = player1Board.querySelectorAll(".cell");
    expect(allCells.length).toBe(100);
})

test("cells with classes A1 - J10 exist", () => {
    domHandler.renderGameboard(gameBoard,"player1");
    const player1Board = document.querySelector(".board");
    const allCells = player1Board.querySelectorAll(".cell");
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    for (let i = 0; i < 10; i++) {
        for (let j = 1; j <= 10; j++) {
            const className = letters[i] + j;
            const found = Array.from(allCells).some(cell => cell.classList.contains(className));
            expect(found).toBe(true);
        }
    }
})

test("renders ships on board by applying black color to their cells", () => {
    player1.gameboard.setShipCoordinates("2", ["A", 2], ["A", 3]);
    player1.gameboard.setShipCoordinates("5", ["A", 1], ["E", 1]);

    domHandler.renderGameboard(gameBoard, "player1");
    
    const player1Container = document.querySelector(".player1");
    const player1Board = player1Container.querySelector(".board");
    const allCells = player1Board.querySelectorAll(".cell");

    const placedShips = gameBoard.placedShips;
    let coordinatesOfPlacedShips = placedShips.flatMap(shipPath => shipPath[1]);
    const classNamesOfShipCoordinates = coordinatesOfPlacedShips.map(coordinate => coordinate[0] + coordinate[1]);
    
    classNamesOfShipCoordinates.forEach(className => {
        const cell = Array.from(allCells).find(cell => cell.classList.contains(className));
        expect(cell).toBeTruthy();
        expect(cell.style.backgroundColor).toBe("rgb(128, 128, 128)"); 
    });
});

