import React, { useState } from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import './selected-movie-view.css'
import { useShoppingBag } from '../../Contexts/ShoppingBagContext'
import axios from 'axios'
import useStorage from '../../Hooks/useStorage'
import shortid from 'shortid';
import { formatTrimDots } from '../../UtilityFunctions/UtilityFunctions'


const SelectedMovieView = ({ selectedMovie, handleBackBtn }) => {


    const [quantity, setQuantity] = useState(1)
    const [isPosterLoading, setIsPosterLoading] = useState(true)
    const [successfullyAdded, setSuccessfullyAdded] = useState(false)
    const [waitingResponse, setWaitingResponse] = useState(false)
    const [error, setError] = useState("")

    const { addItem } = useShoppingBag()
    const { firebaseUpload } = useStorage()

    const validateQuantityInput = () => {

        let quantityInt = Math.floor(quantity)

        if (0 < quantityInt && quantityInt < 100)
            setQuantity(quantityInt);
        else setQuantity(1)
    }

    const handleAddPoster = async (quantity, selectedMovie) => {

        // console.log(selectedMovie)
        setWaitingResponse(true)
        setError("")
        let fileName = null;
        let firebasePosterUrl = null;

        try {
            const res = await axios.get(`https://image.tmdb.org/t/p/w780/${selectedMovie.poster_path}`, {
                responseType: 'blob'
            })

            const imageBlobFile = res.data;

            fileName = formatTrimDots(selectedMovie.title)
            firebasePosterUrl = await firebaseUpload(imageBlobFile, fileName)

        } catch (err) {
            console.log(err)
            setError(err.message)
            setWaitingResponse(false)
            return;
        }




        const purchaseStandardItem = {
            quantity: quantity,
            title: fileName,
            price: {
                id: process.env.REACT_APP_STANDART_PRICE_ID,
                value: process.env.REACT_APP_STANDART_PRICE_VALUE,
            },
            poster_url: firebasePosterUrl,
            poster_type: 'standard_poster',
            uid: shortid.generate()
            // We need uid for front-end purpose
        }

        addItem(purchaseStandardItem)
        setSuccessfullyAdded(true)
    }



    return (
        <div className="selectedMovieView">

            <div className="panel">

                <div className="details">
                    <img width="30" className="back-icon" src="./assets/back-icon.png" alt="" onClick={handleBackBtn} />
                    <h4>{selectedMovie.title} </h4>
                </div>


                <div className="poster-container">
                    <ClipLoader color="#154c9f" loading={isPosterLoading} size={50} />
                    <img onLoad={() => setIsPosterLoading(false)} src={`https://image.tmdb.org/t/p/w342/${selectedMovie.poster_path}`} alt={`Print Room poster of ${selectedMovie.title}`} />
                </div>

                <div className="add-to-purchaise">
                    {successfullyAdded
                        ? <span className="btn primary-blue-btn"> Added </span>
                        : <>
                            <div>
                                <input type="text" className="quantity-input" maxLength="2" onBlur={validateQuantityInput} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                <span> posters per 10€</span>
                            </div>
                            <button onClick={() => handleAddPoster(quantity, selectedMovie)} className={"btn primary-red-btn"} disabled={waitingResponse} >Add</button>
                            {error && <div>{error}</div>}
                        </>
                    }
                </div>

            </div>

        </div>
    )
}

export default SelectedMovieView
