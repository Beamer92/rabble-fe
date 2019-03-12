import React from 'react'
import { Form, Button } from 'reactstrap'


export default function InstructionsForm(props){
    return (
        <Form className='gameActions' onSubmit={props.executeInstructions()}>
            <p className='game'>Actions Left: {props.actionsLeft}</p>
            <p className='game'>Instructions:</p>
            <p className='instructions'>{props.instructions}</p>

            <Button color={props.myTurn ? 'warning' : 'secondary'} name='left' id='left' onClick={props.handleAction()} disabled={props.actionsLeft < 1 ? true : false}>Left</Button>
            <Button color={props.myTurn ? 'warning' : 'secondary'} name='right' id='right' onClick={props.handleAction()} disabled={props.actionsLeft < 1 ? true : false}>Right</Button>
            <Button color={props.myTurn ? 'warning' : 'secondary'} name='forward' id='forward' onClick={props.handleAction()} disabled={props.actionsLeft < 1 ? true : false}>Forward</Button>
            <div className='undoAction' onClick={props.handleUndo()}>undo</div>
            <Button color={props.myTurn ? 'success' : 'secondary'} type='submit' disabled={!props.myTurn ? true : false}>Execute Instructions!</Button>
        </Form>
    )
}