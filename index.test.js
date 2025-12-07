import { Player } from "./src/player";
import { eventListeners } from "./src";
import { handleDom } from "./src/dom";

let handleEventListeners = eventListeners();
let player1;
let player2;

beforeEach(()=>{
    const body = document.querySelector("body");
    body.appendChild(document.createElement("main"));
     player1 = new Player("real");
        player2 = new Player("real");
        player1.gameboard.setShipCoordinates("2",["A",2],["A",3]);
        player1.gameboard.setShipCoordinates("5",["A",1],["E",1]);
    
        player2.gameboard.setShipCoordinates("2",["B",2],["B",3]);
        player2.gameboard.setShipCoordinates("5",["C",1],["H",1]);
        const domHandler = handleDom();
        domHandler.renderGameboard(player1.gameboard,"player1");
        domHandler.renderGameboard(player2.gameboard,"player2");
        handleEventListeners.setPlayers(player1,player2);
    
})
test("Only gamebaord of starting player has an eventListener",()=>{
    let player1Gameboard = document.querySelector(".player1");
    let player2Gameboard = document.querySelector(".player2");

    jest.spyOn(player1Gameboard, 'addEventListener');
    jest.spyOn(player2Gameboard, 'addEventListener');
    
    handleEventListeners.setEventListenersOnGameboard(player1Gameboard);
    expect(player1Gameboard.addEventListener).toHaveBeenCalledWith('click',expect.any(Function));
    expect(player2Gameboard.addEventListener).not.toHaveBeenCalledWith('click',expect.any(Function));

})
test("handleClickOnCells calls receiveAttack of enemy",()=>{
    let player1Gameboard = document.querySelector(".player1");

    jest.spyOn(player2.gameboard,'receiveAttack');
     handleEventListeners.setEventListenersOnGameboard(player1Gameboard,handleEventListeners.handleClickOnGameBoard);
    const cell = player1Gameboard.querySelector(".cell");
    cell.click();
     expect(player2.gameboard.receiveAttack).toHaveBeenCalled();
})