import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { API_URL, USE_MOCK_API } from '../../config';

// Function component for Login form
const Login = () => {
    // State variables using useState hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState(''); // State to show error messages
    const [showSuccess, setShowSuccess] = useState(false); // State to show success message
    
    const navigate = useNavigate(); // Navigation hook from react-router
    
    // New state variable for server status
    const [isServerAvailable, setIsServerAvailable] = useState(!USE_MOCK_API);
    
    // Check for registration success message
    useEffect(() => {
        const registrationSuccess = sessionStorage.getItem("registration-success");
        if (registrationSuccess === "true") {
            setShowSuccess(true);
            // Remove the flag so it doesn't show again on page refresh
            sessionStorage.removeItem("registration-success");
        }
    }, []);
    
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
        
        // If we're in mock mode or server is unavailable
        if (USE_MOCK_API || !isServerAvailable) {
            // Mock login - store data in session storage
            // In a real app, you'd validate against a local DB
            
            // Basic validation logic for demo - accept any valid email/password
            if (password.length >= 6) {
                sessionStorage.setItem("auth-token", "mock-auth-token");
                sessionStorage.setItem("email", email);
                
                // Extract name from email for display
                const name = email.split('@')[0];
                sessionStorage.setItem("name", name);
                
                // Dispatch login event
                const loginEvent = new Event('login');
                window.dispatchEvent(loginEvent);
                
                // Navigate to home page
                navigate('/');
            } else {
                setShowerr('Invalid credentials');
            }
            return;
        }
        
        // If the server is available, try the API
        try {
            // Add a timeout to the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
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
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            const json = await response.json(); // Parse the response JSON
            
            if (json.authtoken) {
                // Store auth token in session storage
                sessionStorage.setItem("auth-token", json.authtoken);
                // Get user's email and store it
                sessionStorage.setItem("email", email);
                
                // Dispatch a custom login event to notify other components
                const loginEvent = new Event('login');
                window.dispatchEvent(loginEvent);
                
                // Navigate to home/landing page instead of instant consultation
                navigate('/');
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
            console.error('API call failed:', error);
            
            // Server unavailable - switch to mock mode
            setIsServerAvailable(false);
            setShowerr('Server unavailable. Please try again in a moment or continue in offline mode.');
            
            // Add a button to continue in offline mode
            // This will be handled in the JSX
        }
    };

    // Mock login function
    const handleMockLogin = () => {
        if (!validateForm()) {
            return;
        }
        
        // Simple mock login
        sessionStorage.setItem("auth-token", "mock-auth-token");
        sessionStorage.setItem("email", email);
        
        // Extract name from email for display
        const name = email.split('@')[0];
        sessionStorage.setItem("name", name);
        
        // Dispatch login event
        const loginEvent = new Event('login');
        window.dispatchEvent(loginEvent);
        
        // Navigate to home page
        navigate('/');
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
                {showSuccess && (
                    <div className="success-message" style={{ color: 'green', marginBottom: '15px', padding: '10px', backgroundColor: '#f0fff0', borderRadius: '5px' }}>
                        Registration successful! Please login with your credentials.
                    </div>
                )}
                {!isServerAvailable && !USE_MOCK_API && (
                    <div className="server-status-message" style={{ color: '#856404', marginBottom: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                        Server is currently unavailable. You will be logged in in offline mode.
                        <br /><small style={{ display: 'block', marginTop: '5px' }}>
                            To use the server: Navigate to the server folder and run <code>node index.js</code>
                        </small>
                    </div>
                )}
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
                            {!isServerAvailable && !USE_MOCK_API && (
                                <button type="button" className="btn btn-warning mb-2 waves-effect waves-light" onClick={handleMockLogin}>
                                    Continue Offline
                                </button>
                            )}
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
