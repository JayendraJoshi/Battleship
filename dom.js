import { Gameboard } from "./src/gameboard";

export const handleDom = function(){

function renderGameboard(gameBoard,playerName){
    const main = document.querySelector("main");
    const div = document.createElement("div");
    div.classList.add(`${playerName}`);
    div.classList.add("board-container");
    main.appendChild(div);
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
    div.appendChild(columnDisplay);
    div.appendChild(rowDisplay);
    div.append(board);

}
return {
    renderGameboard
}
}