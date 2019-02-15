import React, {Component} from 'react'
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

    submitLogin = event => {
        event.preventDefault()
        const {inputUser, inputPassword } = event.target

        request('/auth', 'post', {username: this.state.inputUser, password: this.state.inputPassword})
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

    handleChange = event => {
        this.setState({
            [event.target.name] : event.target.value
          })
    }


    render(){
        return(
            <div className='entrypage'>
                <nav>
                    <h1>Rabble Rover!</h1>
                </nav>
                <div className='container'>
                    <div className='login'>
                        <Form className='login-form'>
                            <h2>Sign Up To Play</h2>
                            <Label>Username</Label>
                            <Input type='text' name='inputUser' placeholder="Enter your username here" required autoFocus /> <br/>
                            <Label>Password</Label>
                            <Input type='password' name='inputPassword' placeholder="************" minLength='8' 
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._^%&*@#]).{8,}" value={this.state.inputPassword} onChange={this.handleChange} required/> <br/>
                            
                            <Label>Verify Password</Label>
                            <Input type='password' name='inputPassword2' placeholder="************" minLength='8' 
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._^%&*@#]).{8,}" value={this.state.inputPassword} onChange={this.handleChange} required/> <br/>
                            {this.state.pw1 !== this.state.pw2
                                ? <span className="passwordWarning">Passwords do not match</span>
                                : ''
                            }
                            <div className={ !this.state.showErrorMessage ? 'login-auth-error login-hide-auth-error' : 'login-auth-error' }>
                            Username Already Exists
                            </div>
                            <Button type='submit'>Submit</Button>
                        </Form>
                    </div>
                </div>
            </div>
        )   
    }
}

export default SignUp