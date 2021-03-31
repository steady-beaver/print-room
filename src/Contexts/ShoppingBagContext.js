import React, { useState, createContext, useContext } from 'react'

const ShoppingBagContext = createContext()


export const useShoppingBag = () => {
    return useContext(ShoppingBagContext)
}

export const ShoppingBagProvider = ({ children }) => {

    const [shoppingList, setShoppingList] = useState([])

    // [{
    //     title: "Matrix",
    //     quantity: 4,
    //     price: { ...STANDART_POSTER_PRICE_OBJ },
    //     poster_url: "https://image.tmdb.org/t/p/w92/aLs8CRWr6mXTi7fTUzm5p66NXo7.jpg",
    //     poster_type: "standard_poster"
    // },
    // {
    //     title: "Matrix Revolutions",
    //     quantity: 2,
    //     price: { ...STANDART_POSTER_PRICE_OBJ },
    //     poster_url: "https://image.tmdb.org/t/p/w92/8IpEO76zc1GuHiFVE5aCEL03qJs.jpg",
    //     poster_type: "standard_poster",
    //     uid: number,
    // },]

    // CUSTOM POSTER Example
    // {
    //     "quantity": 1,
    //     "title": "Life in a day (custom)", 
    //     "price": {
    //       "value": 13
    //     },
    //     "price_data": {
    //       "currency": "eur",
    //       "unit_amount": 0.705894
    //     },
    //     "product_id": "prod_J447oq00eOhlMh",
    //     "poster_url": "https://firebasestorage.googleapis.com/v0/b/printroom-11f4a.appspot.com/o/Life%20a%20.jpeg?alt=media&token=a98f9572-66dd-4a74-b7bf-c3c702813353",
    //     "poster_type": "custom_poster"
    //      "uid": number,
    //      "dim": {
    //           w,
    //           h
    //       }
    //   }

    const addItem = (purchaseItem) => {

        // console.log(purchaseItem)

        if (purchaseItem.poster_type === "custom_poster") {
            setShoppingList(currentList => [...currentList, purchaseItem])
        } else if (purchaseItem.poster_type === "standard_poster") {
            const existedMovieItem = shoppingList.find((listItem) => {
                return (listItem.title === purchaseItem.title && listItem.poster_type === purchaseItem.poster_type)
            })
            if (existedMovieItem) {

                existedMovieItem.quantity += purchaseItem.quantity;
                const filteredShoppingList = shoppingList.filter((item) => {
                    return item.title !== purchaseItem.title;
                })
                setShoppingList([...filteredShoppingList, existedMovieItem])
            }
            else {
                setShoppingList(currentList => [...currentList, purchaseItem])
            }
        } else throw new Error("Invalid poster type. Occured during addItem()")

    }

    const removeItem = (movie) => {

        const filteredShoppingList = shoppingList.filter((item => {
            if (item.title !== movie.title) return true;
            else return false;
        }))
        setShoppingList(filteredShoppingList)
    }

    const overallPrice = () => {
        let price = 0;
        shoppingList.forEach(item =>
            price += (item.quantity * item.price.value)
        )
        return price;
    }

    const getQty = (id) => {
        const selectedItem = shoppingList.find(item => {
            return item.uid === id
        })
        if (selectedItem) return selectedItem.quantity
        else return null;
    }

    const updateQty = (id, qty) => {
        let updatedItem = null;
        let filteredList = new Array();

        shoppingList.forEach(item => {
            if (item.uid === id) {
                updatedItem = { ...item, quantity: qty }
            } else {
                filteredList.push(item)
            }
        })

        setShoppingList([...filteredList, updatedItem])
    }

    const validateUniqueName = (name) => {

        let isValid = true;
        shoppingList.forEach(item => {
            if(item.title === name) isValid = false;
        })
        return isValid;
    }




    return (
        <ShoppingBagContext.Provider value={{ shoppingList, addItem, removeItem, overallPrice, getQty, updateQty, validateUniqueName }}>
            { children}
        </ShoppingBagContext.Provider>
    )
}