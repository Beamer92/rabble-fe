import React, { Component } from 'react'
import request from './utils/request'
import { Form, Button } from 'reactstrap'

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            letters: ['A', 'B', 'C', 'd', 'e'],
            user: {},
            rover: {},
            instructions: '',
            actionsLeft: 5
        }
    }

    componentDidMount() {
        request(`/user/${this.props.authentication.id}`, 'get')
            .then(response => {
                this.setState({
                    user: response.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleMove = event => {
        switch (event.target.name) {
            case 'left':
                this.setState({
                    instructions: this.state.instructions + 'L',
                    actionsLeft: this.state.actionsLeft - 1
                })
                break
            case 'right':
                this.setState({
                    instructions: this.state.instructions + 'R',
                    actionsLeft: this.state.actionsLeft - 1
                })
                break
            case 'forward':
                this.setState({
                    instructions: this.state.instructions + 'M',
                    actionsLeft: this.state.actionsLeft - 1
                })
                break
            default:
                return
        }
    }

    handleUndo = () => {
        this.setState({
            actionsLeft: this.state.actionsLeft === 5 ? 5 : this.state.actionsLeft + 1,
            instructions: this.state.instructions.slice(0, this.state.instructions.length -1)
        })
    }

    render() {
        return (
            <div className='entrypage'>
                <nav className='nav' id='navhome'>
                    <h1 className='title'>Rabble Rover!</h1>
                </nav>
                <div className='container-fluid'>
                    <div className='row'>
                        <nav className='col-md-2 d-none d-md-block sidebar'>
                            <h6>GameId: </h6>
                            <p></p>
                            <h6>UserId: </h6>
                            <p>{this.state.user.username}</p>
                            <h6>My Best Score: </h6>
                            <p>{this.state.user.highestScore}</p>
                            <h6>My Games Won: </h6>
                            <p>{this.state.user.gamesWon}</p>
                            <h5>This Round:</h5>

                            <Form className='gameActions'>
                                <p className='game'>Actions Left: {this.state.actionsLeft}</p>
                                <p className='game'>Instructions: {this.state.instructions}</p>

                                <Button name='left' id='left' onClick={this.handleMove} disabled={this.state.actionsLeft < 1 ? true : false}>Left</Button>
                                <Button name='right' id='right' onClick={this.handleMove} disabled={this.state.actionsLeft < 1 ? true : false}>Right</Button>
                                <Button name='forward' id='forward' onClick={this.handleMove} disabled={this.state.actionsLeft < 1 ? true : false}>Forward</Button>
                                <div class='undoAction' onClick={this.handleUndo}>undo</div>
                                <Button type='submit'>Go!</Button>
                            </Form>
                        </nav>
                        <div className='col-md'>
                            HERPDERPGAMEHERE
                        </div>
                    </div>
                    <div className='row' id='letters'>
                        <nav className='col-md-2 d-none d-md-block sidebar'></nav>
                         <div className='rwlet'>{this.state.letters.map((letter, ind) => {
                            return <div className='letter' id={'letter' + ind} key={'letter' + ind}>{letter.toUpperCase()}</div>
                        })}</div>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Home