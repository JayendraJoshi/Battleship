import { Ship } from "./ship";
export class Gameboard{

    missedAttacks = [];
    placedShips = [];
    board;
    constructor(){
        this.board =  {
        "A": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "B": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "C": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "D": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "E": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "F": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "G": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "H": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "I": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "J": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ]
        }
    }
    setShipCoordinates(shipLength,[startRow,startColumn],[endRow,endColumn]){
        if(this.AreCoordinatesUnavailable([startRow,startColumn],[endRow,endColumn])) return null;
        this.placedShips.push([new Ship(shipLength),[startRow,startColumn], [endRow,endColumn]]);
        return true;
    }
    AreCoordinatesUnavailable([startRow,startColumn],[endRow,endColumn]){
        if(startRow !== endRow && startColumn !== endColumn) return true;
        if(startRow === endRow){
            let smallerColumn;
            let largerColumn;

            if(startColumn<endColumn) {
                smallerColumn = startColumn;
                largerColumn = endColumn;
            }else{
                smallerColumn = endColumn;
                largerColumn = startColumn;
            }
            for(let i = smallerColumn;i<=largerColumn;i++){
                if(this.isCoordinateTaken([startRow,i])) return true;
            }
        }else{
            let smallerRow;
            let largerRow;
            const letters = ["A","B","C","D","E","F","G","H","I","J"];

            if(startRow< endRow){
                smallerRow = startRow;
                largerRow = endRow;
            }else{
                smallerRow = endRow;
                largerRow = startRow;
            }
            let indexOfSmallerRow = letters.indexOf(smallerRow);
            let indexOfLargerRow = letters.indexOf(largerRow);
            for(let i = indexOfSmallerRow;i<= indexOfLargerRow;i++){
                if(this.isCoordinateTaken([letters[i],startColumn])) return true;
            }
        }
        return false;
    }
    isCoordinateTaken([row, column]){
        return this.placedShips
            .flatMap((ship) => [ship[1], ship[2]])
            .some(coord => coord[0] === row && coord[1] === column);
    }
    receiveAttack(){

    }

    haveAllShipsBeenSunk(){

    }


}