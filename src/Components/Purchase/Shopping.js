import React, { useState } from 'react'
import './shopping.css'
import PurchaseItem from './PurchaseItem/PurchaseItem'
import { useShoppingBag } from '../../Contexts/ShoppingBagContext'
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js';
import QuantityAdjustModal from './QuantityAdjustModal/QuantityAdjustModal'
import { useAuth } from "../../AuthContext";




const stripePromise = loadStripe("pk_test_51ICFc8AO6d164rgu1TQu7UBQSH1D3Pw9p8e0rOfTdlS2I0oxmVjsR6edYT5Dz8hBezS0JOb1ZgjZjrgVCoOl5QF700X9AFJyRV")


const Shopping = () => {

    const { shoppingList, overallPrice } = useShoppingBag();
    const [loading, setLoading] = useState(false)
    const [qtyAdjustPosterUid, setQtyAdjustPosterUid] = useState(null)
    const [error, setError] = useState("")

    const { currentUser } = useAuth();


    const handleOrderNow = async () => {

        console.log(JSON.stringify(shoppingList, null, 2))
        setError("")
        setLoading(true)

        const fbToken = await currentUser.getIdToken()

        try {

            const stripe = await stripePromise;


            // const session = await axios.post("http://localhost:5001/printroom-11f4a/us-central1/backend/create-checkout-session", {
            const session = await axios.post("https://us-central1-printroom-11f4a.cloudfunctions.net/backend/create-checkout-session", {
                shoppingListArr: shoppingList,
                fbToken
            })

            console.log(session)

            const redirectResult = await stripe.redirectToCheckout({ sessionId: session.data.id });
            // console.log(JSON.stringify(redirectResult, null, 2))  

            if (redirectResult.error) { alert(redirectResult.error.message) }

        } catch (err) {
            setError(err.message)
            console.error(err)
            setLoading(false)
        }

    }


    <div className="empty-bag" > Shopping bag is empty </div>

    return (
        <>
            <div className="shopping-page text-area">
                <h1>Current order</h1>
                <h4>Bring life to the movies</h4>
            </div>

            <div className="shopping-page dynamic-area">
                <div className="items-container">
                    {shoppingList.length

                        ? (<SimpleBar autoHide={false} >
                            <ul>
                                {shoppingList.map(m => <li key={m.uid} ><PurchaseItem movie={m} setQtyAdjustPosterUid={setQtyAdjustPosterUid} /></li>)}
                            </ul>
                        </SimpleBar>)

                        : (<div className="empty-bag" > Shopping bag is empty. </div>)
                    }
                </div>
                <div className="closing-deal">
                    <div className="overall-price"> Overall: {overallPrice()} € </div>
                    <button className="btn primary-red-btn" onClick={handleOrderNow} disabled={!shoppingList.length || loading}> Order now </button>
                    {error && <p>{error}</p>}
                </div>
            </div>
            {qtyAdjustPosterUid && <QuantityAdjustModal posterUid={qtyAdjustPosterUid} closeModal={() => setQtyAdjustPosterUid(null)} />}
        </>
    )
}

export default Shopping
