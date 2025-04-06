import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './DoctorCardIC.css';
import AppointmentFormIC from '../AppointmentFormIC/AppointmentFormIC';
import { v4 as uuidv4 } from 'uuid';

const DoctorCardIC = ({ name, speciality, experience, ratings, profilePic }) => {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Load appointments from localStorage if available
    const savedAppointments = localStorage.getItem(`appointments-${name}`);
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, [name]);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem(`appointments-${name}`, JSON.stringify(appointments));
    }
  }, [appointments, name]);

  const handleBooking = () => {
    setShowModal(true);
  };

  const handleCancel = (appointmentId) => {
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== appointmentId);
    setAppointments(updatedAppointments);
    
    // Remove from localStorage if no appointments left
    if (updatedAppointments.length === 0) {
      localStorage.removeItem(`appointments-${name}`);
    } else {
      localStorage.setItem(`appointments-${name}`, JSON.stringify(updatedAppointments));
    }
    
    // Dispatch a custom event to notify other components about appointment cancellation
    const cancelEvent = new CustomEvent('appointmentCancelled', {
      detail: { doctorName: name, appointmentId }
    });
    window.dispatchEvent(cancelEvent);
  };

  const handleFormSubmit = (appointmentData) => {
    const newAppointment = {
      id: uuidv4(),
      doctorName: name,
      doctorSpeciality: speciality,
      bookingDate: new Date().toLocaleDateString(),
      ...appointmentData,
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    
    // Store appointments in localStorage
    localStorage.setItem(`appointments-${name}`, JSON.stringify(updatedAppointments));
    
    // Store doctor data in localStorage for the notification components
    localStorage.setItem('doctorData', JSON.stringify({
      name,
      speciality,
      experience,
      ratings
    }));
    
    setShowModal(false);
    
    // Dispatch an event specifically for the appointment notification
    const bookedEvent = new CustomEvent('appointmentBooked', {
      detail: { 
        doctorName: name, 
        appointment: newAppointment,
        notificationType: 'appointmentConfirmation'
      }
    });
    window.dispatchEvent(bookedEvent);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="doctor-card-container">
      <div className="doctor-card-details-container">
        <div className="doctor-card-profile-image-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
          </svg>
        </div>
        <div className="doctor-card-details">
          <div className="doctor-card-detail-name">Dr. {name}</div>
          <div className="doctor-card-detail-speciality">{speciality}</div>
          <div className="doctor-card-detail-experience">{experience} years experience</div>
          <div className="doctor-card-detail-consultationfees">Ratings: {ratings}</div>
        </div>
      </div>

      <div className="doctor-card-options-container">
        <Popup
          style={{ backgroundColor: '#FFFFFF' }}
          trigger={
            <button className={`book-appointment-btn ${appointments.length > 0 ? 'cancel-appointment' : ''}`}>
              {appointments.length > 0 ? (
                <div>View/Cancel Appointment</div>
              ) : (
                <div>Book Appointment</div>
              )}
              <div>No Booking Fee</div>
            </button>
          }
          modal
          open={showModal}
          onClose={() => setShowModal(false)}
        >
          {(close) => (
            <div className="doctorbg" style={{ height: '100vh', overflow: 'scroll' }}>
              <div className="popup-header">
                <div className="doctor-card-profile-image-container">
                  <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  </svg>
                </div>
                <div className="doctor-card-details">
                  <div className="doctor-card-detail-name">Dr. {name}</div>
                  <div className="doctor-card-detail-speciality">{speciality}</div>
                  <div className="doctor-card-detail-experience">{experience} years experience</div>
                  <div className="doctor-card-detail-consultationfees">Ratings: {ratings}</div>
                </div>
              </div>

              {appointments.length > 0 ? (
                <div className="appointments-container">
                  <h3 style={{ textAlign: 'center' }}>Your Appointments</h3>
                  {appointments.map((appointment) => (
                    <div className="bookedInfo" key={appointment.id}>
                      <p className="appointment-info"><strong>Patient:</strong> {appointment.name}</p>
                      <p className="appointment-info"><strong>Phone:</strong> {appointment.phoneNumber}</p>
                      <p className="appointment-info">
                        <strong>Date:</strong> {formatDate(appointment.appointmentDate)}
                      </p>
                      <p className="appointment-info"><strong>Time:</strong> {appointment.timeSlot}</p>
                      <p className="appointment-info"><strong>Booking Date:</strong> {appointment.bookingDate}</p>
                      <button 
                        className="cancel-button" 
                        onClick={() => handleCancel(appointment.id)}
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  ))}
                  <button className="close-button" onClick={close}>Close</button>
                </div>
              ) : (
                <AppointmentFormIC 
                  doctorName={name} 
                  doctorSpeciality={speciality} 
                  onSubmit={handleFormSubmit} 
                />
              )}
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
};

export default DoctorCardIC;
