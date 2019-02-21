const turnLeft=(face)=>{
    const cardinals = ['N', 'E', 'S', 'W']
    const ind = cardinals.indexOf(face)
    const newInd = ind > 0 ? ind - 1 : cardinals.length - 1
    return cardinals[newInd]
}

const turnRight=(face)=>{
    const cardinals = ['N', 'E', 'S', 'W']
    const ind = cardinals.indexOf(face)
    const newInd = ind < cardinals.length -1 ? ind + 1 : 0
    return cardinals[newInd]
}

const moveForward=(position, face)=>{
    switch(face){
        case 'N':
            if(position[1]+1 > 8) return false
            return [position[0], position[1]+1]
        case 'S':
            if(position[1]-1 < 0) return false
            return [position[0], position[1]-1]
        case 'E':
            if(position[0]+1 > 8) return false
            return [position[0]+1, position[1]]
        case 'W':
            if(position[0]-1 < 0) return false
            return [position[0]-1, position[1]]
        default: 
            throw new Error('Rover cannot move forward, mechanical failure')
    }
}

const operate=(position, face, instructions)=>{
    if(instructions === '') {
        return {"position": position, "face": face}
    }
    else{
        if(instructions[0] === "L") return operate(position, turnLeft(face), instructions.substr(1))
        else if (instructions[0] === "R") return operate(position, turnRight(face), instructions.substr(1))
        else {
            let newPosition = moveForward(position, face)
            if(!newPosition) return {position : position, face: face, error: "Crashed at this position, repairing"}
            return operate(newPosition, face, instructions.substr(1))
        }
    }
}

module.exports = {operate}