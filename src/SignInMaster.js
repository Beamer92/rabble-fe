import React, {Component} from 'react'
import request from './utils/request'
import {Button} from 'reactstrap'
import Login from './Login'

class SignInMaster extends Component{
    constructor(props){
        super(props)
        this.state = {
            showErrorMessage: false,
            logSign: false
        }
    }


    render(){
        return(
            <div className='login'>
                <nav>
                    <h1>Rabble Rover!</h1>
                </nav>
                <div className='container'>
                    {(this.state.logSign === false) ? <Login /> : <Login/>}
                </div>
            </div>
        )
    }


}

export default SignInMaster