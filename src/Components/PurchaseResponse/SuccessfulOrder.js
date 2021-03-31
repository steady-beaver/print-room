import React, { useEffect } from 'react'
import './purchase-response.css'
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext'
import axios from 'axios'

const SuccessfulOrder = () => {

    const location = useLocation()

    const { currentUser } = useAuth();
    

    useEffect(async () => {
        const urlParams = new URLSearchParams(location.search)
        const sessionID = urlParams.get("id")
        console.log(sessionID)

        if (sessionID) {

            try {

                const token = await currentUser.getIdToken()

                // const response = await axios.post(`http://localhost:5001/printroom-11f4a/us-central1/backend/successful-order`, {
                const response = await axios.post(`https://us-central1-printroom-11f4a.cloudfunctions.net/backend/successful-order`, {
                    sessionID,
                    firebaseUserToken: token
                })

                console.log(response.data)

            } catch (err) {
                console.log(err)
            }
        }

  
    }, [location])

    return (
        <div className="purchase-response-message">
            <h1>Congratulations! </h1>
            <h4>You'll recieve posters in 3 working days.</h4>
        </div>
    )
}

export default SuccessfulOrder
