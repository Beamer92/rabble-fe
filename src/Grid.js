import React from 'react'
import {Button} from 'reactstrap'

export default function Grid(props){
    return (
        props.winners === '' ?
            props.mapgrid.map((rw, ind) => {
                return <div className='gridrw' id={'gr' +ind} key={'gr' + ind}>
                {rw.map((box, idx) => {
                    return <div className='gridbox' id={'gb' + idx} key={'gb' + idx}><div className='gbLetter'>{box}</div>{props.renderRovers(ind,idx)}</div>
                    })}
                </div>
            }) 
        : 
            <div className='winner'>
                <img id='winPic' src={require('./imgs/winPic.jpg')} alt=''/>
                <p id='winPara'>{props.winners}</p>
                <Button color='primary' onClick={props.handleNewGame()}>Play Again</Button>
            </div> 
    )
}