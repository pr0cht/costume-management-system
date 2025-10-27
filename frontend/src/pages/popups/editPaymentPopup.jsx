import React, { useEffect, useState } from "react";

// The component receives the full payment object as a prop
function EditPaymentPopup({ payment, onClose, onPaymentUpdated }) {
    // State to hold the editable fields
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [paymentRemarks, setPaymentRemarks] = useState('');

    // Function to reset form state (optional but good practice)
    const resetForm = () => {
        setPaymentAmount('');
        setPaymentDate('');
        setPaymentRemarks('');
    };

    // UseEffect to populate the form when a new payment object is passed
    useEffect(() => {
        if (payment) {
            // Populate state from the payment object
            setPaymentAmount(payment.payment_Amount.toString() || '');
            setPaymentDate(payment.payment_Date || new Date().toISOString().split('T')[0]);
            setPaymentRemarks(payment.payment_Remarks || '');
        }

        // Cleanup function to reset state when the popup closes
        return () => {
            resetForm();
        };
    }, [payment]); // Reruns whenever the payment prop changes

    const handleEditPayment = async (e) => {
        e.preventDefault();

        // 1. Basic validation
        if (parseFloat(paymentAmount) <= 0) {
            alert("Payment amount must be greater than zero.");
            return;
        }

        try {
            const updatedPaymentData = {
                paymentId: payment.payment_ID,
                newAmount: parseFloat(paymentAmount),
                newDate: paymentDate,
                newRemarks: paymentRemarks,
            };

            // Send data to the main process
            const result = await window.electronAPI.editPayment(updatedPaymentData);

            if (result.success) {
                alert(`Payment record successfully updated.`);
                onPaymentUpdated(); // Refresh the parent table data
                onClose();          // Close the popup
            } else {
                alert(`Failed to edit payment: ${result.error}`);
            }
        } catch (error) {
            console.error("Error editing payment:", error);
            alert("An error occurred while editing the payment record.");
        }
    };

    // If no payment object is passed, render nothing (popup is closed)
    if (!payment) {
        return null;
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edit Payment Record</h2>
                <form className="edit-payment-form form" onSubmit={handleEditPayment}>
                    
                    {/* --- Display Client and Balance Info --- */}
                    <div className="info-box" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #7E001B', borderRadius: '5px' }}>
                        <p>Client: <strong>{payment.client_Name}</strong></p>
                        {/* Display the balance from the transaction linked to this payment */}
                        <p>Remaining Balance Due: 
                            <strong style={{ color: payment.balance > 0 ? '#E64848' : '#28a745', marginLeft: '10px' }}>
                                ₱{payment.balance.toFixed(2)}
                            </strong>
                        </p>
                    </div>

                    {/* --- Payment Amount --- */}
                    <div className="row spacebetween">
                        <label>New Payment Amount:</label>
                        <input 
                            className="text-input" 
                            type="number" 
                            min="0.01" 
                            step="0.01" 
                            required
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)} 
                        />
                    </div>
                    
                    {/* --- Date Paid --- */}
                    <div className="row spacebetween">
                        <label>Date Paid:</label>
                        <input 
                            className="text-input" 
                            type="date" 
                            required
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)} 
                        />
                    </div>
                    
                    {/* --- Remarks --- */}
                    <div className="row spacebetween">
                        <label>Remarks:</label>
                        <input 
                            className="text-input" 
                            type="text"
                            value={paymentRemarks}
                            onChange={(e) => setPaymentRemarks(e.target.value)} 
                            placeholder="Downpayment, Full Payment, etc."
                        />
                    </div>

                    <div className="form-actions row spacebetween" style={{ justifyContent: 'center' }}>
                        <button type="submit">Update Record</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPaymentPopup;