import React, {Component} from 'react'
import {Form,
    FormGroup, Label, Input,
    Button} from 'reactstrap'

class Login extends Component{



    render(){
        return(
            <div className='box'>
                <Form className='form'>
                    <h2>Login To Play</h2>
                    <Label>Username</Label>
                    <Input type='text' name='userName' placeholder="Enter your username here" required autoFocus /> <br/>
                    <Label>Password</Label>
                    <Input type='password' name='password' placeholder="************" required/> <br/>
                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        )
    }
}

export default Login