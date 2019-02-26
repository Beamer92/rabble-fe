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
            actionsLeft: 0,
            mapgrid: [],
            otherRovers: [],
            showErrorMessage: false,
            myTurn: false,
            winners: ''
        }
    }

    connectGame=(username)=>{
        this.socket.emit('connect game', username)
    }

    getGame=(gameId=this.state.gameId)=>{
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

    nextTurn= (gameId) => {
        this.socket.emit('next turn', gameId)    
    }

    otherUsers=(userList)=>{
        if(this.state.user.hasOwnProperty('username')){
            let skip = userList.findIndex(u => u.name === this.state.user.username)
            userList.splice(skip, 1)
            let gRoverList = userList.map(u => u.name)
            this.socket.emit('get rovers', gRoverList)
        }
    }

    getDBuser=async(id, winners)=>{
        console.log('winners', winners)
        let winUser = winners.findIndex(u => u.name === this.state.user.username)
        if(winUser !== -1){
            let update = {gamesWon: (this.state.user.gamesWon + 1)}
            console.log(update)
            let updated = await request(`/user/${id}`, 'put', update)
        }
        let reGet = await request(`/user/${id}`, 'get')
        if(reGet){
            this.setState({
                user: reGet.data
            })
        }
    }

    componentDidMount(){
        //Mongo User data, NOT redis data
        request(`/user/${this.props.authentication.id}`, 'get')
            .then(response => {
                if(response){
                    this.setState({
                        user: response.data
                    })
                    this.connectGame(response.data.username)
                }
            })
            .catch(err => {
                console.log(err)
            })

        this.socket.on('connect game', (gameId, username) => {
            console.log(username, 'has connected to game ', gameId)
            this.setState({gameId:gameId, winners: ''})
            this.getGame(gameId)
            if(this.state.user.hasOwnProperty('username') && this.state.user.username === username){
                this.getUser(username)
            }
        })   

        this.socket.on('get user', (user) => {
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
                this.setUser(this.state.user.username, {position, face}, [])
            }
        })

        this.socket.on('get game', (game) => {
            if(game.turn !== '' && game.turn === this.state.user.username){
                this.setState({ mapgrid: JSON.parse(game.map),
                                myTurn: true,
                                actionsLeft: 5})

                //start timer function for turn
            }
            else {
                this.setState({mapgrid: JSON.parse(game.map)})
            } 
            this.otherUsers(JSON.parse(game.users))
        })

        this.socket.on('get rovers', (rovers)=>{
            this.setState({otherRovers: rovers})
        })

        this.socket.on('update users', () =>{
            this.getGame()
        })

        this.socket.on('score word', (score)=> {
            this.setState({
                user: {...this.state.user, score: score},
                instructions: '',
                myTurn: false,
                actionsLeft: 0
            })   
            this.nextTurn(this.state.gameId)     
        })

        this.socket.on('winners', (gameObj) => {
            let winners = JSON.parse(gameObj.winners)
            let wstring = 'placeholder'
            if(winners.length > 1){
                let score = winners[0].score
                let users = winners.map((u, ind) => {
                    if(ind === (winners.length-1)){
                        return `and ${u.name} `
                    }
                    else if(ind === (winners.length - 2)){
                        return `${u.name} `
                    }
                    return `${u.name}, ` 
                })
                wstring = `There was a Tie between ${users.join('')} with a score of ${score}!`
            }
            else {
                wstring = `The winner is ${winners[0].name} with a score of ${winners[0].score}!`
            }
            this.setState({
                myTurn: false,
                actionsLeft: 0,
                instructions: '',
                winners: wstring
            })
            this.getDBuser(this.props.authentication.id, winners)
        })
    }

    componentWillUnmount=()=>{
        this.socket.emit('logout', this.state.gameId, this.state.user.username)
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
        this.socket.emit('logout', this.state.gameId, this.state.user.username)
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
        this.socket.emit('score word', this.state.gameId, this.state.user.username, this.state.letters)
    }

    executeInstructions=(event)=>{
        event.preventDefault()
		// let newGameId = await Promise.all(users)
		// for(let u = 0; u < endGame.users.length -1; i++){
		// 	io.sockets.emit('connect game', newGameId, endGame.users[u].name)
		// }
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
            this.nextTurn(this.state.gameId)
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
                this.nextTurn(this.state.gameId)
                this.setUser(this.state.user.username, newRover, newLetters)
                this.setGame(this.state.gameId, newMap)
                
            }
            else {
                this.setState({
                    rover: newRover,
                    instructions: '',
                    myTurn: false,
                    actionsLeft: 0
                })
                this.nextTurn(this.state.gameId)
                this.setUser(this.state.user.username, newRover, this.state.letters)
            }
        }
    }

    handleNewGame = () => {
        this.socket.emit('newGame', this.state.gameId)
    }

    render() {

        return (
            <div className='entrypage'>
                <nav className='nav' id='navhome'>
                    <div className="backButton" onClick={this.logout}>Logout</div>
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
                            <p className='roverPos'>{JSON.stringify(this.state.rover.position)}{' '}{this.state.rover.face}</p>
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
                                <Button type='submit' disabled={!this.state.myTurn ? true : false}>Execute Instructions!</Button>
                            </Form>
                        </nav>
                        <div className='col-md mapgrid'>
                            {
                                this.state.winners === '' ?
                                this.state.mapgrid.map((rw, ind) => {
                                    return <div className='gridrw' id={'gr' +ind} key={'gr' + ind}>
                                    {rw.map((box, idx) => {
                                        return <div className='gridbox' id={'gb' + idx} key={'gb' + idx}>{box}{this.renderRovers(ind,idx)}</div>
                                        })}
                                    </div>
                                }) : 
                                <div className='winner'>
                                    <img id='winPic' src={require('./imgs/winPic.jpg')} alt=''/>
                                    <p id='winPara'>{this.state.winners}</p>
                                    <Button onClick={this.handleNewGame}>Play Again</Button>
                                </div> 
                            }
                            <div className='extras col-md-3'>
                                <img className='compass' src={require('./imgs/compass.png')} alt=''/>
                                <div className={ this.state.user.score ? 'showScore' : 'noScore' }>
                                        {this.state.user.score ? `You Scored ${this.state.user.score}!` : ''}
                                </div>
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
                        <Button className='rabble' onClick={this.submitRabble} disabled={!this.state.myTurn ? true : false}>Submit Rabble</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home


