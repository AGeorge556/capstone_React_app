import React, { useState, useEffect } from 'react';
import './ReportsLayout.css';

const ReportsLayout = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    // Function to fetch user reports
    const fetchReports = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call
        // For now, we'll use mock data
        const mockReports = [
          { 
            id: 1, 
            date: '2023-04-10', 
            type: 'Blood Test', 
            doctor: 'Dr. Sarah Johnson',
            summary: 'Normal blood count, slightly elevated cholesterol',
            fileUrl: '/reports/report_viewer.html?type=blood',
            fileName: 'blood_test_report.html'
          },
          { 
            id: 2, 
            date: '2023-03-15', 
            type: 'X-Ray', 
            doctor: 'Dr. Michael Chen',
            summary: 'No fractures detected, minor inflammation',
            fileUrl: '/reports/report_viewer.html?type=xray',
            fileName: 'xray_report.html'
          },
          { 
            id: 3, 
            date: '2023-02-22', 
            type: 'General Checkup', 
            doctor: 'Dr. Emily Rodriguez',
            summary: 'Patient in good health, recommended regular exercise',
            fileUrl: '/reports/report_viewer.html?type=general',
            fileName: 'general_checkup_report.html'
          },
          { 
            id: 4, 
            date: '2023-01-05', 
            type: 'Allergy Test', 
            doctor: 'Dr. David Williams',
            summary: 'Mild allergic reaction to pollen detected',
            fileUrl: '/reports/report_viewer.html?type=allergy',
            fileName: 'allergy_test_report.html'
          }
        ];

        // Simulate network delay
        setTimeout(() => {
          setReports(mockReports);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load reports. Please try again later.');
        setLoading(false);
      }
    };

    // Check if user is logged in
    const authToken = sessionStorage.getItem('auth-token');
    const email = sessionStorage.getItem('email');
    
    if (authToken && email) {
      fetchReports();
    } else {
      setError('Please log in to view your reports');
      setLoading(false);
    }
  }, []);

  // Format date from YYYY-MM-DD to Month DD, YYYY
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle view report action
  const handleViewReport = (report) => {
    setViewingReport(report);
    setReportModalOpen(true);
    
    // Open the HTML report in a new tab
    window.open(report.fileUrl, '_blank');
  };

  // Handle print report action
  const handlePrintReport = (report) => {
    // Open the report in a new tab and trigger print
    const printWindow = window.open(report.fileUrl, '_blank');
    if (printWindow) {
      setTimeout(() => {
        try {
          printWindow.print();
        } catch (e) {
          console.error('Print dialog could not be opened automatically', e);
        }
      }, 1000);
    }
  };

  // Handle download report action
  const handleDownloadReport = (report) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = report.fileUrl;
    link.download = report.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show instructions alert with a delay to ensure the click is processed
    setTimeout(() => {
      alert('To save as PDF: Use your browser\'s Print function and select "Save as PDF" as the destination.');
    }, 100);
  };

  // Close the report modal
  const closeReportModal = () => {
    setReportModalOpen(false);
    setViewingReport(null);
  };

  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-container">
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <h1>Your Medical Reports</h1>
      
      {reports.length === 0 ? (
        <div className="no-reports">
          <p>You don't have any medical reports yet.</p>
        </div>
      ) : (
        <>
          <div className="reports-summary">
            <p>You have <strong>{reports.length}</strong> medical reports available.</p>
          </div>
          
          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Doctor</th>
                  <th>Summary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{formatDate(report.date)}</td>
                    <td>{report.type}</td>
                    <td>{report.doctor}</td>
                    <td className="report-summary">{report.summary}</td>
                    <td className="report-actions">
                      <button 
                        className="view-report-btn"
                        onClick={() => handleViewReport(report)}
                        title="View Report"
                      >
                        View
                      </button>
                      <button 
                        className="print-report-btn"
                        onClick={() => handlePrintReport(report)}
                        title="Print Report"
                      >
                        Print
                      </button>
                      <button 
                        className="download-report-btn"
                        onClick={() => handleDownloadReport(report)}
                        title="Download Report"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Report Modal (for future enhancements) */}
      {reportModalOpen && viewingReport && (
        <div className="report-modal-backdrop" onClick={closeReportModal}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-modal-btn" 
              onClick={closeReportModal}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
            <h2>{viewingReport.type} Report</h2>
            <p>The report is now open in a new tab. If it didn't open automatically, please check your browser's popup settings.</p>
            <p className="modal-doctor">Doctor: {viewingReport.doctor}</p>
            <p className="modal-date">Date: {formatDate(viewingReport.date)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsLayout; 