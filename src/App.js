import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar/navbar';
import Landing_page from './Components/Landing_page/Landing_page';  // Ensure correct capitalization
import Login from './Components/Login/login';
import SignUp from './Components/Sign_up/Sign_up';
import InstantConsultation from './Components/InstantConsultationBooking/InstantConsultation';
import BookingConsultation from './Components/BookingConsultation/BookingConsultation';
import Notification from './Components/Notification';
import AppointmentNotification from './Components/AppointmentNotification';
import ReviewForm from './Components/ReviewForm/ReviewForm';
import ProfileCard from './Components/ProfileCard/ProfileCard';
import ReportsLayout from './Components/ReportsLayout/ReportsLayout';

// Function component for the main App
function App() {
    // Render the main App component
    return (
      <div className="App">
        {/* Set up BrowserRouter for routing */}
        <BrowserRouter>
          {/* Display the Navbar component */}
          <Navbar/>
          
          {/* Main content with routes */}
          <Routes>
            {/* Define individual Route components for different pages */}
            <Route path="/" element={<Landing_page/>}/> {/* Correct component name */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/instant-consultation" element={<InstantConsultation/>}/>
            <Route path="/booking-consultation" element={<BookingConsultation/>}/>
            <Route path="/reviews" element={<ReviewForm/>}/>
            <Route path="/profile" element={<ProfileCard/>}/>
            <Route path="/reports" element={<ReportsLayout/>}/>
          </Routes>
          <Notification />
          <AppointmentNotification />
        </BrowserRouter>
      </div>
    );
  }

export default App;
