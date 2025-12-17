import { Player } from "./src/player";
import { eventListeners } from "./src";
import { handleDom } from "./src/dom";
import { Gameboard } from "./src/gameboard";
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

describe("Common gameplay mechanics", ()=>{
    beforeEach(()=>{
        document.documentElement.innerHTML = html;
        player1 = new Player("player1");
        player2 = new Player("player2");
        player1.gameboard.setShip("2",["A",2],["A",3]);
        player1.gameboard.setShip("5",["A",1],["E",1]);
        player2.gameboard.setShip("2",["B",2],["B",3]);
        player2.gameboard.setShip("5",["C",1],["H",1]);
        const domHandler = handleDom();
        player1DomGameboard = domHandler.createGameboard();
        player2DomGameboard = domHandler.createGameboard();
        player1.setDomGameboard(player1DomGameboard);
        player2.setDomGameboard(player2DomGameboard);
        player1.setMode("Human");
        player2.setMode("PC");
        handleEventListeners.setPlayers(player1,player2);   
    })

    test("Only gameboard of starting player has an eventListener",()=>{
        jest.spyOn(player1DomGameboard, 'addEventListener');
        jest.spyOn(player2DomGameboard, 'addEventListener');
        
        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVP");
        expect(player1DomGameboard.addEventListener).not.toHaveBeenCalledWith('click',expect.any(Function));
        expect(player2DomGameboard.addEventListener).toHaveBeenCalledWith('click',expect.any(Function));
    })

    test("handleClickOnCells calls receiveAttack of other player",()=>{
        jest.spyOn(player2.gameboard,'receiveAttack');
        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVP");
        const cell = player2DomGameboard.querySelector(".cell");
        cell.click();
        expect(player2.gameboard.receiveAttack).toHaveBeenCalled();
    })

    test("Invalid attack allows player to attack again",()=>{
        jest.spyOn(player2.gameboard,'receiveAttack');
        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVP");
        const cellB2 = player2DomGameboard.querySelector(".B2");
        cellB2.click();
        expect(player2.gameboard.receiveAttack).toHaveBeenCalledTimes(1);
        cellB2.click();
        expect(player2.gameboard.receiveAttack).toHaveBeenCalledTimes(2);
        const cellB3 = player2DomGameboard.querySelector(".B3");
        cellB3.click();
        expect(player2.gameboard.receiveAttack).toHaveBeenCalledTimes(3);
    })

    test("Successful attack allows player to attack again",()=>{
        jest.spyOn(player2.gameboard,'receiveAttack');
        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVP");
        const cellB2 = player2DomGameboard.querySelector(".B2");
        cellB2.click();
        expect(player2.gameboard.receiveAttack).toHaveBeenCalledTimes(1);
        const cellB3 = player2DomGameboard.querySelector(".B3");
        cellB3.click()
        expect(player2.gameboard.receiveAttack).toHaveBeenCalledTimes(2);
    })

    test("Clicking outside of cells does nothing", ()=>{
        jest.spyOn(player2.gameboard,'receiveAttack');
        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVP");
        
        // Click on the board container itself, not a cell
        player2DomGameboard.click();
        
        expect(player2.gameboard.receiveAttack).not.toHaveBeenCalled();
    });

    test("Game ends when all ships are sunk",()=>{
        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVP");
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

});

describe("PVP mode mechanics", ()=>{
    beforeEach(()=>{
        document.documentElement.innerHTML = html;
        player1 = new Player("player1");
        player2 = new Player("player2");
        player1.gameboard.setShip("2",["A",2],["A",3]);
        player1.gameboard.setShip("5",["A",1],["E",1]);
        player2.gameboard.setShip("2",["B",2],["B",3]);
        player2.gameboard.setShip("5",["C",1],["H",1]);
        const domHandler = handleDom();
        player1DomGameboard = domHandler.createGameboard();
        player2DomGameboard = domHandler.createGameboard();
        player1.setDomGameboard(player1DomGameboard);
        player2.setDomGameboard(player2DomGameboard);
        player1.setMode("Human");
        player2.setMode("PC");
        handleEventListeners.setPlayers(player1,player2);   
    })

    test("Turn switches between players after miss",()=>{
        jest.spyOn(player1DomGameboard, 'addEventListener');
        jest.spyOn(player1DomGameboard, 'removeEventListener');
        jest.spyOn(player2DomGameboard, 'removeEventListener');
        jest.spyOn(player2DomGameboard,'addEventListener');
        //player1 turn
        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVP");
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
});

describe("PVC mode mechanics", ()=>{
    beforeEach(()=>{
        document.documentElement.innerHTML = html;
        player1 = new Player("player1");
        player2 = new Player("PC");
        player1.gameboard.setShip("2",["A",2],["A",3]);
        player1.gameboard.setShip("5",["A",1],["E",1]);
        player2.gameboard.setShip("2",["B",2],["B",3]);
        player2.gameboard.setShip("5",["C",1],["H",1]);
        const domHandler = handleDom();
        player1DomGameboard = domHandler.createGameboard();
        player2DomGameboard = domHandler.createGameboard();
        player1.setDomGameboard(player1DomGameboard);
        player2.setDomGameboard(player2DomGameboard);
        player1.setMode("Human");
        player2.setMode("PC");
        handleEventListeners.setPlayers(player1,player2);   
    })

    test("PC performs automatic attacks after human turn", ()=>{
        jest.spyOn(player1DomGameboard, 'addEventListener');
        jest.spyOn(player2DomGameboard, 'removeEventListener');
        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVC");
        const cellA5 = player2DomGameboard.querySelector(".A5");
        cellA5.click();
        //PC turn
        expect(player2DomGameboard.removeEventListener).toHaveBeenCalled();
        expect(player1DomGameboard.addEventListener).toHaveBeenCalledWith('click',expect.any(Function));
        player2.automatedAttack(player1.getDomGameboard(),player1.getGameboard());
        
    })

    test("Turn switches back to Human after PC misses",()=>{
        jest.spyOn(player1DomGameboard, 'addEventListener');
        jest.spyOn(player1DomGameboard, 'removeEventListener');

        jest.spyOn(player2DomGameboard, 'removeEventListener');
        jest.spyOn(player2DomGameboard, 'addEventListener');

        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVC");
        const cellA5 = player2DomGameboard.querySelector(".A5");
        cellA5.click();
        //Pc turn
        expect(player2DomGameboard.removeEventListener).toHaveBeenCalledTimes(1);
        expect(player1DomGameboard.addEventListener).toHaveBeenCalledTimes(1);
        let attackResult = true;
        while(attackResult===true){
            player2.automatedAttack(player1.getDomGameboard(),player1.getGameboard());
            let lastAttack = player2.attackResults[player2.attackResults.length-1]
            attackResult = lastAttack[1];
        }
        //Human turn should begin now
        expect(player1DomGameboard.removeEventListener).toHaveBeenCalledTimes(1);
        expect(player2DomGameboard.addEventListener).toHaveBeenCalledTimes(2);
    })

    test("PC attacks adjacent cells after successful hit",()=>{
        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVP");
        //Player 1 attacks
        const cellA5 = player2DomGameboard.querySelector(".A5");
        cellA5.click();
        //Simulate PC's (player 2) automated turn
        const cellA2 = player1DomGameboard.querySelector(".A2");
        cellA2.click();
        player2.attackResults.push(["A2",true]);
        
        //Expect automated attack to be adjacent
        handleEventListeners.removeEventListenersOnGameboard(player1DomGameboard,"PVP");
        handleEventListeners.setEventListenersOnGameboard(player1DomGameboard,"PVC");
        player2.automatedAttack(player1.getDomGameboard(),player1.getGameboard());
        let allAttackedCells = player2.attackResults.flatMap(entry => entry[0]);
        expect(["A1", "B2", "A3"]).toContain(allAttackedCells[allAttackedCells.length-1]);
    })
});

describe("UI screen transitions", ()=>{
    let domHandler;
    let startGameboard;
    let startDOMGameboard;
    
    beforeEach(()=>{
        document.documentElement.innerHTML = html;
        domHandler = handleDom();

        player1 = new Player("player1");
        player2 = new Player("player2");
        player1DomGameboard = domHandler.createGameboard();
        player2DomGameboard = domHandler.createGameboard();
        player1.gameboard.setShip("2",["A",2],["A",3]);
        player1.gameboard.setShip("5",["A",1],["E",1]);
        player2.gameboard.setShip("2",["B",2],["B",3]);
        player2.gameboard.setShip("5",["C",1],["H",1]);     
        player1.setDomGameboard(player1DomGameboard);
        player2.setDomGameboard(player2DomGameboard);
        player1.setMode("Human");
        player2.setMode("PC");
        handleEventListeners.setPlayers(player1,player2);  
        
        startGameboard = new Gameboard();
        startGameboard.setShipsRandomly();
        startDOMGameboard = domHandler.createGameboard();
        domHandler.placeShipsOnGameboard(startGameboard, startDOMGameboard);
        domHandler.renderSetupScreen(startDOMGameboard);
        handleEventListeners.setStartGameboard(startGameboard);
    });

    test("Shuffle button changes ship positions", ()=>{
        handleEventListeners.setEventListenerOnShuffleButton();
        const shuffleButton = document.querySelector(".shuffle-button");
        expect(shuffleButton).toBeTruthy();
        
        // Get initial ship positions
        const initialShips = [...startGameboard.placedShips];
        
        // Click shuffle
        shuffleButton.click();
        
        // Ships should be different ( high possibility but could sometimes fail if placement is randomly the same!)
        const newShips = startGameboard.placedShips;
        expect(newShips).not.toEqual(initialShips);
    });

    test("Setup button transitions from setup screen to game", ()=>{
        handleEventListeners.setEventListenerOnSetupButton();
        
        const setupButton = document.querySelector(".setup-button");
        setupButton.click();
        
        // Setup screen removed, game boards added, ships transferred
        expect(document.querySelector(".setup-screen")).toBeFalsy();
        expect(document.querySelector(".player1")).toBeTruthy();
        expect(document.querySelector(".player2")).toBeTruthy();
        expect(player1.gameboard.placedShips.length).toBeGreaterThan(0);
    });
    test("Name input of setup screen becomes player1 name",()=>{
        const nameInput = document.getElementById('name');
        nameInput.value = "Daniel";
        handleEventListeners.setEventListenerOnSetupButton();
        const setupButton = document.querySelector(".setup-button");
        setupButton.click();
        expect(player1.getName()).toBe("Daniel");
    })

     test("End screen renders when game ends",()=>{
        const setupButton = document.querySelector(".setup-button");
        setupButton.click();
        handleEventListeners.setEventListenersOnGameboard(player2DomGameboard,"PVP");
        const cellB2 = player2DomGameboard.querySelector(".B2");
        cellB2.click();
        const cellB3 = player2DomGameboard.querySelector(".B3");
        cellB3.click();
        //Now player 2 lost all ships
        const cellC1 = player2DomGameboard.querySelector(".C1");
        cellC1.click();
        const cellD1 = player2DomGameboard.querySelector(".D1");
        cellD1.click();
        const cellE1 = player2DomGameboard.querySelector(".E1");
        cellE1.click();
        const cellF1 = player2DomGameboard.querySelector(".F1");
        cellF1.click();
        const cellG1 = player2DomGameboard.querySelector(".G1");
        cellG1.click();
        const cellH1 = player2DomGameboard.querySelector(".H1");
        cellH1.click();
        
        expect(player2.gameboard.haveAllShipsBeenSunk).toBeTruthy();
        const endScreen = document.querySelector(".end-screen");
        expect(endScreen).toBeTruthy();
    })

    test("New game button is rendered on end screen", ()=>{
        domHandler.renderEndScreen(new Player("Winner"));
        const newGameButton = document.querySelector(".new-game");
        expect(newGameButton).toBeTruthy();
    });
});

