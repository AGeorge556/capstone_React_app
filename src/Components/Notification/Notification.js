import React, { useEffect, useState, useCallback } from 'react';
import './Notification.css';

// Function component Notification to display user notifications
const Notification = () => {
  // State variables to manage user authentication, username, doctor data, and appointment data
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [doctorData, setDoctorData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  // State variable to control notification visibility
  const [showNotification, setShowNotification] = useState(false);
  // State to track appointment cancellation
  const [isAppointmentCancelled, setIsAppointmentCancelled] = useState(false);

  // Create a memoized function to check appointments to avoid dependency issues
  const checkAppointments = useCallback((doctorName) => {
    if (!doctorName) return null;
    
    const appointmentsKey = `appointments-${doctorName}`;
    const appointmentsData = localStorage.getItem(appointmentsKey);
    
    if (!appointmentsData) return null;
    
    try {
      const appointments = JSON.parse(appointmentsData);
      return appointments.length > 0 ? appointments[0] : null;
    } catch (e) {
      console.error("Error parsing appointments:", e);
      return null;
    }
  }, []);

  // useEffect hook to perform side effects in the component
  useEffect(() => {
    // Retrieve stored username, doctor data from sessionStorage and localStorage
    const storedUsername = sessionStorage.getItem('email');
    const storedDoctorDataStr = localStorage.getItem('doctorData');
    let storedDoctorData = null;
    
    try {
      if (storedDoctorDataStr) {
        storedDoctorData = JSON.parse(storedDoctorDataStr);
      }
    } catch (e) {
      console.error("Error parsing doctor data:", e);
    }
    
    // Set isLoggedIn state to true and update username if storedUsername exists
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }

    // Set doctorData state if storedDoctorData exists
    if (storedDoctorData) {
      setDoctorData(storedDoctorData);
      
      // Check for appointments for this doctor
      const appointment = checkAppointments(storedDoctorData.name);
      
      if (appointment) {
        setAppointmentData(appointment);
        setShowNotification(true);
      }
    }
  }, []); // Only run once on mount

  // Separate useEffect for handling appointment cancellation
  useEffect(() => {
    if (!doctorData) return;
    
    let cancellationTimer = null;
    
    // Custom event for appointment cancellation
    const handleAppointmentCancel = (event) => {
      setIsAppointmentCancelled(true);
      setShowNotification(false);
      
      // Reset after a delay
      cancellationTimer = setTimeout(() => {
        setIsAppointmentCancelled(false);
        setAppointmentData(null);
      }, 3000);
    };
    
    // Add custom event listener
    window.addEventListener('appointmentCancelled', handleAppointmentCancel);
    
    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('appointmentCancelled', handleAppointmentCancel);
      if (cancellationTimer) {
        clearTimeout(cancellationTimer);
      }
    };
  }, [doctorData]); // Only run when doctorData changes

  // Function to handle notification close
  const handleCloseNotification = () => {
    setShowNotification(false);
  };
  
  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Don't render anything if no notification to show
  if ((!isLoggedIn || !showNotification || !appointmentData) && !isAppointmentCancelled) {
    return null;
  }

  // Return JSX elements to display appointment details if user is logged in
  return (
    <div>
      {/* Display appointment notification if user is logged in, showNotification is true, and appointment data exists */}
      {isLoggedIn && showNotification && appointmentData && (
        <div className="notification-container">
          <div className="notification-card">
            <button className="notification-close" onClick={handleCloseNotification}>×</button>
            <div className="notification-content">
              <h3 className="notification-title">Appointment Confirmed!</h3>
              <div className="notification-details">
                <p><strong>Doctor:</strong> {doctorData?.name}</p>
                <p><strong>Specialty:</strong> {doctorData?.speciality}</p>
                <p><strong>Patient:</strong> {appointmentData.name}</p>
                <p><strong>Date:</strong> {formatDate(appointmentData.appointmentDate)}</p>
                <p><strong>Time:</strong> {appointmentData.timeSlot}</p>
                <p><strong>Booked on:</strong> {appointmentData.bookingDate || 'Today'}</p>
              </div>
              <p className="notification-footer">
                You can view or cancel this appointment from the doctor's profile.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Display cancellation notification if an appointment was just cancelled */}
      {isLoggedIn && isAppointmentCancelled && (
        <div className="notification-container cancellation">
          <div className="notification-card cancellation">
            <div className="notification-content">
              <h3 className="notification-title">Appointment Cancelled</h3>
              <p className="notification-message">Your appointment has been successfully cancelled.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export Notification component for use in other parts of the application
export default Notification; 