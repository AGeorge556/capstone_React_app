import React, { useState } from 'react';
import './Sign_up.css';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

// Function component for Sign Up form
const SignUp = () => {
    // State variables using useState hook
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState(''); // State to show error messages
    const navigate = useNavigate(); // Navigation hook from react-router

    // Function to handle form submission
    const register = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Validate form inputs
        if (!name) {
            setShowerr('Name is required');
            return;
        } else if (name.length < 4) {
            setShowerr('Name should be at least 4 characters');
            return;
        }
        
        if (!phone) {
            setShowerr('Phone number is required');
            return;
        } else if (!/^\d{10}$/.test(phone)) {
            setShowerr('Phone number must be exactly 10 digits');
            return;
        }
        
        if (!email) {
            setShowerr('Email is required');
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setShowerr('Please enter a valid email');
            return;
        }
        
        if (!password) {
            setShowerr('Password is required');
            return;
        } else if (password.length < 8) {
            setShowerr('Password should be at least 8 characters');
            return;
        }

        // API Call to register user
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                }),
            });

            const json = await response.json(); // Parse the response JSON

            if (json.authtoken) {
                // Store user data in session storage
                sessionStorage.setItem("auth-token", json.authtoken);
                sessionStorage.setItem("name", name);
                sessionStorage.setItem("phone", phone);
                sessionStorage.setItem("email", email);

                // Redirect user to home page
                navigate("/");
                window.location.reload(); // Refresh the page
            } else {
                if (json.errors) {
                    for (const error of json.errors) {
                        setShowerr(error.msg); // Show error messages
                    }
                } else {
                    setShowerr(json.error);
                }
            }
        } catch (error) {
            setShowerr("An error occurred while registering. Please try again.");
        }
    };

    // JSX to render the Sign Up form
    return (
        <div className="container" style={{marginTop:'5%'}}>
            <div className="signup-grid">
                <div className="signup-text">
                    <h1>Sign Up</h1>
                </div>
                <div className="signup-text1" style={{ textAlign: 'left' }}>
                    Already a member? <span><Link to="/login" style={{ color: '#2190FF' }}>Login</Link></span>
                </div>
                <div className="signup-form">
                    <form method="POST" onSubmit={register}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                type="text" 
                                name="name" 
                                id="name" 
                                className="form-control" 
                                placeholder="Enter your name" 
                                aria-describedby="helpId" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                type="tel" 
                                name="phone" 
                                id="phone" 
                                className="form-control" 
                                placeholder="Enter your phone number" 
                                aria-describedby="helpId" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                type="email" 
                                name="email" 
                                id="email" 
                                className="form-control" 
                                placeholder="Enter your email" 
                                aria-describedby="helpId" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                type="password" 
                                name="password" 
                                id="password" 
                                className="form-control" 
                                placeholder="Enter your password" 
                                aria-describedby="helpId" 
                            />
                        </div>
                        
                        {showerr && <div className="err" style={{ color: 'red', marginBottom: '10px' }}>{showerr}</div>}
                        
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary mb-2 mr-1 waves-effect waves-light">Submit</button>
                            <button type="reset" className="btn btn-danger mb-2 waves-effect waves-light">Reset</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp; // Export the SignUp component for use in other components
