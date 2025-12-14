import { Gameboard } from "./gameboard";

export const handleDom = function(){

function createGameboard(playerName){
    const container = document.createElement("div");
    container.classList.add(`.${playerName}`);
    container.classList.add("board-container");
    const letters = ["A","B","C","D","E","F","G","H","I","J"];

    let board = document.createElement("div");
    board.classList.add("board");

    const columnDisplay = document.createElement("div");
    columnDisplay.classList.add("column-display");

    let rowDisplay = document.createElement("div");
    rowDisplay.classList.add("row-display");
    
    for(let i = 1;i<=10;i++){
        let rowDisplayNumber = document.createElement("div");
        rowDisplayNumber.textContent = i;
        rowDisplay.append(rowDisplayNumber);
    }
    for(let i=0;i<10;i++){
        let columnDisplayLetter = document.createElement("div");
        columnDisplayLetter.textContent = letters[i];
        columnDisplay.append(columnDisplayLetter);
        let column = document.createElement("div");
        column.classList.add("column");
        column.classList.add(letters[i]);
        for(let j=1;j<=10;j++){
            let cell = document.createElement("div");
            column.appendChild(cell);
            cell.classList.add("cell");
            cell.classList.add(letters[i]+j);
        }
        board.appendChild(column);
    }
    container.appendChild(columnDisplay);
    container.appendChild(rowDisplay);
    container.append(board);
    return container;
}
function placeShipsOnGameboard(gameboard,domboard){
    const allCells = domboard.querySelectorAll(".cell");
    const placedShips = gameboard.placedShips;
    let coordinatesOfPlacedShips = placedShips.flatMap(shipPath=> shipPath[1]);
    const classNamesOfShipCoordinates = coordinatesOfPlacedShips.map(coordinate => coordinate[0]+coordinate[1]);
    
    classNamesOfShipCoordinates.forEach(className => {
        const cell = Array.from(allCells).find(cell=> cell.classList.contains(className));
       cell.style.backgroundColor = "rgb(128, 128, 128)";
    })
}
function appendGameboardOnDOM(gameboard,playerName){
    const main = document.querySelector("main");
    gameboard.classList.add("board-container");
    gameboard.classList.add(playerName);
    main.appendChild(gameboard);
}
function markMissedAttacksOnDOMGameboard(gameboard,domboard){
    const allCells = domboard.querySelectorAll(".cell");
    let coordinatesOfMissedAttacks = gameboard.missedAttacks;
    const classNamesOfShipCoordinates = coordinatesOfMissedAttacks.map(coordinate => coordinate[0]+coordinate[1]);
    
    classNamesOfShipCoordinates.forEach(className => {
        const cell = Array.from(allCells).find(cell=> cell.classList.contains(className));
       cell.style.backgroundColor = "rgb(29, 137, 187, 1)";
    })
}
function markSuccessfulAttacksOnDOMGameboard(gameboard,domboard){
     const allCells = domboard.querySelectorAll(".cell");
    let coordinatesOfMissedAttacks = gameboard.successfulAttacks;
    const classNamesOfShipCoordinates = coordinatesOfMissedAttacks.map(coordinate => coordinate[0]+coordinate[1]);
    
    classNamesOfShipCoordinates.forEach(className => {
        const cell = Array.from(allCells).find(cell=> cell.classList.contains(className));
       cell.style.backgroundColor = "rgb(200, 40, 35)";
    })
}
function showMessageOnInfoContainer(playerName,result){
    const infoContainer = document.querySelector(".info-container");
    switch(result){
        case "hit":
            infoContainer.textContent = playerName +" hit an enemy ship!";
            break;
        case "missed":
            infoContainer.textContent = playerName +" missed!";
            break;
        case "null":
            infoContainer.textContent = "You can't attack the same cell twice!";
            break;
        }
}
return {
    createGameboard,
    placeShipsOnGameboard,
    appendGameboardOnDOM,
    markMissedAttacksOnDOMGameboard,
    markSuccessfulAttacksOnDOMGameboard,
    showMessageOnInfoContainer
}
}