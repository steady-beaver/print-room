import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuth } from './AuthContext'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const {currentUser} = useAuth()

    return (
        <Route {...rest}
            render={props => {
                return currentUser ? <Component {...props} /> : <Redirect to="/landing-page" />
            }}
        >
        
        </Route>
    )
}

export default PrivateRoute