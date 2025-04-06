import React, { useState, useEffect, useRef } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ handleClick }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Function to check authentication status
  const checkAuthStatus = () => {
    const authToken = sessionStorage.getItem('auth-token');
    const name = sessionStorage.getItem('name');
    const email = sessionStorage.getItem('email');
    
    if (authToken && email) {
      setIsLoggedIn(true);
      
      // Extract name from the email if name is not available
      if (name) {
        setUserName(name);
      } else if (email) {
        // Extract username from email (before @ symbol)
        const extractedName = email.split('@')[0];
        setUserName(extractedName);
      }
    } else {
      setIsLoggedIn(false);
    }
  };
  
  // Check for user authentication on component mount and when auth status changes
  useEffect(() => {
    // Initial check
    checkAuthStatus();
    
    // Add event listener for storage changes to detect login/logout from other components
    const handleStorageChange = (e) => {
      if (e.key === 'auth-token' || e.key === 'email' || e.key === 'name') {
        checkAuthStatus();
      }
    };
    
    // Create a custom event listener for login
    const handleLoginEvent = () => {
      checkAuthStatus();
    };
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      checkAuthStatus();
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('login', handleLoginEvent);
    window.addEventListener('profileUpdate', handleProfileUpdate);
    
    // Check auth status every second (as a fallback)
    const intervalId = setInterval(checkAuthStatus, 1000);
    
    // Handle clicks outside dropdown to close it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', handleLoginEvent);
      window.removeEventListener('profileUpdate', handleProfileUpdate);
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(intervalId);
    };
  }, []);
  
  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("auth-token");
    
    // Update state
    setIsLoggedIn(false);
    setUserName('');
    setShowDropdown(false);
    
    // Navigate to home page
    navigate('/');
  };
  
  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <nav>
      {/* Navigation logo section */}
      <div className="nav__logo">
        {/* Link to the home page */}
        <Link to="/">
          StayHealthy
          {/* Insert an SVG icon of a doctor with a stethoscope */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="26"
            width="26"
            viewBox="0 0 1000 1000"
            style={{ fill: '#3685fb' }}
          >
            <title>Doctor With Stethoscope SVG icon</title>
            <g>
              <g>
                <path d="M499.8,10c91.7,0,166,74.3,166,166c0,91.7-74.3,166-166,166c-91.7,0-166-74.3-166-166C333.8,84.3,408.1,10,499.8,10z"></path>
                <path d="M499.8,522.8c71.2,0,129.1-58.7,129.1-129.1H370.6C370.6,464.1,428.6,522.8,499.8,522.8z"></path>
                <path d="M693.2,395c-0.7,94.9-70.3,173.7-160.8,188.9v155.9c0,80.3-60.7,150.8-140.8,155.3c-83,4.7-152.7-58.9-157.6-139.7c-22-12.8-35.6-38.5-30.3-66.7c4.7-25.1,25.5-45.6,50.8-49.9c39.7-6.7,74.1,23.7,74.1,62.1c0,23-12.3,43-30.7,54.1c4.7,45.4,45.1,80.4,92.6,76c44.6-4,77.2-44...."></path>
              </g>
            </g>
          </svg>
        </Link>
        <span>.</span>
      </div>

      {/* Navigation icon section with an onClick event listener */}
      <div className="nav__icon" onClick={handleClick}>
        {/* Font Awesome icon for bars (hamburger menu) */}
        <i className="fa fa-times fa fa-bars"></i>
      </div>

      {/* Unordered list for navigation links with 'active' class */}
      <ul className="nav__links active">
        <li className="link">
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className="link">
              <Link to="/booking-consultation">Book Appointment</Link>
            </li>
            <li className="link">
              <Link to="/instant-consultation">Instant Consultation</Link>
            </li>
            <li className="link">
              <Link to="/reviews">Reviews</Link>
            </li>
            <li className="link user-profile-dropdown" ref={dropdownRef} style={{ zIndex: 1000 }}>
              <div className="profile-dropdown-toggle" onClick={toggleDropdown}>
                <div className="avatar-circle">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span>{userName}</span>
                <i className={`dropdown-arrow ${showDropdown ? 'up' : 'down'}`}></i>
              </div>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <i className="dropdown-icon profile-icon"></i>
                    My Profile
                  </Link>
                  <Link to="/reports" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <i className="dropdown-icon reports-icon"></i>
                    Your Reports
                  </Link>
                  <Link to="/reviews" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <i className="dropdown-icon reviews-icon"></i>
                    My Reviews
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <i className="dropdown-icon logout-icon"></i>
                    Logout
                  </button>
                </div>
              )}
            </li>
          </>
        ) : (
          // Display login and signup buttons if no user is logged in
          <>
            <li className="link">
              <Link to="/signup">
                <button className="btn1">Sign Up</button>
              </Link>
            </li>
            <li className="link">
              <Link to="/login">
                <button className="btn1">Login</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
