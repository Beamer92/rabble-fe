import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Home from './Home'

const AuthenticatedRoute = props => {
  const {
    authentication: {
      pending,
      user
    },
    path,
    component } = props

  if(pending && !user){
    return <div>Loading...</div>
  }
  else if(user) {
    return <Route path='/home' render={(props) => <Home {...props} authentication={user}/>} />
  }
  else {
    return <Redirect to='/login' />
  }
}

export default AuthenticatedRoute