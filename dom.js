import { Gameboard } from "./src/gameboard";

export const handleDom = function(){

function renderGameboard(gameBoard,playerName){
    const main = document.querySelector("main");
    const div = document.createElement("div");
    div.classList.add(`${playerName}`);
    div.classList.add("board");
    main.appendChild(div);
    const letters = ["A","B","C","D","E","F","G","H","I","J"];

    for(let i=0;i<10;i++){
        let column = document.createElement("div");
        column.classList.add("column");
        column.classList.add(letters[i]);
        for(let j=1;j<=10;j++){
            let cell = document.createElement("div");
            column.appendChild(cell);
            cell.classList.add("cell");
            cell.classList.add(letters[i]+j);
        }
        div.appendChild(column);
    }

}
return {
    renderGameboard
}
}