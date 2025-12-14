export class Ship{

length;
numberOfHits = 0;
name;

constructor(length){
    this.length = length;
}

hit(){
    this.numberOfHits++;
}
isSunk(){
    if(this.numberOfHits === this.length){
        return true;
    }
    else{
        return false;
    }
}
setName(name){
    this.name = name;
}
getName(){
    return this.name;
}


}