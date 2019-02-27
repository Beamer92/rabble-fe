import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Form, Label, Input, Button} from 'reactstrap'
import request from './utils/request'
import './styles/login.css'

class SignUp extends Component{
    constructor(props){
        super(props)
        this.state = {
          showErrorMessage: false,
          inputUser: '',
          inputPassword: '',
          inputPassword2: ''
        }
      }

    submitSignup = event => {
        event.preventDefault()

        request('/user', 'post', {username: this.state.inputUser, password: this.state.inputPassword})
        .then(response => {
            return request('/auth', 'post', {username: this.state.inputUser, password: this.state.inputPassword})
        })
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
            console.log(error)
            this.setState({showErrorMessage: true})
        })  
    }

    handleChange = event => {
        this.setState({
            [event.target.name] : event.target.value
          })
    }


    render(){
        return(
            <div className='entrypage'>
                 <nav className='nav'>
                    <h1 className='title'>Rabble Rover!</h1>
                </nav>
                <div className='container'>
                    <div className='login row'>
                        <Form className='login-form' onSubmit={this.submitSignup}>
                            <h2>Sign Up To Play</h2>
                            <Label>Username</Label>
                            <Input type='text' name='inputUser' placeholder="Enter your username here" value ={this.state.inputUser} onChange={this.handleChange}required autoFocus />
                            <Label>Password</Label>
                            <Input type='password' name='inputPassword' placeholder="************" minLength='8' 
                            pattern="(?=.*\d)(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._$^%&*@#]).{8,}" value={this.state.inputPassword} onChange={this.handleChange} required/>
                            <Label>Verify Password</Label>
                            <Input type='password' name='inputPassword2' placeholder="************" minLength='8' 
                            pattern="(?=.*\d)(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._$^%&*@#]).{8,}" value={this.state.inputPassword2} onChange={this.handleChange} required/>
                            {this.state.pw1 !== this.state.pw2
                                ? <span className="passwordWarning">Passwords do not match</span>
                                : ''
                            }
                            <div className={ !this.state.showErrorMessage ? 'login-auth-error login-hide-auth-error' : 'login-auth-error' }>
                            Username Already Exists
                            </div>
                            <Button className='sub-button' type='submit'>Submit</Button>
                            <p>Have a Login Already? <Link to='/login'>Login!</Link></p>
                        </Form>
                    </div>
                </div>
                <footer className='footer'>
                        <div className='foot-item'>
                            <h4>Our Office Location</h4>
                            <a href='https://www.google.com/mars/#lat=5.272769&lon=-21.570039&zoom=4&map=visible&q=spacecraft'><img className='img' alt='' src={require('./imgs/Opportunity.png')}/></a>  
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
                <div className='credits'>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" 
      title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"
      title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            </div>
        )   
    }
}

export default SignUp