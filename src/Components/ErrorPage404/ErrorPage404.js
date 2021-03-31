import React from 'react'

const ErrorPage404 = () => {

    const style = {
        gridColumn: '1 / -1',
        gridRow: '4 / 6'
    }

    return (
        <div className="404-error-message" style={style}>
            <h1>Page not found</h1>
            <h4>Not such resource</h4>
        </div>
    )
}

export default ErrorPage404
