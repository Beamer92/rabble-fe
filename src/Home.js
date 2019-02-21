import React, { Component } from 'react'
import request from './utils/request'
import { Form, Button } from 'reactstrap'
import socketIOClient from "socket.io-client";
import {operate} from './utils/roverFunc'

class Home extends Component {
    constructor(props) {
        super(props)
        this.socket = socketIOClient(process.env.REACT_APP_BACKEND);

        this.state = {
            gameId: '',
            letters: [],
            user: {},
            rover: {},
            instructions: '',
            actionsLeft: 5,
            mapgrid: [],
            otherRovers: [],
            showErrorMessage: false,
            myTurn: true
        }
    }

    send=()=>{
        this.socket.emit('send letters', this.state.letters)
        // console.log(this.state.rover.position)
    }

    connectGame=(username)=>{
        this.socket.emit('connect game', username)
    }

    getGame=(gameId)=>{
        this.socket.emit('get game', gameId)
    }

    getUser=(username)=>{
        this.socket.emit('get user', username)
    }

    setUser=(username, rover, letters)=>{
        this.socket.emit('set user', username, rover, letters)
    }

    setGame=(gameId, mapgrid)=>{
        this.socket.emit('set game', gameId, mapgrid)
    }

    otherUsers=(userList)=>{
        if(this.state.user.hasOwnProperty('username')){
            let skip = userList.indexOf(this.state.user.username)
            userList.splice(skip, 1)
            this.socket.emit('get rovers', userList)
        }
    }

    componentDidMount(){

        this.socket.on('send letters', (letters, socket) => {
            console.log(letters, socket)
        })

        this.socket.on('connect game', (gameId, username) => {
            console.log(username, 'has connected to game ', gameId)
            this.setState({gameId})
            this.getGame(gameId)
        })   

        this.socket.on('get user', (user) => {
            console.log('user is ', user)
            if(!user) return
            let position = JSON.parse(user.position)
            let face = user.face
            let flag = false
            if(position.length === 0){
                position = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)]
                flag = true
            }
            this.setState({
                rover: {position,face},
                letters: JSON.parse(user.letters)
            })

            if(flag === true){
                this.setUser(this.state.username, {position, face}, user.letters)
            }
        })

        this.socket.on('get game', (game) => {
            this.setState({mapgrid: JSON.parse(game.map)})
            this.otherUsers(JSON.parse(game.users))
        })

        this.socket.on('get rovers', (rovers)=>{
            this.setState({otherRovers: rovers})
        })

        //Mongo User data, NOT redis data
        request(`/user/${this.props.authentication.id}`, 'get')
            .then(response => {
                if(response){
                    this.setState({
                        user: response.data
                    })
                    this.connectGame(response.data.username)
                    this.getUser(response.data.username)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentWillUnmount=()=>{
        this.socket.disconnect()
    }

    handleAction=(event)=>{
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

    handleUndo=()=>{
        if(!this.state.myTurn) return
        this.setState({
            actionsLeft: this.state.actionsLeft === 5 ? 5 : this.state.actionsLeft + 1,
            instructions: this.state.instructions.slice(0, this.state.instructions.length -1)
        })
    }

    logout=()=>{
        this.socket.disconnect()
        window.localStorage.clear()
        this.props.history.push('/login')
    }

    dropLetter=(event)=>{
        let newlet = this.state.letters
        newlet.splice(event.target.id, 1)
        this.setState({
            letters: newlet
        })
    }

    renderRovers=(x, y)=>{
        if(this.state.rover.hasOwnProperty('position')){
            if(this.state.rover.position[0] === x && this.state.rover.position[1] === y){
                return <img className='roverimg' src={require('./imgs/rvrimg.jpg')} alt='' />
            }
            else if(this.state.otherRovers.length > 0){
                for(let pair of this.state.otherRovers){
                    if(pair[1][0] === x && pair[1][1] === y){
                        return <div>{pair[0]}<img className='roverimg' src={require('./imgs/rvrimg.jpg')} alt=''/></div>
                    }
                }
            }
        }
        return
    }

    submitRabble=(event)=>{
        event.preventDefault()
        const word = this.state.letters.join('')
        console.log(word)

        //go to the Wordnik API and score it. If no response, then 0
        // determine winner and update each user's stats
    }

    executeInstructions=(event)=>{
        event.preventDefault()
        if(!this.state.myTurn) return

        let results = operate(this.state.rover.position, this.state.rover.face, this.state.instructions)
        let newRover = {position: results.position, face: results.face}
        if(results.hasOwnProperty('error')){
            this.setState({
                showErrorMessage: true,
                rover: newRover,
                instructions: '',
                myTurn: false,
                actionsLeft: 0
            })
            this.setUser(this.state.user.username, newRover, this.state.letters)
        }
        else {
            let x = results.position[0]
            let y = results.position[1]
            let boxLetter = this.state.mapgrid[x][y]
            if(boxLetter !== ''){
                let newLetters = this.state.letters.concat(boxLetter)
                let newMap = this.state.mapgrid.slice(0)
                newMap[x][y] = ''
                this.setState({
                    rover: newRover,
                    letters: newLetters,
                    mapgrid: newMap,
                    instructions: '',
                    myTurn: false,
                    actionsLeft: 0
                })
                this.setUser(this.state.user.username, newRover, newLetters)
                this.setGame(this.state.gameId, newMap)
            }
            else {
                this.setUser(this.state.user.username, newRover, this.state.letters)
            }
        }

        

        
        //NOW, update state or show error AND update redis for user
    }

    render() {

        return (
            <div className='entrypage'>
                <nav className='nav' id='navhome'>
                    <div className="backButton" onClick={this.logout}>Logout</div>
                    <div className="testsocket" onClick={this.send}>SENDIT</div>
                    <h1 className='title'>Rabble Rover!</h1>
                </nav>
                <div className='container-fluid'>
                    <div className='row gamerw'>
                        <nav className='col-md-2 d-none d-md-block sidebar'>
                            <h6>GameId: </h6>
                            <p>{this.state.gameId}</p>
                            <h6>UserId: </h6>
                            <p>{this.state.user.username}</p>
                            <h6>Position: </h6>
                            <p>{JSON.stringify(this.state.rover.position)}{' '}{this.state.rover.face}</p>
                            <h6>My Best Score: </h6>
                            <p>{this.state.user.highestScore}</p>
                            <h6>My Games Won: </h6>
                            <p>{this.state.user.gamesWon}</p>
                            <h5>This Round:</h5>

                            <Form className='gameActions'onSubmit={this.executeInstructions}>
                                <p className='game'>Actions Left: {this.state.actionsLeft}</p>
                                <p className='game'>Instructions:</p>
                                <p className='instructions'>{this.state.instructions}</p>

                                <Button name='left' id='left' onClick={this.handleAction} disabled={this.state.actionsLeft < 1 ? true : false}>Left</Button>
                                <Button name='right' id='right' onClick={this.handleAction} disabled={this.state.actionsLeft < 1 ? true : false}>Right</Button>
                                <Button name='forward' id='forward' onClick={this.handleAction} disabled={this.state.actionsLeft < 1 ? true : false}>Forward</Button>
                                <div className='undoAction' onClick={this.handleUndo}>undo</div>
                                <Button type='submit'>Execute Instructions!</Button>
                            </Form>
                        </nav>
                        <div className='col-md mapgrid'>
                            {this.state.mapgrid.map((rw, ind) => {
                                return <div className='gridrw' id={'gr' +ind} key={'gr' + ind}>
                                {rw.map((box, idx) => {
                                    return <div className='gridbox' id={'gb' + idx} key={'gb' + idx}>{box}{this.renderRovers(ind,idx)}</div>
                                    })}
                                </div>
                            })}
                            <div className='extras col-md-3'>
                                <img className='compass' src={require('./imgs/compass.png')} alt=''/>
                                <div className={ this.state.myTurn ? 'myturn' : 'notmyturn' }>
                                        {this.state.myTurn ? 'It is your turn!' : 'Waiting for other players'}
                                </div>
                                <div className={ !this.state.showErrorMessage ? 'crash hide-crash' : 'crash' }>
                                        Rover Fell off the grid! No letter collected, redeploying to last good location
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row' id='letters'>
                        <nav className='col-md-2 d-none d-md-block sidebar'></nav>
                         <div className='rwlet'>{this.state.letters.map((letter, ind) => {
                            return <div className='letter' id={ind} key={ind} onClick={this.dropLetter}>{letter.toUpperCase()}</div>
                        })}</div>
                        <Button className='rabble' onClick={this.submitRabble}>Submit Rabble</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home


