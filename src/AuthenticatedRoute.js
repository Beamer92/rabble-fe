import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

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
    return <Route path={path} component={component} /> 
  }
  else {
    return <Redirect to='/' />
  }
}

export default AuthenticatedRoute