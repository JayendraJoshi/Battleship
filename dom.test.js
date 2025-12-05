import { Gameboard } from "./src/gameboard";
import { handleDom } from "./dom";

let domHandler;
let gameBoard;

beforeEach(() => {
    domHandler = handleDom();
    gameBoard = new Gameboard();
    const body = document.querySelector("body");
    body.appendChild(document.createElement("main"));
})
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