import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useShoppingBag } from '../../Contexts/ShoppingBagContext'
import useStorage from '../../Hooks/useStorage'
import './upload.css'
import shortid from 'shortid';

const Upload = () => {

    const [file, setFile] = useState(null)
    const [posterProportion, setPosterProportion] = useState({ w: 0, h: 0 })
    const [localPosterUrl, setLocalPosterUrl] = useState(null)
    const [orderName, setOrderName] = useState("")
    const [orderQty, setOrderQty] = useState(1)
    const [orderWidth, setOrderWidth] = useState("")
    const [orderHeight, setOrderHeight] = useState("")
    const [successfulAdded, setSuccessfulAdded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [priceVal, setPriceVal] = useState(0)

    const { addItem, validateUniqueName } = useShoppingBag()

    const { firebaseUpload } = useStorage()

    const formRef = useRef(null)
    const inputNameRef = useRef(null)
    const inputQtyRef = useRef(null)

    const inputWidthRef = useRef(null)
    const inputHeightRef = useRef(null)

    // const pattern = {
    //     dimension: new RegExp(/^\d{3,4}$/),
    //     name: new RegExp(/^(\w| ){5,40}$/),
    //     qty: new RegExp(/^[1-9][0-9]?$/),
    // }

    const patternMemorized = useMemo(()=>{
        return {
            dimension: new RegExp(/^\d{3,4}$/),
            name: new RegExp(/^(\w| ){5,40}$/),
            qty: new RegExp(/^[1-9][0-9]?$/),
        }
    }, [])


    const fileChangeHandler = (e) => {
        const uploadedPoster = e.target.files[0];
        const allowedPosterFormats = ['image/png', 'image/jpeg', 'image/jpg']

        setError("")
        setOrderName("")
        setOrderQty(1)
        setLocalPosterUrl(null)
        setSuccessfulAdded(false)
        setPosterProportion({ w: 0, h: 0 })

        try {
            if (!uploadedPoster)
                throw new ReferenceError("No picked file.")
            if (!allowedPosterFormats.includes(uploadedPoster.type))
                throw new ReferenceError("Allowed formats are jpeg, jpg, png.")
            //  uploadedPoster.size -> in bytes
            if (uploadedPoster.size < 10000 || uploadedPoster.size > 1500000)
                throw new ReferenceError("File size must be at between 0.01MB - 1.5MB (testing)")

            console.log("Img size: ", uploadedPoster.size)
            setFile(uploadedPoster)

        } catch (err) {
            setFile(null)
            setError(err.message)
        }
    }


    


    const handlePosterLoad = (e) => {
        const naturalWidthPx = e.target.naturalWidth;
        const naturalHeightPx = e.target.naturalHeight;
        setPosterProportion({ w: naturalWidthPx, h: naturalHeightPx })
    }


    const handleOrderDimChangeCbk = useCallback(

        (w, h) => {

            if (typeof w === "undefined") {
                setOrderHeight(h)

                if (patternMemorized["dimension"].test(h)) {
                    const widthDim = Math.round(Number(h) * posterProportion.w / posterProportion.h)
                    setOrderWidth(widthDim.toString())
                } else {
                    setOrderWidth("")
                }
            }

            if (typeof h === "undefined") {
                setOrderWidth(w)

                if (patternMemorized["dimension"].test(w)) {
                    const heightDim = Math.round(Number(w) * posterProportion.h / posterProportion.w)
                    setOrderHeight(heightDim.toString())
                } else {
                    setOrderHeight("")
                }
            }
        }
        , [patternMemorized, posterProportion]
    )


    


    const validateInputElRefWithRegEx = (elRef, regexPattern) => {
        if (!elRef.current) return false;

        if (elRef.current.value === "") {
            elRef.current.className = elRef.current.className.replace(" invalid", "")
            return false;
        };

        if (regexPattern.test(elRef.current.value.toString())) {
            if (elRef.current.className.includes("invalid")) {
                elRef.current.className = elRef.current.className.replace(" invalid", "")
            }
            return true;
        } else {
            if (!elRef.current.className.includes("invalid")) {
                elRef.current.className += " invalid"
            }
            return false;
        }
    }

   


    const calculateSinglePriceCbk = useCallback(
        () => {
            const areaSqM = orderWidth * orderHeight / 1000000
            const price = Math.round(12 + ((areaSqM - 0.5) / 0.1) * process.env.REACT_APP_CUSTOM_PRICE_SQUARE_METER)
            return price;
        }, [orderHeight, orderWidth]
    )


    const handleNameChange = (e) => {
        setOrderName(e.target.value)
        validateInputElRefWithRegEx(inputNameRef, patternMemorized["name"])
    }

    const handleQtyChange = (e) => {
        setOrderQty(e.target.value)
        validateInputElRefWithRegEx(inputQtyRef, patternMemorized["qty"])
    }


    const handleAddCustomPosterBtn = async () => {

        setLoading(true)

        let fileNameWithPostfix = orderName + ` (${orderWidth}x${orderHeight})`;
        let posterFirebaseUrl = null;


        // if valid --> true
        const uniqueNameCheck = validateUniqueName(fileNameWithPostfix)
        const nameCheck = validateInputElRefWithRegEx(inputNameRef, patternMemorized["name"])

        try {
            //Upload custom poster form has 4 fields (name, width, height, qty)
            // uniqueNameCheck <-- is name unique, comparison in the shoppingList
            // nameCheck <-- name
            // priceVal <-- width, height, qty

            if (!(uniqueNameCheck)) throw new Error("There is already custom poster with such name");
            if (!(nameCheck && priceVal)) throw new Error("Upload poster attributes are not valid");
            posterFirebaseUrl = await firebaseUpload(file, fileNameWithPostfix)
            setError("")
        } catch (err) {
            console.error(err)
            setError(err.message)
            setLoading(false)
            return;
        }

        const purchaseCustomItem = {
            quantity: orderQty,
            title: fileNameWithPostfix,
            price: { value: calculateSinglePriceCbk() },    //to be price_val: calculateSinglePriceCbk()
            product_id: process.env.REACT_APP_CUSTOM_PRODUCT_ID,
            poster_url: posterFirebaseUrl,
            poster_type: 'custom_poster',
            dim: {
                w: orderWidth,
                h: orderHeight
            },
            uid: shortid.generate()
            // We need uid for front-end purpose
        }

        addItem(purchaseCustomItem)
        setSuccessfulAdded(true)
        setLoading(false)
    }

    //  START -------- useEffects ---------- START

    useEffect(() => {
        let localImgSrc;

        if (file) {
            localImgSrc = URL.createObjectURL(file)
            setLocalPosterUrl(localImgSrc)
        }

        return () =>  URL.revokeObjectURL(localImgSrc) 

    }, [file])

    // form fields validation
    useEffect(() => {
        const qtyCheck = validateInputElRefWithRegEx(inputQtyRef, patternMemorized["qty"])
        const widthCheck = validateInputElRefWithRegEx(inputWidthRef, patternMemorized["dimension"])
        const heightCheck = validateInputElRefWithRegEx(inputHeightRef, patternMemorized["dimension"])

        if (qtyCheck && widthCheck && heightCheck) setPriceVal(calculateSinglePriceCbk() * orderQty)
        else setPriceVal("")

    }, [orderWidth, orderHeight, orderQty, patternMemorized, calculateSinglePriceCbk])


    useEffect(() => {
        if (!posterProportion.w) return;
        handleOrderDimChangeCbk("686", undefined)

    }, [posterProportion, handleOrderDimChangeCbk])


    //  END -------- useEffects ---------- END


    return (
        <>
            <div className="upload-styles text-area">
                <h1>Upload your design</h1>
                <h4>Make it come alive</h4>
            </div>

            <div className="upload-styles dynamic-area ">
                <form className={file ? "chosenFile" : "noFile"} onSubmit={(e) => e.preventDefault()} ref={formRef} autoComplete="off">
                    <label htmlFor="file-input">
                        <span>File</span>
                        <span className="btn secondary-blue-btn poster-file-name">{file && file.name}</span>
                        <input type="file" name="file-input" id="file-input" onChange={fileChangeHandler}  />
                    </label>

                    {error && <p className="error-msg">{error}</p>}

                    {localPosterUrl &&
                        <>
                            <div className="poster-preview">
                                <img src={localPosterUrl} onLoad={handlePosterLoad} />
                            </div>

                            {successfulAdded

                                ? <span className="btn primary-blue-btn successfully-added">Added</span>

                                : <>

                                    <div className="row-flex-panel">
                                        <label htmlFor="custom-name">Name </label>
                                        <input type="text" id="custom-name" className="secondary-red-btn" ref={inputNameRef} value={orderName} onChange={handleNameChange} />
                                        <label htmlFor="custom-qty">Qty </label>
                                        <input type="text" id="custom-qty" className="secondary-red-btn" ref={inputQtyRef} value={orderQty} onChange={handleQtyChange} />
                                    </div>

                                    <div className="row-flex-panel">
                                        <label htmlFor="custom-poster-width">Width </label>
                                        <input type="text" className="secondary-red-btn" ref={inputWidthRef} maxLength="8" value={orderWidth} onChange={e => handleOrderDimChangeCbk(e.target.value, undefined)} name="custom-poster-width" id="custom-poster-width" />

                                        <label htmlFor="custom-poster-height">Height </label>
                                        <input type="text" className="secondary-red-btn" ref={inputHeightRef} maxLength="8" value={orderHeight} onChange={e => handleOrderDimChangeCbk(undefined, e.target.value)} name="custom-poster-height" id="custom-poster-height" />
                                        <div className="info-container">
                                            <img src="./assets/info-icon.png" alt="" />
                                            <div className="info-content">
                                                <div>
                                                    {/* file size is for testing purpose */}
                                                    <p>Uploaded file must be between 0.1 - 1.5 MB (testing). Available formats are jpeg, jpg, png.</p>
                                                    <p>Standard movie poster size is 686×1016 mm (27×40 inches)
                                                    Please enter either width or height to make purchase.
                                                    Other dimension will be taken by the uploaded picture ratio. </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row-flex-panel">
                                        <span className="price">
                                            <span> Price: </span>
                                            {priceVal && <span >{priceVal}&euro; </span>}
                                        </span>
                                        <button className="btn primary-red-btn" onClick={handleAddCustomPosterBtn} disabled={loading}>Add</button>
                                    </div>

                                </>
                            }
                        </>
                    }
                </form>
            </div>
        </>
    )
}

export default Upload
