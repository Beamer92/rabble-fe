module.exports = class Rover{
    constructor(grid = [1,1], location = [0,0], face = 'N', instructions=''){
        this.grid = (grid.length < 1 || grid === '') ? [1,1] : grid
        this.location = (location.length < 1 || location === '') ? [0,0] : location
        this.face = face === '' ? 'N' : face
        this.instructions = instructions
    }

    get grid(){
        return this._grid
    }
    get location(){
        return this._location
    }
    get face(){
        return this._face
    }
    get instructions(){
        return this._instructions
    }

    //grid is not settable after the inital instancing
    set grid(val){
        if(this._grid) throw new Error('You cannot change the plateau on which this Rover is assigned')
        else if(Array.isArray(val) && val.length === 2 && val.every(x => Number.isInteger(x) && x>= 0)){
            return this._grid = val
        }
        throw new Error('The plateau boundaries appear to be malformed or otherwise nonconducive to exploration')
    }

    //location is not settable after the initial instancing, location is changed by issuing instructions and operating on them
    set location(val){
        if(this._location) throw new Error('You cannot manually set a Rover\'s location. It needs instructions to go there')
        else if (Array.isArray(val) && val.length === 2 && val.every((ele, ind) => {return (Number.isInteger(ele) && ele >= 0 && ele <= this.grid[ind])})){
            return this._location = val
        }
        throw new Error('Rover\'s location coordinates were either malformed or out of bounds')
    }

    //face is not settable after the initial instancing, face is change by issuing instructions and operating on them
    set face(val) {      
        const re = /^[n|s|e|w]$/i
        if(!re.test(val.toUpperCase())) throw new Error('Rover not facing a valid direction')
        return this._face = val.toUpperCase()
    }

    //instructions are settable at any time, they are just a store of operations yet to be executed
    set instructions(val){
        if(typeof val === 'string'){
            let regTest = new RegExp(/^[LMR]*$/gi)
            if(regTest.test(val)) return this._instructions = val
        }
        throw new Error('Instructions are invalid')
    }

    turnLeft(){
        const cardinals = ['N', 'E', 'S', 'W']
        const ind = cardinals.indexOf(this.face)
        const newInd = ind > 0 ? ind - 1 : cardinals.length - 1
        this._face = cardinals[newInd]
        return this
    }

    turnRight(){
        const cardinals = ['N', 'E', 'S', 'W']
        const ind = cardinals.indexOf(this.face)
        const newInd = ind < cardinals.length -1 ? ind + 1 : 0
        this._face = cardinals[newInd]
        return this
    }

    moveForward(){
        switch(this.face){
            case 'N':
                this._location[1]++
                break
            case 'S':
                this._location[1]--
                break
            case 'E':
                this._location[0]++
                break
            case 'W':
                this._location[0]--
                break
            default: 
                throw new Error('Rover cannot move forward, mechanical failure')
        }
        return this
    }

    //runs the current instructions, if any, and returns the new heading while clearing the instructions so the Rover could accept new ones
    operate(){
        if(!this.location.every(
            (ele, ind) => {return (ele >= 0 && ele <= this.grid[ind])})
            ) throw new Error(`This rover fell off the plateau at point ${this.location}`)
        else if(this.instructions === '') {
            return {"location": this.location, "face": this.face}
        }
        else{
            if(this.instructions[0] === "L") this.turnLeft()
            else if (this.instructions[0] === "R") this.turnRight()
            else this.moveForward()
            
            this._instructions = this.instructions.substr(1)
            return this.operate()
        }
    }
}