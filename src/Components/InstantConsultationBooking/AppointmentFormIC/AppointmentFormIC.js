import React, { useState } from 'react';
import './AppointmentFormIC.css';

const AppointmentFormIC = ({ doctorName, doctorSpeciality, onSubmit }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    
    // Generate time slots from 9 AM to 5 PM
    const timeSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    
    // Calculate minimum date (today)
    const today = new Date();
    const minDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Calculate maximum date (3 months from today)
    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + 3);
    const maxDateStr = maxDate.toISOString().split('T')[0];
  
    const handleSlotSelection = (slot) => {
      setSelectedSlot(slot);
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      
      // Form validation
      if (!name || !phoneNumber || !appointmentDate || !selectedSlot) {
        alert('Please fill all the fields');
        return;
      }
      
      // Phone number validation
      if (!/^\d{10}$/.test(phoneNumber)) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }
      
      // Submit the form
      onSubmit({ 
        name, 
        phoneNumber,
        appointmentDate,
        timeSlot: selectedSlot 
      });
      
      // Reset form fields
      setName('');
      setPhoneNumber('');
      setAppointmentDate('');
      setSelectedSlot(null);
    };
  
    return (
      <form onSubmit={handleFormSubmit} className="appointment-form">
        <h3 className="form-title">Book Appointment with Dr. {doctorName}</h3>
        <p className="form-subtitle">{doctorSpeciality}</p>
        
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your 10-digit phone number"
            pattern="[0-9]{10}"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="appointmentDate">Appointment Date:</label>
          <input
            type="date"
            id="appointmentDate"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={minDate}
            max={maxDateStr}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Select Time Slot:</label>
          <div className="time-slots-container">
            {timeSlots.map((slot) => (
              <div 
                key={slot} 
                className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                onClick={() => handleSlotSelection(slot)}
              >
                {slot}
              </div>
            ))}
          </div>
          {!selectedSlot && <small className="error-text">Please select a time slot</small>}
        </div>
        
        <button type="submit" className="submit-button">Book Appointment</button>
      </form>
    );
  };

export default AppointmentFormIC;
