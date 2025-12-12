import { Player } from "./src/player";
import { eventListeners } from "./src";
import { handleDom } from "./src/dom";
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(
    path.resolve(__dirname, './src/template.html'),
    'utf8'
);

let handleEventListeners = eventListeners();
let player1;
let player2;
let player1DomGameboard;
let player2DomGameboard;

beforeEach(()=>{
    document.documentElement.innerHTML = html;
    player1 = new Player("real");
        player2 = new Player("real");
        player1.gameboard.setShipCoordinates("2",["A",2],["A",3]);
        player1.gameboard.setShipCoordinates("5",["A",1],["E",1]);
        player2.gameboard.setShipCoordinates("2",["B",2],["B",3]);
        player2.gameboard.setShipCoordinates("5",["C",1],["H",1]);
        const domHandler = handleDom();
        domHandler.renderGameboard(player1.gameboard,"player1");
        domHandler.renderGameboard(player2.gameboard,"player2");
        player1.setDomGameboard(document.querySelector(".player1 .board"));
        player2.setDomGameboard(document.querySelector(".player2 .board"));
        player1DomGameboard = player1.getDomGameboard();
        player2DomGameboard = player2.getDomGameboard();
        handleEventListeners.setPlayers(player1,player2);   
})
test("Only gamebaord of starting player has an eventListener",()=>{
    jest.spyOn(player1DomGameboard, 'addEventListener');
    jest.spyOn(player2DomGameboard, 'addEventListener');
    
    handleEventListeners.setEventListenersOnGameboard(player2DomGameboard);
    expect(player1DomGameboard.addEventListener).not.toHaveBeenCalledWith('click',expect.any(Function));
    expect(player2DomGameboard.addEventListener).toHaveBeenCalledWith('click',expect.any(Function));

})
test("handleClickOnCells calls receiveAttack of other player",()=>{
    jest.spyOn(player2.gameboard,'receiveAttack');
    handleEventListeners.setEventListenersOnGameboard(player2DomGameboard);
    const cell = player2DomGameboard.querySelector(".cell");
    cell.click();
    expect(player2.gameboard.receiveAttack).toHaveBeenCalled();
})
test("if attack misses, player can not place again", ()=>{
    jest.spyOn(player2.gameboard,'receiveAttack');
    handleEventListeners.setEventListenersOnGameboard(player2DomGameboard);
    const cellA5 = player2DomGameboard.querySelector(".A5");
    cellA5.click();
    expect(player2.gameboard.receiveAttack).toHaveBeenCalledTimes(1);
    const cellB2 = player2DomGameboard.querySelector(".B2");
    cellB2.click();
    expect(player2.gameboard.receiveAttack).toHaveBeenCalledTimes(1);
});
test("if attack is invalid, player can place another attack",()=>{
    jest.spyOn(player2.gameboard,'receiveAttack');
    handleEventListeners.setEventListenersOnGameboard(player2DomGameboard);
})
test("if attack was succesful, player can place another attack",()=>{
    jest.spyOn(player2.gameboard,'receiveAttack');
    handleEventListeners.setEventListenersOnGameboard(player2DomGameboard);
    const cellB2 = player2DomGameboard.querySelector(".B2");
    cellB2.click();
    expect(player2.gameboard.receiveAttack).toHaveBeenCalledTimes(1);
    const cellB3 = player2DomGameboard.querySelector(".B3");
    cellB3.click()
    expect(player2.gameboard.receiveAttack).toHaveBeenCalledTimes(2);
})
test("if attack misses, the current players turn ends and the other player can shoot",()=>{
    jest.spyOn(player1DomGameboard, 'addEventListener');
    jest.spyOn(player1DomGameboard, 'removeEventListener');
    jest.spyOn(player2DomGameboard, 'removeEventListener');
    jest.spyOn(player2DomGameboard,'addEventListener');
    //player1 turn
    handleEventListeners.setEventListenersOnGameboard(player2DomGameboard);
    const cellA5 = player2DomGameboard.querySelector(".A5");
    cellA5.click();
    //player2 turn
    expect(player2DomGameboard.removeEventListener).toHaveBeenCalled();
    expect(player1DomGameboard.addEventListener).toHaveBeenCalledWith('click',expect.any(Function));
    const cellA2 = player1DomGameboard.querySelector(".A2");
    cellA2.click();
    const cellD2 = player1DomGameboard.querySelector(".D2");
    cellD2.click(); //missed shot
    //player1 turn again
    expect(player1DomGameboard.removeEventListener).toHaveBeenCalled();
    expect(player2DomGameboard.addEventListener).toHaveBeenCalledWith('click',expect.any(Function));
})
test("if all ships of a player have been sunk, no cells can be clicked any more",()=>{
    handleEventListeners.setEventListenersOnGameboard(player2DomGameboard);
    const cellA5 = player2DomGameboard.querySelector(".A5");
    cellA5.click();
    //player2 turn
    jest.spyOn(player1DomGameboard, 'removeEventListener');
    jest.spyOn(player2DomGameboard, 'removeEventListener');

    const cellA2 = player1DomGameboard.querySelector(".A2");
    cellA2.click();
    const cellA3 = player1DomGameboard.querySelector(".A3");
    cellA3.click();
    const cellA1 = player1DomGameboard.querySelector(".A1");
    cellA1.click();
    const cellB1 = player1DomGameboard.querySelector(".B1");
    cellB1.click();
    const cellC1 = player1DomGameboard.querySelector(".C1");
    cellC1.click();
    const cellD1 = player1DomGameboard.querySelector(".D1");
    cellD1.click();
    const cellE1 = player1DomGameboard.querySelector(".E1");
    cellE1.click();
    //all ships have been sunk
    expect(player1.gameboard.haveAllShipsBeenSunk).toBeTruthy();
    expect(player1DomGameboard.removeEventListener).toHaveBeenCalled();
})

