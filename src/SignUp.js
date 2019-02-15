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
            console.log('2',response)
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
                <nav>
                    <h1>Rabble Rover!</h1>
                </nav>
                <div className='container'>
                    <div className='login'>
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
            </div>
        )   
    }
}

export default SignUp