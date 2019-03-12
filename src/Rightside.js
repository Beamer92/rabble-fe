import React from 'react'

export default function Rightside(props){
        return (
        <div className='extras col-md-3'>
            <img className='compass' src={require('./imgs/compass.png')} alt=''/>
            <div className={props.score > -1 ? 'showScore' : 'noScore'}>
                    {props.score > -1 ? `You Scored ${props.score}!` : ''}
            </div>
            <div className={props.myTurn ? 'myturn' : 'notmyturn' }>
                    {props.myTurn ? 'It is your turn!' : 'Waiting for other players'}
            </div>
            <div className={!props.showErrorMessage ? 'crash hide-crash' : 'crash' }>
                    Rover Fell off the grid! No letter collected, redeploying to last good location
            </div>
        </div>
       
        )
}