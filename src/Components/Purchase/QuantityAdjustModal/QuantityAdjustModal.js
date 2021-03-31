import React, { useState, useEffect } from 'react'
import { useShoppingBag } from '../../../Contexts/ShoppingBagContext'
import './quantity-adjust-modal.css'


const QuantityAdjustModal = ({ posterUid, closeModal }) => {

    const [qty, setQty] = useState(1)
    const { getQty, updateQty } = useShoppingBag()

    useEffect(() => {
        setQty(getQty(posterUid))
    }, [])

   

    const handleModalClick = (e) => {
        if (e.target.classList.contains('backdrop')) {
            closeModal();
        }
    }

    const handleUpdateBtn = (posterUid, qty) => {
        updateQty(posterUid, qty)
        closeModal()
    }
    

    return (
        <div className="backdrop" onClick={handleModalClick}>
            <div className="qty-panel">
                <div className="row">
                    <button className="btn secondary-red-btn" onClick={()=>setQty(q => q+1)} disabled={qty >= 99}>+</button>
                    <span className="btn secondary-red-btn"> {qty} </span>
                    <button className="btn secondary-red-btn" onClick={()=>setQty(q => q-1)} disabled={qty <= 1}>-</button>
                </div>
                
                <button className="btn primary-red-btn" onClick={()=>handleUpdateBtn(posterUid, qty)}>Update</button>
                
            </div>
        </div>
    )
}

export default QuantityAdjustModal
