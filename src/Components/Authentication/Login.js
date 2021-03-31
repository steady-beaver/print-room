import React, { useRef, useState } from "react";
import { useAuth } from "../../AuthContext";
import { Link, useHistory } from "react-router-dom";
import "./authentication-styles.css";

const Signup = () => {
    
  const emailRef = useRef();
  const passwordRef = useRef();

  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch (e) {
      setError("Failed to log into the account!");
      setLoading(false);
    }
    
    
  };

  return (
    <>
      <h1 className="authentication-styles">Log into your account</h1>
      <form onSubmit={handleSubmit} className="authentication-styles">
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" ref={emailRef} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" ref={passwordRef} />
        {error && <span className="err-msg">{error}</span>}
        <button type="submit" disabled={loading} className="btn primary-blue-btn"> Log in</button>
        <Link to="forgot-password" className="auth-link"><span>Forgot password</span></Link>
      </form>
    </>
  );
};

export default Signup;
