import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import AuthenticatedRoute from './AuthenticatedRoute'
import Home from './Home'
import request from './utils/request'
import SignUp from './SignUp'
import Login from './Login'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      authentication: {
        pendering: true,
        user: null
      }
    }
  }

  setAuthentication = claim => {
    this.setState({
      authentication : {
        pending: false,
        user: claim
      }
    })
  }

  componentDidMount(){
    request('/auth')
    .then(response => this.setAuthentication(response.data))
    .catch(err => this.setAuthentication(null))
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <AuthenticatedRoute path='/home' authentication={this.state.authentication} render={(props) => <Home {...props}/>}/>
        	<Route path='/login' render={(props) => <Login {...props} setAuthentication={this.setAuthentication} />} />
          <Route path='/signup' render={(props) => <SignUp {...props} setAuthentication={this.setAuthentication} />} />
          <Route path='/' render={(props) => <Login {...props} setAuthentication={this.setAuthentication} />} />
        </Switch>
    </BrowserRouter>
    );
  }
}

export default App;
