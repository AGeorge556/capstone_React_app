import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { API_URL } from '../../config';

// Function component for Login form
const Login = () => {
    // State variables using useState hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState(''); // State to show error messages
    
    const navigate = useNavigate(); // Navigation hook from react-router
    
    // Function to validate form inputs
    const validateForm = () => {
        // Email validation
        if (!email) {
            setShowerr('Email is required');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setShowerr('Please enter a valid email');
            return false;
        }
        
        // Password validation
        if (!password) {
            setShowerr('Password is required');
            return false;
        }
        
        return true;
    };
    
    // Function to handle form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        
        if (!validateForm()) {
            return;
        }
        
        try {
            // API Call to login user
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });
            
            const json = await response.json(); // Parse the response JSON
            
            if (json.authtoken) {
                // Store auth token in session storage
                sessionStorage.setItem("auth-token", json.authtoken);
                // Get user's email and store it
                sessionStorage.setItem("email", email);
                
                // Navigate to home page
                navigate('/');
                window.location.reload(); // Refresh the page
            } else {
                if (json.errors) {
                    // Show validation errors
                    for (const error of json.errors) {
                        setShowerr(error.msg);
                    }
                } else {
                    // Show authentication error
                    setShowerr(json.error || "Invalid credentials");
                }
            }
        } catch (error) {
            setShowerr('An error occurred during login. Please try again.');
        }
    };
    
    // JSX to render the Login form
    return (
        <div className="container">
            <div className="login-grid">
                <div className="login-text">
                    <h2>Login</h2>
                </div>
                <div className="login-text">
                    Are you a new member? <span><Link to="/signup" style={{ color: '#2190FF' }}>Sign Up Here</Link></span>
                </div>
                <br />
                <div className="login-form">
                    <form method="POST" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                className="form-control" 
                                placeholder="Enter your email" 
                                aria-describedby="helpId"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form-control"
                                placeholder="Enter your password"
                                aria-describedby="helpId"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        
                        {showerr && <div className="err" style={{ color: 'red', marginBottom: '10px' }}>{showerr}</div>}
                        
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary mb-2 mr-1 waves-effect waves-light">Login</button>
                            <button type="reset" className="btn btn-danger mb-2 waves-effect waves-light">Reset</button>
                        </div>
                        <br />
                        <div className="login-text">
                            Forgot Password?
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
