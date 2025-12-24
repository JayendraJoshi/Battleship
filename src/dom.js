export const handleDom = function(){

function createDomGameboard(){
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
            cell.style.backgroundColor = "white";
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
        if(cell.style.backgroundColor !== "rgb(29, 137, 187, 1)" && cell.style.backgroundColor !=="rgb(200, 40, 35)" ){
            cell.style.backgroundColor = "rgb(128, 128, 128)";
        }
       
    })
}
function removeShipsFromDOMGameboard(domGameboard){
    const allCells = domGameboard.querySelectorAll(".cell");
    allCells.forEach(cell =>{
        cell.style.backgroundColor ="white";
    })
}
function hideShipPlacementFromDOMGameboard(domGameboard){
     const allCells = domGameboard.querySelectorAll(".cell");
    allCells.forEach(cell =>{
       if(cell.style.backgroundColor=== "rgb(128, 128, 128)") cell.style.backgroundColor ="white";
    })
}
function appendGameboardOnDOM(gameboard,playerName){
    const main = document.querySelector("main");
    gameboard.classList.add("board-container");
    gameboard.classList.add(playerName);
    main.appendChild(gameboard);
}
function renderInfoContainer(){
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");
    document.querySelector("main").appendChild(infoContainer);
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
function renderChooseModeScreen(){
    const div = document.createElement("div");
    div.classList.add("choose-mode-screen")
    const h2 = document.createElement("h2");
    h2.textContent = "Choose your opponent";
    const playerButton = document.createElement("button");
    playerButton.classList.add("player-button");
    playerButton.textContent="Local Player";
    const pcButton = document.createElement("button");
    pcButton.classList.add("pc-button", "active-mode");
    pcButton.textContent = "Computer";
    const chooseModeNextButton = document.createElement("button");
    chooseModeNextButton.textContent = "Next";
    chooseModeNextButton.classList.add("next-button", "choose-mode");
    div.appendChild(h2);
    div.appendChild(pcButton);
    div.appendChild(playerButton);
    div.appendChild(chooseModeNextButton);
    document.querySelector("main").appendChild(div);
}
function removeChooseModeScreen(){
    document.querySelector(".choose-mode-screen").remove();
}
function renderSetupScreen(domGameboard){
    const div = document.createElement("div");
    div.classList.add("setup-screen");
    const nameInput = document.createElement("input");
    const nameLabel = document.createElement("label");
    nameInput.id ='name';
    nameInput.type='text';
    nameLabel.htmlFor='name';
    nameLabel.textContent = 'Enter Your Name:';
    const intro = document.createElement("h2");
    intro.textContent="Choose Your Ship Placement:";
    const shuffleButton = document.createElement("button");
    shuffleButton.textContent="Shuffle";
    shuffleButton.classList.add("shuffle-button");
    const setupNextButton = document.createElement("button");
    setupNextButton.textContent="Next";
    setupNextButton.classList.add("next-button", "setup");
    domGameboard.classList.add("board-container");
    const main = document.querySelector("main");
    nameLabel.appendChild(nameInput);
    main.appendChild(div);
    div.appendChild(nameLabel);
    div.appendChild(intro);
    div.appendChild(shuffleButton);
    div.appendChild(domGameboard);
    div.appendChild(setupNextButton);
}
function removeSetupScreen(){
    document.querySelector(".setup-screen").remove();
}
function renderEndScreen(winner){
    const div = document.createElement("div");
    div.classList.add("end-screen");
    const endH2 = document.createElement("h2");
    endH2.textContent=`${winner.getName()} won!`;

    const newGameButton = document.createElement("button");
    newGameButton.textContent="new game";
    newGameButton.classList.add("new-game")

    const pageCoverDiv = document.createElement("div");
    pageCoverDiv.classList.add("page-cover");
    const main = document.querySelector("main");
    div.appendChild(endH2);
    div.appendChild(newGameButton)
    main.appendChild(div);
    document.querySelector("#root").appendChild(pageCoverDiv);
    if(document.querySelector(".info-container")) document.querySelector(".info-container").remove();
}
function removeEndScreen(){
    document.querySelector(".end-screen").remove();
    document.querySelector(".page-cover").remove();
    if(document.querySelector(".game-layout"))removeGameViewClassFromMain();
}
function renderPassDeviceScreen(player){
const div = document.createElement("div");
div.classList.add("pass-device-screen");
const button = document.createElement("button");
button.textContent="Ready";
button.classList.add("ready-button");
const h1 = document.createElement("h1");
h1.textContent= `Pass device to ${player.getName()}`;
div.appendChild(h1);
div.appendChild(button);
document.querySelector("main").appendChild(div);

const pageCoverDiv = document.createElement("div");
    pageCoverDiv.classList.add("page-cover");

document.querySelector("#root").appendChild(pageCoverDiv);
}
function removePassDeviceScreen(){
    document.querySelector(".pass-device-screen").remove();
}
function renderEndTurnButton(){
    const button = document.createElement("button");
    button.classList.add("end-turn-button");
    button.textContent="End Turn";
    document.querySelector("main").appendChild(button);
}
function removeEndTurnButton(){
    document.querySelector(".end-turn-button").remove();
}

function switchGameboardVisibility(waitingPlayer, playingPlayer){
   document.querySelector(".page-cover").remove();
    removePassDeviceScreen();
    hideShipPlacementFromDOMGameboard(playingPlayer.getDomGameboard());
    placeShipsOnGameboard(waitingPlayer.gameboard, waitingPlayer.getDomGameboard());

    markMissedAttacksOnDOMGameboard(playingPlayer.gameboard, playingPlayer.getDomGameboard());
    markSuccessfulAttacksOnDOMGameboard(playingPlayer.gameboard, playingPlayer.getDomGameboard());

    markMissedAttacksOnDOMGameboard(waitingPlayer.gameboard, waitingPlayer.getDomGameboard());
    markSuccessfulAttacksOnDOMGameboard(waitingPlayer.gameboard, waitingPlayer.getDomGameboard());
}
function addGameViewClassToMain(){
    document.querySelector("main").classList.add("game-layout");
}
function removeGameViewClassFromMain(){
document.querySelector("main").classList.remove("game-layout");
}

return {
    createDomGameboard,
    placeShipsOnGameboard,
    appendGameboardOnDOM,
    markMissedAttacksOnDOMGameboard,
    markSuccessfulAttacksOnDOMGameboard,
    showMessageOnInfoContainer,
    renderSetupScreen,
    removeShipsFromDOMGameboard,
    removeSetupScreen,
    showMessageInInfoContainerForPlayerVsPC,
    renderEndScreen,
    removeEndScreen,
    renderChooseModeScreen,
    removeChooseModeScreen,
    renderPassDeviceScreen,
    removePassDeviceScreen,
    hideShipPlacementFromDOMGameboard,
    renderEndTurnButton,
    removeEndTurnButton,
    switchGameboardVisibility,
    renderInfoContainer,
    addGameViewClassToMain,
    removeGameViewClassFromMain
}
}