import React from 'react'
import './purchase-item.css'
import { useShoppingBag } from '../../../Contexts/ShoppingBagContext'

const PurchaseItem = ({ movie, setQtyAdjustPosterUid }) => {

    const { removeItem } = useShoppingBag();

    return (
        <div className="purchase-item outline" >
            <div className="image-container">

                <img height='100' src={movie.poster_url} alt="#" />
            </div>
            <div className="item-details">
                <div className="movie-title">
                    {movie.title}
                </div>
                <div className="movie-qty" onClick={()=>setQtyAdjustPosterUid(movie.uid)} > 
                    {movie.quantity + " posters"} 
                </div>
                <div>{movie.quantity * movie.price.value} €</div>
                <div>
                    <img className="bucket-icon" onClick={() => removeItem(movie)} src="./assets/bucket-icon.svg" alt="Bucket icon" />
                </div>
            </div>
        </div>
    )
}

export default PurchaseItem
