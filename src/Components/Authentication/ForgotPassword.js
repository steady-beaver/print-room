import React, {useRef, useState} from 'react'
import {useAuth} from '../../Contexts/AuthContext'


const ForgotPassword = () => {

    const emailRef = useRef()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const { resetPassword } = useAuth()


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            setMessage("")
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage("Check your email.")
        }
        catch (e) {
            console.log("Login component catching error")
            setError("Failed to reset password!")
        }
        setLoading(false)

    }

    return (
        <>
          <h1 className="authentication-styles">Forgot password</h1>
          <form onSubmit={handleSubmit} className="authentication-styles">
            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" ref={emailRef} />
            {error && <span className="err-msg">{error}</span>}
            {message && <span className="success-msg">{message}</span>}
            
            <button type="submit" disabled={loading} className="btn primary-blue-btn"> Reset password </button>

          </form>
        </>
      )
}

export default ForgotPassword
