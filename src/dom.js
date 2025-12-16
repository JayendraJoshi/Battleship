export const handleDom = function(){

function createGameboard(){
    const container = document.createElement("div");
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
function removeShipsFromDOMGameboard(domGameboard){
    const allCells = domGameboard.querySelectorAll(".cell");
    allCells.forEach(cell =>{
        cell.style.backgroundColor ="white";
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
function showMessageOnInfoContainer(player,keyword,shipName = ""){
    const infoContainer = document.querySelector(".info-container");
        switch(keyword){
        case "hit":
            infoContainer.textContent = "You hit an enemy ship!";
            break;
        case "sunk":
            infoContainer.textContent = "You have sunk the enemies " +shipName+"!"; 
             break;
        case "missed":
            infoContainer.textContent = "You missed!";
            break;
        case "null":
            infoContainer.textContent = "You can't attack the same cell twice!";
            break;
        case "start":
            infoContainer.textContent ="You start, "+player.getName()+"!";
            break;
        }
    
}
function showMessageInInfoContainerForPlayerVsPC(player,keyword,shipName = ""){
    const infoContainer = document.querySelector(".info-container");
    if(player.getMode()==="PC"){
        switch(keyword){
        case "hit":
            infoContainer.textContent = "The enemy has hit one of your ships!";
            break;
        case "sunk":
            infoContainer.textContent = "The enemy has sunk your " +shipName+"!"; 
             break;
        case "missed":
            infoContainer.textContent = "The enemy missed!";
            break;
        }
    }else if(player.getMode()==="Human"){
        switch(keyword){
        case "hit":
            infoContainer.textContent = "You hit an enemy ship!";
            break;
        case "sunk":
            infoContainer.textContent = "You have sunk the enemies " +shipName+"!"; 
             break;
        case "missed":
            infoContainer.textContent = "You missed!";
            break;
        case "null":
            infoContainer.textContent = "You can't attack the same cell twice!";
            break;
        case "start":
            infoContainer.textContent ="You start, "+player.getName()+"!";
            break;
        }
    }
    
}
function renderStartScreen(domGameboard){
    const div = document.createElement("div");
    div.classList.add("start-screen");
    const intro = document.createElement("h2");
    intro.textContent="Choose your ship placement";
    const shuffleButton = document.createElement("button");
    shuffleButton.textContent="Shuffle";
    shuffleButton.classList.add("shuffle-button");
    const startButton = document.createElement("button");
    startButton.textContent="Start";
    startButton.classList.add("start-button");
    const pageCoverDiv = document.createElement("div");
    pageCoverDiv.classList.add("page-cover");
      domGameboard.classList.add("board-container")
    const main = document.querySelector("main");
    main.appendChild(div);
    div.appendChild(intro);
    div.appendChild(shuffleButton);
    div.appendChild(domGameboard);
    div.appendChild(startButton);
    main.appendChild(pageCoverDiv);
}
function removeStartScreen(){
    document.querySelector(".start-screen").remove();
    document.querySelector(".page-cover").remove();
}

return {
    createGameboard,
    placeShipsOnGameboard,
    appendGameboardOnDOM,
    markMissedAttacksOnDOMGameboard,
    markSuccessfulAttacksOnDOMGameboard,
    showMessageOnInfoContainer,
    renderStartScreen,
    removeShipsFromDOMGameboard,
    removeStartScreen,
    showMessageInInfoContainerForPlayerVsPC
}
}