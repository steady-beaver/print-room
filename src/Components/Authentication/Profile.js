import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "./authentication-styles.css";
import { useAuth } from '../../AuthContext'

const Profile = () => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const { currentUser, updateEmail, updatePassword } = useAuth();
    const history = useHistory();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match!");
        }

        const promises = [];
        setError("");
        setLoading(true);

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then(() => {
            history.push("/")
        }).catch(() => {
            setError("Failed to update account")
        }).finally(() => {
            setLoading(false)
        })
    };

    return (
        <>
            <h1 className="authentication-styles">Update your profile</h1>
            <form onSubmit={handleSubmit} className="authentication-styles">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" ref={emailRef} defaultValue={currentUser.email} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" ref={passwordRef} placeholder="Leave blank to keep the same" />
                <label htmlFor="repeat-password">Repeat password</label>
                <input type="password" name="repeat-password" id="repeat-password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" />
                {error && <span className="err-msg">{error}</span>}
                <button type="submit" disabled={loading} className="btn primary-blue-btn">
                    Submit
                </button>
            </form>
        </>
    )
}

export default Profile
