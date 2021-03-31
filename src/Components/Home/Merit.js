import React from 'react'

const Merit = ({ img_url, heading, text, classes }) => {
    return (
        <div className={"merit " + classes}>
            <div className="img-frame">
                <img src={img_url} alt="" />
            </div>
            <div className="message">
                <h1>{heading}</h1>
                <h4>{text}</h4>
            </div>
        </div>
    )
}

export default Merit
