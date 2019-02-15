import React, {Component} from 'react'
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
            console.log(response.data)
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
                <nav>
                    <h1>Rabble Rover!</h1>
                </nav>
                <div className='container'>
                    <div className='login'>
                        <Form className='login-form'>
                            <h2>Login To Play</h2>
                            <Label>Username</Label>
                            <Input type='text' name='inputUser' placeholder="Enter your username here" required autoFocus /> <br/>
                            <Label>Password</Label>
                            <Input type='password' name='inputPassword' placeholder="************" required/> <br/>
                            <div className={ !this.state.showErrorMessage ? 'login-auth-error login-hide-auth-error' : 'login-auth-error' }>
                                Log In Failed: Invalid Username or Password
                            </div>
                            <Button type='submit'>Submit</Button>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login