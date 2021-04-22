import React, { useEffect } from 'react'
import './purchase-response.css'
import { useLocation } from 'react-router-dom';
import axios from 'axios'

const FailedOrder = () => {
    const location = useLocation()


    useEffect(

        () => {

            const updateOrderCollectionOnFailure = async () => {
                const urlParams = new URLSearchParams(location.search)
                const sessionID = urlParams.get("id")
                console.log(sessionID)

                if (sessionID) {

                    try {

                        // const response = await axios.post(`http://localhost:5001/printroom-11f4a/us-central1/backend/failed-order`, {
                        const response = await axios.post("https://us-central1-printroom-11f4a.cloudfunctions.net/backend/failed-order", {
                            sessionID,
                        })
                        console.log(response.data)

                    } catch (err) {
                        console.log(err)
                    }
                }
            }

            updateOrderCollectionOnFailure();

        }, [location])

    // useEffect(async () => {
    //     const urlParams = new URLSearchParams(location.search)
    //     const sessionID = urlParams.get("id")
    //     console.log(sessionID)

    //     if (sessionID) {

    //         try {

    //             // const response = await axios.post(`http://localhost:5001/printroom-11f4a/us-central1/backend/failed-order`, {
    //             const response = await axios.post(`https://us-central1-printroom-11f4a.cloudfunctions.net/backend/failed-order`, {
    //                 sessionID,
    //             })
    //             console.log(response.data)

    //         } catch (err) {
    //             console.log(err)
    //         }
    //     }
    // }, [location])

    return (
        <div className="purchase-response-message">
            <h1>Transaction failed.</h1>
            <h4>You are not charged.</h4>
        </div>
    )
}

export default FailedOrder
