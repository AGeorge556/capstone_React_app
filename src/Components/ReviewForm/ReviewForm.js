import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewForm.css';

const ReviewForm = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviewData, setReviewData] = useState({
    doctorName: '',
    doctorSpecialty: '',
    rating: 0,
    comments: '',
    appointmentId: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const authToken = sessionStorage.getItem('auth-token');
    const email = sessionStorage.getItem('email');
    
    if (authToken && email) {
      setIsLoggedIn(true);
      // Get all appointments from localStorage
      getAllAppointments();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Retrieve all appointments from localStorage
  const getAllAppointments = () => {
    const allAppointments = [];
    
    // Search for all appointments in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('appointments-')) {
        try {
          const appointmentsData = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(appointmentsData)) {
            // Extract doctor name from the key
            const doctorName = key.replace('appointments-', '');
            
            // Add doctor name and review status to each appointment
            const appointments = appointmentsData.map(appointment => ({
              ...appointment,
              doctorName,
              reviewSubmitted: localStorage.getItem(`review-${appointment.id}`) ? true : false
            }));
            
            allAppointments.push(...appointments);
          }
        } catch (error) {
          console.error('Error parsing appointments:', error);
        }
      }
    }
    
    setAppointments(allAppointments);
  };

  // Open the review form for a specific doctor
  const handleOpenReviewForm = (appointment) => {
    setReviewData({
      doctorName: appointment.doctorName,
      doctorSpecialty: appointment.doctorSpeciality,
      rating: 0,
      comments: '',
      appointmentId: appointment.id
    });
    setShowReviewForm(true);
  };

  // Handle changes in the review form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: value
    });
  };

  // Handle star rating selection
  const handleRatingChange = (rating) => {
    setReviewData({
      ...reviewData,
      rating
    });
  };

  // Submit the review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    // Save review in localStorage
    localStorage.setItem(`review-${reviewData.appointmentId}`, JSON.stringify(reviewData));
    
    // Update the appointment in state to show review submitted
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === reviewData.appointmentId 
          ? { ...appointment, reviewSubmitted: true } 
          : appointment
      )
    );
    
    // Show success message and reset form
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewForm(false);
    }, 2000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString;
    }
  };

  if (!isLoggedIn) {
    return <div className="reviews-container">Please log in to view your appointments and provide feedback.</div>;
  }

  return (
    <div className="reviews-container">
      <h2>Reviews</h2>
      
      {appointments.length === 0 ? (
        <p className="no-appointments">You don't have any appointments to review.</p>
      ) : (
        <div className="reviews-table-container">
          <table className="reviews-table">
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Doctor Name</th>
                <th>Doctor Speciality</th>
                <th>Provide feedback</th>
                <th>Review Given</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.id}>
                  <td>{index + 1}</td>
                  <td>Dr. {appointment.doctorName}</td>
                  <td>{appointment.doctorSpeciality}</td>
                  <td>
                    <button 
                      className="review-button"
                      onClick={() => handleOpenReviewForm(appointment)}
                      disabled={appointment.reviewSubmitted}
                    >
                      Click Here
                    </button>
                  </td>
                  <td>
                    {appointment.reviewSubmitted ? (
                      <span className="review-given">✓</span>
                    ) : (
                      <span className="review-pending">×</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showReviewForm && (
        <div className="review-form-overlay">
          <div className="review-form-container">
            <button className="close-review-form" onClick={() => setShowReviewForm(false)}>×</button>
            <h3>Provide Feedback</h3>
            
            <div className="doctor-info">
              <p><strong>Doctor:</strong> Dr. {reviewData.doctorName}</p>
              <p><strong>Speciality:</strong> {reviewData.doctorSpecialty}</p>
            </div>
            
            <form onSubmit={handleSubmitReview}>
              <div className="rating-container">
                <label>Rating:</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`star ${reviewData.rating >= star ? 'selected' : ''}`}
                      onClick={() => handleRatingChange(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="comments">Comments:</label>
                <textarea
                  id="comments"
                  name="comments"
                  value={reviewData.comments}
                  onChange={handleInputChange}
                  placeholder="Share your experience with this doctor..."
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-review-btn">Submit Review</button>
            </form>
            
            {reviewSubmitted && (
              <div className="review-success">
                Thank you for your feedback!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm; 