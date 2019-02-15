import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Form, Label, Input, Button} from 'reactstrap'
import request from './utils/request'
import './styles/login.css'

class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
          showErrorMessage: false
        }
      }

    submitLogin = event => {
        event.preventDefault()

        const {inputUser, inputPassword } = event.target
        
        request('/auth', 'post', {username: inputUser.value, password: inputPassword.value})
        .then(response => {
            this.setState({ showErrorMessage: false })
            localStorage.setItem('token', response.data.token)
            return request('/auth')
        })
        .then(response => {
            this.props.setAuthentication(response.data)
            this.props.history.push('/home')
        })
        .catch(error => {
            this.setState({showErrorMessage: true})
        })  
    }

    render(){
        return(
            <div className='entrypage'>
                <nav className='nav'>
                    <h1>Rabble Rover!</h1>
                    {/* <span>Explore Mars, Show Off Your Lexicon, Dominate!</span> */}
                </nav>
                <div className='container'>
                    <div className='login row'>
                        <Form className='login-form' onSubmit={this.submitLogin}>
                            <h2>Login To Play</h2>
                            <Label>Username</Label>
                            <Input type='text' name='inputUser' placeholder="Enter your username here" required autoFocus />
                            <Label>Password</Label>
                            <Input type='password' name='inputPassword' placeholder="************" required/>
                            <div className={ !this.state.showErrorMessage ? 'login-auth-error login-hide-auth-error' : 'login-auth-error' }>
                                Invalid Username or Password
                            </div>
                            <Button className='sub-button' type='submit'>Submit</Button>
                            <p>Haven't Played Before? <Link to='/signup'>Signup!</Link></p>
                        </Form>
                    </div>
                </div>
                <footer className='footer'>
                        <div className='foot-item'>
                            <h4>Our Office Location</h4>
                            <a href='http://mars3dmap.com'><img className='img' src={require('./imgs/Opportunity.png')}/></a>  
                        </div>
                        <div className='foot-item'>
                            <h4>The Game:</h4>
                            <p>Mars is littered with rocks that look suspiciously like English Letters! 
                                Your goal is to command your rover to collect as many of these rocks as possible
                                to try and form a word. At the end of each round the rocks collected will be scored like a Scrabble word. 
                                The rover with the best word will win the round! <br/><br/>

                                Your rover can take up to 5 commands per round, it can change direction or move forward once per command. 
                                You'll have to be clever about your moves in order to get the best letters the fastest. 
                            </p>
                        </div>
                </footer>
            </div>
        )
    }
}

export default Login