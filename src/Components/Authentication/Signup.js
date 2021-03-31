import React, { useRef, useState } from "react";
import {  useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "./authentication-styles.css";
import axios from 'axios'


const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const { signup } = useAuth();
  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match!");
    }

    try {
      setError("");
      setLoading(true);
      const newUserCred = await signup(emailRef.current.value, passwordRef.current.value);

      const token = await newUserCred.user.getIdToken()

      // const customerObjStripe = await axios.post("http://localhost:5001/printroom-11f4a/us-central1/backend/create-user", {
      const customerObjStripe = await axios.post("https://us-central1-printroom-11f4a.cloudfunctions.net/backend/create-user", {
        firebaseToken: token
      })
      
      history.push("/");
    } catch (e) {
      console.log(e)
      setError("Failed to create account!");
      setLoading(false);
    }
    
  };

  return (
    <>
      <h1 className="authentication-styles">Create your profile</h1>
      <form onSubmit={handleSubmit} className="authentication-styles">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" ref={emailRef}/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" ref={passwordRef}/>
        <label htmlFor="repeat-password">Repeat password</label>
        <input type="password" name="repeat-password" id="repeat-password" ref={passwordConfirmRef}/>
        {error && <span className="err-msg">{error}</span>}
        <button type="submit" disabled={loading} className="btn primary-blue-btn">
          Submit
        </button>
      </form>
    </>
  );
};

export default Signup;
