import React from 'react'

export default function Stats(props){
    return (
        <div>
            <h6>GameId: </h6>
            <p>{props.gameId}</p>
            <h6>UserId: </h6>
            <p>{props.user.username}</p>
            <h6>Position: </h6>
            <p className='roverPos'>{JSON.stringify(props.rover.position)}{' '}{props.rover.face}</p>
            <h6>My Best Score: </h6>
            <p>{props.user.highestScore}</p>
            <h6>My Games Won: </h6>
            <p>{props.user.gamesWon}</p>
            <h5>This Round:</h5>
        </div>
    )
}