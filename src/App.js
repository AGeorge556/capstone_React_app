import logo from './logo.svg';
import './App.css';
// Import necessary modules from React library
import React, { useEffect } from 'react';
// Import components for routing from react-router-dom library
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import custom Navbar component
import Navbar from './Components/Navbar/navbar';
import Landing_page from './Components/Landing_page/Landing_page';  // Ensure correct capitalization
import Login from './Components/Login/login';
import SignUp from './Components/Sign_up/Sign_up';

// Function component for the main App
function App() {
    // Render the main App component
    return (
      <div className="App">
          {/* Set up BrowserRouter for routing */}
          <BrowserRouter>
            {/* Display the Navbar component */}
            <Navbar/>
            {/* Set up the Routes for different pages */}
            <Routes>
              {/* Define individual Route components for different pages */}
              <Route path="/" element={<Landing_page/>}/> {/* Correct component name */}
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<SignUp/>}/>
            </Routes>
          </BrowserRouter>
      </div>
    );
  }

export default App;
