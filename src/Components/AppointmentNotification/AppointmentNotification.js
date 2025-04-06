import React, { useState, useEffect } from 'react';
import './AppointmentNotification.css';

const AppointmentNotification = () => {
  const [visible, setVisible] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);

  // Load data from localStorage and handle events
  useEffect(() => {
    let timer = null;
    
    // Function to check for appointment data
    const checkForAppointmentData = () => {
      try {
        // Get doctor data from localStorage
        const storedDoctorData = localStorage.getItem('doctorData');
        
        if (storedDoctorData) {
          const doctor = JSON.parse(storedDoctorData);
          setDoctorData(doctor);
          
          // Get appointments for this doctor
          const appointmentsKey = `appointments-${doctor.name}`;
          const storedAppointments = localStorage.getItem(appointmentsKey);
          
          if (storedAppointments) {
            const appointments = JSON.parse(storedAppointments);
            
            if (appointments.length > 0) {
              // Get the most recent appointment
              const latestAppointment = appointments[appointments.length - 1];
              setAppointmentData(latestAppointment);
              setVisible(true);
              
              // Remove doctor data to prevent showing notification again on refresh
              localStorage.removeItem('doctorData');
              
              // Auto-hide notification after 7 seconds
              timer = setTimeout(() => {
                setVisible(false);
              }, 7000);
            }
          }
        }
      } catch (error) {
        console.error("Error processing appointment data:", error);
      }
    };
    
    // Check immediately on mount
    checkForAppointmentData();
    
    // Listen for the custom appointment booked event
    const handleBookedEvent = () => {
      checkForAppointmentData();
    };
    
    // Add event listener
    window.addEventListener('appointmentBooked', handleBookedEvent);
    
    // Clean up
    return () => {
      window.removeEventListener('appointmentBooked', handleBookedEvent);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []); // Empty dependency array - run only on mount

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString;
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  // Don't render anything if no data or not visible
  if (!visible || !appointmentData || !doctorData) {
    return null;
  }

  return (
    <div className="appointment-notification-container">
      <div className="appointment-notification-card">
        <button className="close-notification-btn" onClick={handleClose}>
          &times;
        </button>
        
        <div className="appointment-notification-header">
          <h2>Appointment Details</h2>
        </div>
        
        <div className="appointment-notification-content">
          <div className="notification-detail">
            <strong>Doctor:</strong> Dr. {doctorData.name}
          </div>
          <div className="notification-detail">
            <strong>Speciality:</strong> {doctorData.speciality}
          </div>
          <div className="notification-detail">
            <strong>Name:</strong> {appointmentData.name}
          </div>
          <div className="notification-detail">
            <strong>Phone Number:</strong> {appointmentData.phoneNumber}
          </div>
          <div className="notification-detail">
            <strong>Date of Appointment:</strong> {formatDate(appointmentData.appointmentDate)}
          </div>
          <div className="notification-detail">
            <strong>Time Slot:</strong> {appointmentData.timeSlot}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentNotification; 